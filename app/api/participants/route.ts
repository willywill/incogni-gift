import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, giftExchanges } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { getSession } from "@/app/lib/auth-server";

export async function POST(request: Request) {
	try {
		// Parse request body
		const body = await request.json();
		const { exchangeId, firstName, lastName, visitorId } = body;

		// Validate inputs
		if (
			!exchangeId ||
			typeof exchangeId !== "string" ||
			exchangeId.trim().length === 0
		) {
			return NextResponse.json(
				{ error: "Exchange ID is required" },
				{ status: 400 },
			);
		}

		if (
			!firstName ||
			typeof firstName !== "string" ||
			firstName.trim().length === 0
		) {
			return NextResponse.json(
				{ error: "First name is required" },
				{ status: 400 },
			);
		}

		if (
			!lastName ||
			typeof lastName !== "string" ||
			lastName.trim().length === 0
		) {
			return NextResponse.json(
				{ error: "Last name is required" },
				{ status: 400 },
			);
		}

		// Verify exchange exists
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(eq(giftExchanges.id, exchangeId))
			.limit(1);

		if (!exchange) {
			return NextResponse.json(
				{ error: "Exchange not found" },
				{ status: 404 },
			);
		}

		// Normalize visitor ID if provided
		const normalizedVisitorId =
			visitorId && typeof visitorId === "string" ? visitorId.trim() : null;

		// If visitor ID is provided, clear it from all previous participant records
		// This ensures only the most recent participant is associated with that visitor ID
		if (normalizedVisitorId && normalizedVisitorId.length > 0) {
			await db
				.update(participants)
				.set({ visitorId: null })
				.where(eq(participants.visitorId, normalizedVisitorId));
		}

		// Create participant record
		const id = crypto.randomUUID();
		const now = new Date();

		const [newParticipant] = await db
			.insert(participants)
			.values({
				id,
				exchangeId,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				visitorId: normalizedVisitorId,
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		return NextResponse.json(
			{
				id: newParticipant.id,
				exchangeId: newParticipant.exchangeId,
				firstName: newParticipant.firstName,
				lastName: newParticipant.lastName,
				createdAt: newParticipant.createdAt,
				updatedAt: newParticipant.updatedAt,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating participant:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		// Get the current session
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const exchangeId = searchParams.get("exchangeId");

		if (
			!exchangeId ||
			typeof exchangeId !== "string" ||
			exchangeId.trim().length === 0
		) {
			return NextResponse.json(
				{ error: "Exchange ID is required" },
				{ status: 400 },
			);
		}

		// Verify the user owns this exchange
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.id, exchangeId),
					eq(giftExchanges.createdBy, session.user.id),
				),
			)
			.limit(1);

		if (!exchange) {
			return NextResponse.json(
				{ error: "Exchange not found or access denied" },
				{ status: 404 },
			);
		}

		// Get all participants for this exchange
		const participantsList = await db
			.select()
			.from(participants)
			.where(eq(participants.exchangeId, exchangeId))
			.orderBy(participants.createdAt);

		return NextResponse.json(
			participantsList.map((participant) => ({
				id: participant.id,
				exchangeId: participant.exchangeId,
				firstName: participant.firstName,
				lastName: participant.lastName,
				createdAt: participant.createdAt,
				updatedAt: participant.updatedAt,
			})),
		);
	} catch (error) {
		console.error("Error fetching participants:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
