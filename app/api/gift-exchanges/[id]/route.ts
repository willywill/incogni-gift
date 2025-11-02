import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { giftExchanges } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
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

		// Parse request body
		const body = await request.json();
		const { name, spendingLimit, currency, magicWord } = body;

		// First, verify the user owns this exchange
		const [existingExchange] = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.id, id),
					eq(giftExchanges.createdBy, session.user.id)
				)
			)
			.limit(1);

		if (!existingExchange) {
			return NextResponse.json(
				{ error: "Exchange not found or access denied" },
				{ status: 404 }
			);
		}

		// Build update object with only provided fields
		const updates: {
			name?: string;
			spendingLimit?: number;
			currency?: string;
			magicWord?: string;
			updatedAt: Date;
		} = {
			updatedAt: new Date(),
		};

		if (name !== undefined) {
			if (typeof name !== "string" || name.trim().length === 0) {
				return NextResponse.json(
					{ error: "Name must be a non-empty string" },
					{ status: 400 }
				);
			}
			updates.name = name.trim();
		}

		if (spendingLimit !== undefined) {
			if (
				typeof spendingLimit !== "number" ||
				spendingLimit <= 0 ||
				spendingLimit % 5 !== 0
			) {
				return NextResponse.json(
					{ error: "Spending limit must be a positive number in increments of 5" },
					{ status: 400 }
				);
			}
			updates.spendingLimit = spendingLimit;
		}

		if (currency !== undefined) {
			if (typeof currency !== "string") {
				return NextResponse.json(
					{ error: "Currency must be a string" },
					{ status: 400 }
				);
			}
			updates.currency = currency;
		}

		if (magicWord !== undefined) {
			if (typeof magicWord !== "string" || magicWord.trim().length < 3) {
				return NextResponse.json(
					{ error: "Magic word must be at least 3 characters long" },
					{ status: 400 }
				);
			}
			updates.magicWord = magicWord.trim();
		}

		// Update the exchange
		const [updatedExchange] = await db
			.update(giftExchanges)
			.set(updates)
			.where(eq(giftExchanges.id, id))
			.returning();

		return NextResponse.json({
			id: updatedExchange.id,
			name: updatedExchange.name,
			magicWord: updatedExchange.magicWord,
			spendingLimit: updatedExchange.spendingLimit,
			currency: updatedExchange.currency,
			status: updatedExchange.status,
			createdBy: updatedExchange.createdBy,
			createdAt: updatedExchange.createdAt,
			updatedAt: updatedExchange.updatedAt,
		});
	} catch (error) {
		console.error("Error updating gift exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

