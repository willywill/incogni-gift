import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { giftExchanges, user } from "@/app/db/schema";
import { eq, and, desc, sql, isNotNull, or } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: Request) {
	try {
		// Get the current session
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await request.json();
		const { name, spendingLimit, currency, magicWord } = body;

		// Validate inputs
		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return NextResponse.json(
				{ error: "Name is required" },
				{ status: 400 }
			);
		}

		if (
			!spendingLimit ||
			typeof spendingLimit !== "number" ||
			spendingLimit <= 0 ||
			spendingLimit % 5 !== 0
		) {
			return NextResponse.json(
				{ error: "Spending limit must be a positive number in increments of 5" },
				{ status: 400 }
			);
		}

		if (!currency || typeof currency !== "string") {
			return NextResponse.json(
				{ error: "Currency is required" },
				{ status: 400 }
			);
		}

		if (!magicWord || typeof magicWord !== "string" || magicWord.trim().length < 3) {
			return NextResponse.json(
				{ error: "Magic word is required and must be at least 3 characters long" },
				{ status: 400 }
			);
		}

		// Normalize magic word
		const normalizedMagicWord = magicWord.trim();

		// Get the creator's lastName to check for duplicates
		const [creatorData] = await db
			.select({ lastName: user.lastName })
			.from(user)
			.where(eq(user.id, session.user.id))
			.limit(1);

		// Check for duplicate: same lastName + same magicWord combination
		// This ensures uniqueness across all users (if two users have same lastName + same magicWord, it's a conflict)
		if (creatorData?.lastName) {
			const normalizedLastName = creatorData.lastName.trim();
			const duplicateCheck = await db
				.select()
				.from(giftExchanges)
				.innerJoin(user, eq(giftExchanges.createdBy, user.id))
				.where(
					and(
						isNotNull(giftExchanges.magicWord),
						isNotNull(user.lastName),
						sql`${giftExchanges.magicWord} ILIKE ${normalizedMagicWord}`,
						sql`${user.lastName} ILIKE ${normalizedLastName}`,
						eq(giftExchanges.status, "active")
					)
				)
				.limit(1);

			if (duplicateCheck.length > 0) {
				return NextResponse.json(
					{ error: "An exchange with this magic word already exists. Please choose a different magic word." },
					{ status: 400 }
				);
			}
		}

		// Create the gift exchange
		const id = crypto.randomUUID();
		const now = new Date();

		const [newExchange] = await db
			.insert(giftExchanges)
			.values({
				id,
				name: name.trim(),
				magicWord: normalizedMagicWord,
				spendingLimit,
				currency,
				status: "active",
				createdBy: session.user.id,
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		return NextResponse.json(
			{
				id: newExchange.id,
				name: newExchange.name,
				magicWord: newExchange.magicWord,
				spendingLimit: newExchange.spendingLimit,
				currency: newExchange.currency,
				status: newExchange.status,
				createdBy: newExchange.createdBy,
				createdAt: newExchange.createdAt,
				updatedAt: newExchange.updatedAt,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating gift exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	try {
		// Get the current session
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get all active, started, and ended gift exchanges for this user
		const exchanges = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.createdBy, session.user.id),
					or(
						eq(giftExchanges.status, "active"),
						eq(giftExchanges.status, "started"),
						eq(giftExchanges.status, "ended")
					)
				)
			)
			.orderBy(desc(giftExchanges.createdAt));

		return NextResponse.json(
			exchanges.map((exchange) => ({
				id: exchange.id,
				name: exchange.name,
				magicWord: exchange.magicWord,
				spendingLimit: exchange.spendingLimit,
				currency: exchange.currency,
				status: exchange.status,
				createdBy: exchange.createdBy,
				createdAt: exchange.createdAt,
				updatedAt: exchange.updatedAt,
			}))
		);
	} catch (error) {
		console.error("Error fetching gift exchanges:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

