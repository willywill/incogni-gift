import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, assignments, wishlistItems } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: participantId } = await params;

		// Parse request body
		const body = await request.json();
		const { wishlistItemId, completed } = body;

		// Validate inputs
		if (!wishlistItemId || typeof wishlistItemId !== "string") {
			return NextResponse.json(
				{ error: "Wishlist item ID is required" },
				{ status: 400 }
			);
		}

		if (typeof completed !== "boolean") {
			return NextResponse.json(
				{ error: "Completed status must be a boolean" },
				{ status: 400 }
			);
		}

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

		// Verify the wishlist item belongs to the assigned participant
		const [item] = await db
			.select()
			.from(wishlistItems)
			.where(eq(wishlistItems.id, wishlistItemId))
			.limit(1);

		if (!item) {
			return NextResponse.json(
				{ error: "Wishlist item not found" },
				{ status: 404 }
			);
		}

		if (item.participantId !== assignment.assignedToParticipantId) {
			return NextResponse.json(
				{ error: "Access denied" },
				{ status: 403 }
			);
		}

		// Update the wishlist item
		const now = new Date();
		const [updatedItem] = await db
			.update(wishlistItems)
			.set({
				completed: completed,
				completedBy: completed ? participantId : null,
				completedAt: completed ? now : null,
				updatedAt: now,
			})
			.where(eq(wishlistItems.id, wishlistItemId))
			.returning();

		return NextResponse.json({
			id: updatedItem.id,
			description: updatedItem.description,
			completed: updatedItem.completed,
			completedBy: updatedItem.completedBy,
			completedAt: updatedItem.completedAt,
		});
	} catch (error) {
		console.error("Error updating wishlist item completion:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

