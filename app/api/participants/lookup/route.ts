import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, giftExchanges } from "@/app/db/schema";
import { eq, and, isNotNull, desc } from "drizzle-orm";

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

		// Find the latest participant entry with this visitor ID
		// Return the most recent participant regardless of exchange status (started or not-started)
		const [latestParticipant] = await db
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
					isNotNull(participants.visitorId)
				)
			)
			.orderBy(desc(participants.createdAt))
			.limit(1);

		// Return the latest exchange the visitor is part of
		if (latestParticipant) {
			return NextResponse.json({
				found: true,
				exchange: {
					participantId: latestParticipant.participantId,
					participantName: `${latestParticipant.participantFirstName} ${latestParticipant.participantLastName || ""}`.trim(),
					exchangeId: latestParticipant.exchangeId,
					exchangeName: latestParticipant.exchangeName,
				},
			});
		}

		return NextResponse.json({
			found: false,
			exchange: null,
		});
	} catch (error) {
		console.error("Error looking up participant by visitor ID:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

