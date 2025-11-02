import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, giftExchanges } from "@/app/db/schema";
import { sql, and, eq, isNotNull } from "drizzle-orm";

export async function POST(request: Request) {
	try {
		// Parse request body
		const body = await request.json();
		const { exchangeId, firstName, lastName } = body;

		// Validate inputs
		if (!exchangeId || typeof exchangeId !== "string" || exchangeId.trim().length === 0) {
			return NextResponse.json(
				{ error: "Exchange ID is required" },
				{ status: 400 }
			);
		}

		if (!firstName || typeof firstName !== "string" || firstName.trim().length === 0) {
			return NextResponse.json(
				{ error: "First name is required" },
				{ status: 400 }
			);
		}

		if (!lastName || typeof lastName !== "string" || lastName.trim().length === 0) {
			return NextResponse.json(
				{ error: "Last name is required" },
				{ status: 400 }
			);
		}

		const normalizedExchangeId = exchangeId.trim();
		const normalizedFirstName = firstName.trim();
		const normalizedLastName = lastName.trim();

		// Find participant by name within the specified exchange
		// Use ILIKE for case-insensitive matching (PostgreSQL specific)
		const [participant] = await db
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
					eq(participants.exchangeId, normalizedExchangeId),
					sql`${participants.firstName} ILIKE ${normalizedFirstName}`,
					sql`${participants.lastName} ILIKE ${normalizedLastName}`,
					isNotNull(participants.lastName)
				)
			)
			.limit(1);

		// Return the participant if found
		if (participant) {
			return NextResponse.json({
				found: true,
				participant: {
					id: participant.participantId,
					firstName: participant.participantFirstName,
					lastName: participant.participantLastName,
					name: `${participant.participantFirstName} ${participant.participantLastName || ""}`.trim(),
					exchangeId: participant.exchangeId,
					exchangeName: participant.exchangeName,
					exchangeStatus: participant.exchangeStatus,
				},
			});
		}

		return NextResponse.json({
			found: false,
			participant: null,
		});
	} catch (error) {
		console.error("Error looking up participant by name:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

