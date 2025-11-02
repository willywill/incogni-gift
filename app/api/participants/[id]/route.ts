import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, giftExchanges } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/app/lib/auth-server";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: participantId } = await params;

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

		return NextResponse.json({
			id: participant.id,
			exchangeId: participant.exchangeId,
			firstName: participant.firstName,
			lastName: participant.lastName,
		});
	} catch (error) {
		console.error("Error fetching participant:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Get the current session
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { id: participantId } = await params;

		// Verify participant exists and get the exchange ID
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

		// Verify the user owns this exchange
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.id, participant.exchangeId),
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

		// Delete the participant (wishlist items will cascade automatically)
		await db
			.delete(participants)
			.where(eq(participants.id, participantId));

		return NextResponse.json(
			{ message: "Participant deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting participant:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

