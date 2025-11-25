import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { giftExchanges, user } from "@/app/db/schema";
import { eq, and, sql, isNotNull, ne } from "drizzle-orm";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		// Get exchange by ID (no auth required - public for participants)
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(eq(giftExchanges.id, id))
			.limit(1);

		if (!exchange) {
			return NextResponse.json(
				{ error: "Exchange not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			id: exchange.id,
			name: exchange.name,
			magicWord: exchange.magicWord,
			spendingLimit: exchange.spendingLimit,
			currency: exchange.currency,
			status: exchange.status,
			showRecipientNames: exchange.showRecipientNames,
			createdBy: exchange.createdBy,
			createdAt: exchange.createdAt,
			updatedAt: exchange.updatedAt,
		});
	} catch (error) {
		console.error("Error fetching gift exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Get the current session
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		// Parse request body
		const body = await request.json();
		const { name, spendingLimit, currency, magicWord, showRecipientNames } =
			body;

		// First, verify the user owns this exchange
		const [existingExchange] = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.id, id),
					eq(giftExchanges.createdBy, session.user.id),
				),
			)
			.limit(1);

		if (!existingExchange) {
			return NextResponse.json(
				{ error: "Exchange not found or access denied" },
				{ status: 404 },
			);
		}

		// Build update object with only provided fields
		const updates: {
			name?: string;
			spendingLimit?: number;
			currency?: string;
			magicWord?: string;
			showRecipientNames?: boolean;
			updatedAt: Date;
		} = {
			updatedAt: new Date(),
		};

		if (name !== undefined) {
			if (typeof name !== "string" || name.trim().length === 0) {
				return NextResponse.json(
					{ error: "Name must be a non-empty string" },
					{ status: 400 },
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
					{
						error:
							"Spending limit must be a positive number in increments of 5",
					},
					{ status: 400 },
				);
			}
			updates.spendingLimit = spendingLimit;
		}

		if (currency !== undefined) {
			if (typeof currency !== "string") {
				return NextResponse.json(
					{ error: "Currency must be a string" },
					{ status: 400 },
				);
			}
			updates.currency = currency;
		}

		if (magicWord !== undefined) {
			if (typeof magicWord !== "string" || magicWord.trim().length < 3) {
				return NextResponse.json(
					{ error: "Magic word must be at least 3 characters long" },
					{ status: 400 },
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
			// Exclude the current exchange being edited
			if (creatorData?.lastName) {
				const normalizedLastName = creatorData.lastName.trim();
				const duplicateCheck = await db
					.select()
					.from(giftExchanges)
					.innerJoin(user, eq(giftExchanges.createdBy, user.id))
					.where(
						and(
							ne(giftExchanges.id, id), // Exclude current exchange
							isNotNull(giftExchanges.magicWord),
							isNotNull(user.lastName),
							sql`${giftExchanges.magicWord} ILIKE ${normalizedMagicWord}`,
							sql`${user.lastName} ILIKE ${normalizedLastName}`,
							eq(giftExchanges.status, "active"),
						),
					)
					.limit(1);

				if (duplicateCheck.length > 0) {
					return NextResponse.json(
						{
							error:
								"An exchange with this magic word already exists. Please choose a different magic word.",
						},
						{ status: 400 },
					);
				}
			}

			updates.magicWord = normalizedMagicWord;
		}

		if (showRecipientNames !== undefined) {
			if (typeof showRecipientNames !== "boolean") {
				return NextResponse.json(
					{ error: "showRecipientNames must be a boolean" },
					{ status: 400 },
				);
			}
			// Only allow toggling if exchange is NOT started or ended
			if (
				existingExchange.status === "started" ||
				existingExchange.status === "ended"
			) {
				return NextResponse.json(
					{
						error:
							"Cannot change recipient name visibility after exchange has started",
					},
					{ status: 400 },
				);
			}
			updates.showRecipientNames = showRecipientNames;
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
			showRecipientNames: updatedExchange.showRecipientNames,
			createdBy: updatedExchange.createdBy,
			createdAt: updatedExchange.createdAt,
			updatedAt: updatedExchange.updatedAt,
		});
	} catch (error) {
		console.error("Error updating gift exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		// Get the current session
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		// First, verify the user owns this exchange
		const [existingExchange] = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.id, id),
					eq(giftExchanges.createdBy, session.user.id),
				),
			)
			.limit(1);

		if (!existingExchange) {
			return NextResponse.json(
				{ error: "Exchange not found or access denied" },
				{ status: 404 },
			);
		}

		// Delete the exchange (cascading deletes will handle participants, assignments, wishlist items)
		await db.delete(giftExchanges).where(eq(giftExchanges.id, id));

		return NextResponse.json(
			{ message: "Exchange deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error deleting gift exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
