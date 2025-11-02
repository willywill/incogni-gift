import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { giftExchanges, user } from "@/app/db/schema";
import { sql, and, eq, isNotNull, or } from "drizzle-orm";

export async function POST(request: Request) {
	try {
		// Parse request body
		const body = await request.json();
		const { lastName, magicWord } = body;

		// Validate inputs
		if (!lastName || typeof lastName !== "string" || lastName.trim().length === 0) {
			return NextResponse.json(
				{ error: "Last name is required" },
				{ status: 400 }
			);
		}

		if (!magicWord || typeof magicWord !== "string" || magicWord.trim().length === 0) {
			return NextResponse.json(
				{ error: "Magic word is required" },
				{ status: 400 }
			);
		}

		// Normalize inputs (trim for case-insensitive matching)
		const normalizedLastName = lastName.trim();
		const normalizedMagicWord = magicWord.trim();

		// Query: Join giftExchanges with user table to find exchange by organizer's lastName and magicWord
		// Use ILIKE for case-insensitive matching on both fields (PostgreSQL specific)
		// Only return exchanges where magicWord is not null
		const result = await db
			.select({
				id: giftExchanges.id,
				name: giftExchanges.name,
				magicWord: giftExchanges.magicWord,
				spendingLimit: giftExchanges.spendingLimit,
				currency: giftExchanges.currency,
				status: giftExchanges.status,
				createdBy: giftExchanges.createdBy,
				createdAt: giftExchanges.createdAt,
				updatedAt: giftExchanges.updatedAt,
			})
			.from(giftExchanges)
			.innerJoin(user, eq(giftExchanges.createdBy, user.id))
			.where(
				and(
					isNotNull(giftExchanges.magicWord),
					isNotNull(user.lastName),
					sql`${giftExchanges.magicWord} ILIKE ${normalizedMagicWord}`,
					sql`${user.lastName} ILIKE ${normalizedLastName}`,
					or(eq(giftExchanges.status, "active"), eq(giftExchanges.status, "started"))
				)
			)
			.limit(1);

		// If no match found, return 404
		if (result.length === 0) {
			return NextResponse.json(
				{ error: "No exchange found matching the provided information" },
				{ status: 404 }
			);
		}

		const exchange = result[0];

		return NextResponse.json({
			id: exchange.id,
			name: exchange.name,
			spendingLimit: exchange.spendingLimit,
			currency: exchange.currency,
			status: exchange.status,
			createdAt: exchange.createdAt,
			updatedAt: exchange.updatedAt,
		});
	} catch (error) {
		console.error("Error looking up gift exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

