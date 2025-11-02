import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, assignments, wishlistItems, giftExchanges } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: participantId } = await params;

		// Parse query parameters for optional visitor ID validation
		const { searchParams } = new URL(request.url);
		const visitorId = searchParams.get("visitorId");

		// Verify participant exists
		const [participant] = await db
			.select()
			.from(participants)
			.where(eq(participants.id, participantId))
			.limit(1);

		if (!participant) {
			return NextResponse.json(
				{ error: "Participant not found" },
				{ status: 404 }
			);
		}

		// Optional: validate visitor ID matches if provided
		if (visitorId && participant.visitorId !== visitorId) {
			return NextResponse.json(
				{ error: "Access denied" },
				{ status: 403 }
			);
		}

		// Verify the exchange has started
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(eq(giftExchanges.id, participant.exchangeId))
			.limit(1);

		if (!exchange) {
			return NextResponse.json(
				{ error: "Exchange not found" },
				{ status: 404 }
			);
		}

		if (exchange.status !== "started") {
			return NextResponse.json(
				{ error: "Exchange has not started yet" },
				{ status: 400 }
			);
		}

		// Find the assignment for this participant
		const [assignment] = await db
			.select()
			.from(assignments)
			.where(
				and(
					eq(assignments.exchangeId, participant.exchangeId),
					eq(assignments.participantId, participantId)
				)
			)
			.limit(1);

		if (!assignment) {
			return NextResponse.json(
				{ error: "Assignment not found. Exchange may not have been started yet." },
				{ status: 404 }
			);
		}

		// Get the assigned participant's wishlist items
		const wishlistItemsList = await db
			.select()
			.from(wishlistItems)
			.where(eq(wishlistItems.participantId, assignment.assignedToParticipantId))
			.orderBy(wishlistItems.createdAt);

		// Return anonymous wishlist items (no name revealed)
		return NextResponse.json({
			wishlistItems: wishlistItemsList.map((item) => ({
				id: item.id,
				description: item.description,
				createdAt: item.createdAt,
			})),
			exchangeInfo: {
				spendingLimit: exchange.spendingLimit,
				currency: exchange.currency,
			},
		});
	} catch (error) {
		console.error("Error fetching participant match:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

