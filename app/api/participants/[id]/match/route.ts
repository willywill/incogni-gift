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

		// Optional: validate visitor ID matches if provided and participant has one stored
		// Only deny access if both visitorId (from query) and participant.visitorId exist and don't match
		// This allows users who found themselves by name to access even without matching visitor ID
		if (visitorId && participant.visitorId && participant.visitorId !== visitorId) {
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

		if (exchange.status !== "started" && exchange.status !== "ended") {
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
			// Check if any assignments exist for this exchange
			const existingAssignments = await db
				.select()
				.from(assignments)
				.where(eq(assignments.exchangeId, participant.exchangeId))
				.limit(1);

			if (existingAssignments.length > 0) {
				// Assignments exist but this participant doesn't have one
				return NextResponse.json(
					{ error: "You are not assigned in this exchange. Please contact the organizer." },
					{ status: 404 }
				);
			}
			
			// No assignments exist for this exchange at all
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

		// If exchange is ended OR showRecipientNames is enabled, get the matched participant's name
		let matchedParticipantName: string | null = null;
		if (exchange.status === "ended" || exchange.showRecipientNames) {
			const [matchedParticipant] = await db
				.select()
				.from(participants)
				.where(eq(participants.id, assignment.assignedToParticipantId))
				.limit(1);

			if (matchedParticipant) {
				matchedParticipantName = `${matchedParticipant.firstName} ${matchedParticipant.lastName || ""}`.trim();
			}
		}

		// If exchange is ended AND showRecipientNames is enabled, also get who is buying for this participant
		let buyingForYouName: string | null = null;
		if (exchange.status === "ended" && exchange.showRecipientNames) {
			const [reverseAssignment] = await db
				.select()
				.from(assignments)
				.where(
					and(
						eq(assignments.exchangeId, participant.exchangeId),
						eq(assignments.assignedToParticipantId, participantId)
					)
				)
				.limit(1);

			if (reverseAssignment) {
				const [buyingParticipant] = await db
					.select()
					.from(participants)
					.where(eq(participants.id, reverseAssignment.participantId))
					.limit(1);

				if (buyingParticipant) {
					buyingForYouName = `${buyingParticipant.firstName} ${buyingParticipant.lastName || ""}`.trim();
				}
			}
		}

		// Return wishlist items (name revealed if exchange is ended OR showRecipientNames is enabled)
		return NextResponse.json({
			wishlistItems: wishlistItemsList.map((item) => ({
				id: item.id,
				description: item.description,
				createdAt: item.createdAt,
				completed: item.completed || false,
				completedBy: item.completedBy || null,
				completedAt: item.completedAt || null,
			})),
			exchangeInfo: {
				name: exchange.name,
				spendingLimit: exchange.spendingLimit,
				currency: exchange.currency,
				status: exchange.status,
				showRecipientNames: exchange.showRecipientNames,
				matchedParticipantName: matchedParticipantName,
				buyingForYouName: buyingForYouName,
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

