import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { giftExchanges } from "@/app/db/schema";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: Request) {
	try {
		// Get the current session
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await request.json();
		const { name, spendingLimit, currency } = body;

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

		// Create the gift exchange
		const id = crypto.randomUUID();
		const now = new Date();

		const [newExchange] = await db
			.insert(giftExchanges)
			.values({
				id,
				name: name.trim(),
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
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get all active gift exchanges for this user
		const exchanges = await db
			.select()
			.from(giftExchanges)
			.where(
				and(
					eq(giftExchanges.createdBy, session.user.id),
					eq(giftExchanges.status, "active")
				)
			)
			.orderBy(desc(giftExchanges.createdAt));

		return NextResponse.json(
			exchanges.map((exchange) => ({
				id: exchange.id,
				name: exchange.name,
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

