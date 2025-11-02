import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { giftExchanges, participants, assignments } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export async function POST(
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

		const { id } = await params;

		// Verify the user owns this exchange
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.id, id),
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

		// Check exchange status
		if (exchange.status !== "active") {
			return NextResponse.json(
				{ error: `Exchange has already been ${exchange.status}` },
				{ status: 400 }
			);
		}

		// Get all participants for this exchange
		const participantsList = await db
			.select()
			.from(participants)
			.where(eq(participants.exchangeId, id))
			.orderBy(participants.createdAt);

		// Verify we have at least 2 participants
		if (participantsList.length < 2) {
			return NextResponse.json(
				{ error: "Need at least 2 participants to start the exchange" },
				{ status: 400 }
			);
		}

		// Check if assignments already exist (exchange might have been started already)
		const existingAssignments = await db
			.select()
			.from(assignments)
			.where(eq(assignments.exchangeId, id))
			.limit(1);

		if (existingAssignments.length > 0) {
			return NextResponse.json(
				{ error: "Exchange has already been started" },
				{ status: 400 }
			);
		}

		// Shuffle participants randomly
		const shuffledParticipants = shuffle(participantsList);
		const now = new Date();
		const assignmentRecords: Array<{
			id: string;
			exchangeId: string;
			participantId: string;
			assignedToParticipantId: string;
			createdAt: Date;
			updatedAt: Date;
		}> = [];

		// Create pairings based on number of participants
		if (participantsList.length % 2 === 0) {
			// Even number: create pairs
			// participant[0] → participant[1], participant[2] → participant[3], etc.
			for (let i = 0; i < shuffledParticipants.length; i += 2) {
				const giver = shuffledParticipants[i];
				const receiver = shuffledParticipants[i + 1];

				assignmentRecords.push({
					id: crypto.randomUUID(),
					exchangeId: id,
					participantId: giver.id,
					assignedToParticipantId: receiver.id,
					createdAt: now,
					updatedAt: now,
				});
			}
		} else {
			// Odd number: create pairs for all but last 3, then create a 3-way circle
			const pairCount = Math.floor((shuffledParticipants.length - 3) / 2);

			// Create regular pairs
			for (let i = 0; i < pairCount * 2; i += 2) {
				const giver = shuffledParticipants[i];
				const receiver = shuffledParticipants[i + 1];

				assignmentRecords.push({
					id: crypto.randomUUID(),
					exchangeId: id,
					participantId: giver.id,
					assignedToParticipantId: receiver.id,
					createdAt: now,
					updatedAt: now,
				});
			}

			// Create 3-way circle for the last 3 participants
			// A → B → C → A
			const lastThree = shuffledParticipants.slice(-3);
			const [a, b, c] = lastThree;

			assignmentRecords.push(
				{
					id: crypto.randomUUID(),
					exchangeId: id,
					participantId: a.id,
					assignedToParticipantId: b.id,
					createdAt: now,
					updatedAt: now,
				},
				{
					id: crypto.randomUUID(),
					exchangeId: id,
					participantId: b.id,
					assignedToParticipantId: c.id,
					createdAt: now,
					updatedAt: now,
				},
				{
					id: crypto.randomUUID(),
					exchangeId: id,
					participantId: c.id,
					assignedToParticipantId: a.id,
					createdAt: now,
					updatedAt: now,
				}
			);
		}

		// Insert all assignments in a transaction
		await db.insert(assignments).values(assignmentRecords);

		// Update exchange status to "started"
		const [updatedExchange] = await db
			.update(giftExchanges)
			.set({
				status: "started",
				updatedAt: now,
			})
			.where(eq(giftExchanges.id, id))
			.returning();

		return NextResponse.json({
			success: true,
			exchange: {
				id: updatedExchange.id,
				status: updatedExchange.status,
				updatedAt: updatedExchange.updatedAt,
			},
			assignments: assignmentRecords.map((a) => ({
				id: a.id,
				participantId: a.participantId,
				assignedToParticipantId: a.assignedToParticipantId,
			})),
		});
	} catch (error) {
		console.error("Error starting exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

