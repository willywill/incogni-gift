import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, giftExchanges } from "@/app/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";

export async function POST(request: Request) {
	try {
		// Parse request body
		const body = await request.json();
		const { visitorId } = body;

		// Validate inputs
		if (!visitorId || typeof visitorId !== "string" || visitorId.trim().length === 0) {
			return NextResponse.json(
				{ error: "Visitor ID is required" },
				{ status: 400 }
			);
		}

		const normalizedVisitorId = visitorId.trim();

		// Find all participants with this visitor ID
		// Join with exchanges to filter only exchanges that have started
		const participantsList = await db
			.select({
				participantId: participants.id,
				participantFirstName: participants.firstName,
				participantLastName: participants.lastName,
				exchangeId: participants.exchangeId,
				exchangeName: giftExchanges.name,
				exchangeStatus: giftExchanges.status,
			})
			.from(participants)
			.innerJoin(giftExchanges, eq(participants.exchangeId, giftExchanges.id))
			.where(
				and(
					eq(participants.visitorId, normalizedVisitorId),
					isNotNull(participants.visitorId),
					eq(giftExchanges.status, "started")
				)
			)
			.orderBy(giftExchanges.createdAt);

		// Return list of exchanges the visitor is part of
		const exchanges = participantsList.map((p) => ({
			participantId: p.participantId,
			participantName: `${p.participantFirstName} ${p.participantLastName || ""}`.trim(),
			exchangeId: p.exchangeId,
			exchangeName: p.exchangeName,
		}));

		return NextResponse.json({
			found: exchanges.length > 0,
			exchanges,
		});
	} catch (error) {
		console.error("Error looking up participant by visitor ID:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

