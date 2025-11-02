import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { assignments, giftExchanges, participants } from "@/app/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET(request: Request) {
	try {
		// Get the current session
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const exchangeId = searchParams.get("exchangeId");

		if (!exchangeId || typeof exchangeId !== "string" || exchangeId.trim().length === 0) {
			return NextResponse.json(
				{ error: "Exchange ID is required" },
				{ status: 400 }
			);
		}

		// Verify the user owns this exchange
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.id, exchangeId),
					eq(giftExchanges.createdBy, session.user.id)
				)
			)
			.limit(1);

		if (!exchange) {
			return NextResponse.json(
				{ error: "Exchange not found or access denied" },
				{ status: 404 }
			);
		}

		// Get all assignments for this exchange with participant names
		const assignmentsList = await db
			.select({
				id: assignments.id,
				participantId: assignments.participantId,
				assignedToParticipantId: assignments.assignedToParticipantId,
				giverFirstName: participants.firstName,
				giverLastName: participants.lastName,
			})
			.from(assignments)
			.innerJoin(
				participants,
				eq(assignments.participantId, participants.id)
			)
			.where(eq(assignments.exchangeId, exchangeId));

		// Get receiver names
		const receiverIds = assignmentsList.map((a) => a.assignedToParticipantId);
		const receivers = receiverIds.length > 0 ? await db
			.select({
				id: participants.id,
				firstName: participants.firstName,
				lastName: participants.lastName,
			})
			.from(participants)
			.where(inArray(participants.id, receiverIds)) : [];

		// Create a map of receiver IDs to names
		const receiverMap = new Map(
			receivers.map((r) => [r.id, `${r.firstName} ${r.lastName || ""}`.trim()])
		);

		// Combine with receiver names
		const result = assignmentsList.map((assignment) => ({
			id: assignment.id,
			participantId: assignment.participantId,
			assignedToParticipantId: assignment.assignedToParticipantId,
			giverName: `${assignment.giverFirstName} ${assignment.giverLastName || ""}`.trim(),
			receiverName: receiverMap.get(assignment.assignedToParticipantId) || "Unknown",
		}));

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error fetching assignments:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

