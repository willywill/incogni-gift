import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { participants, giftExchanges } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

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

		// Verify exchange exists
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(eq(giftExchanges.id, exchangeId))
			.limit(1);

		if (!exchange) {
			return NextResponse.json(
				{ error: "Exchange not found" },
				{ status: 404 }
			);
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
				lastName: lastName ? lastName.trim() : null,
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
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating participant:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

