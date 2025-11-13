import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { giftExchanges } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

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

		// Check exchange status - must be "started" to end it
		if (exchange.status !== "started") {
			return NextResponse.json(
				{ error: `Exchange cannot be ended. Current status: ${exchange.status}` },
				{ status: 400 }
			);
		}

		// Update exchange status to "ended"
		const now = new Date();
		const [updatedExchange] = await db
			.update(giftExchanges)
			.set({
				status: "ended",
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
		});
	} catch (error) {
		console.error("Error ending exchange:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

