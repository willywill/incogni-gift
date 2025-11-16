import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { wishlistItems, participants } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { processLinkPreview } from "@/app/lib/link-preview";
import { extractUrls } from "@/app/lib/link-preview-client";

const MAX_ITEMS_PER_PARTICIPANT = 10;

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: participantId } = await params;

		// Parse request body
		const body = await request.json();
		const { description } = body;

		// Validate inputs
		if (!description || typeof description !== "string" || description.trim().length === 0) {
			return NextResponse.json(
				{ error: "Description is required" },
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

		// Check current item count
		const existingItems = await db
			.select()
			.from(wishlistItems)
			.where(eq(wishlistItems.participantId, participantId));

		if (existingItems.length >= MAX_ITEMS_PER_PARTICIPANT) {
			return NextResponse.json(
				{ error: `Maximum of ${MAX_ITEMS_PER_PARTICIPANT} items allowed per participant` },
				{ status: 400 }
			);
		}

		// Process link preview if URL is detected
		let previewData = null;
		const trimmedDescription = description.trim();

		try {
			previewData = await processLinkPreview(trimmedDescription);
		} catch (error) {
			// If shortener detected or other error, return error response
			if (error instanceof Error && error.message.includes("URL shorteners")) {
				return NextResponse.json(
					{ error: error.message },
					{ status: 400 }
				);
			}
			// For other errors (network failures, etc.), continue without preview
			console.error("Error processing link preview:", error);
		}

		// Extract URL if present (for storage)
		const urls = extractUrls(trimmedDescription);
		const url = urls.length > 0 ? urls[0] : null;

		// Create wishlist item
		const id = crypto.randomUUID();
		const now = new Date();

		const [newItem] = await db
			.insert(wishlistItems)
			.values({
				id,
				participantId,
				description: trimmedDescription,
				url: previewData?.url || url || null,
				previewImage: previewData?.previewImage || null,
				previewTitle: previewData?.previewTitle || null,
				previewDescription: previewData?.previewDescription || null,
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		return NextResponse.json(
			{
				id: newItem.id,
				participantId: newItem.participantId,
				description: newItem.description,
				url: newItem.url,
				previewImage: newItem.previewImage,
				previewTitle: newItem.previewTitle,
				previewDescription: newItem.previewDescription,
				createdAt: newItem.createdAt,
				updatedAt: newItem.updatedAt,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating wishlist item:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

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

		// Get all wishlist items for this participant
		const items = await db
			.select()
			.from(wishlistItems)
			.where(eq(wishlistItems.participantId, participantId));

		return NextResponse.json(
			items.map((item) => ({
				id: item.id,
				participantId: item.participantId,
				description: item.description,
				url: item.url,
				previewImage: item.previewImage,
				previewTitle: item.previewTitle,
				previewDescription: item.previewDescription,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))
		);
	} catch (error) {
		console.error("Error fetching wishlist items:", error);
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
		const { id: participantId } = await params;

		// Parse request body to get item ID
		const body = await request.json();
		const { itemId } = body;

		if (!itemId || typeof itemId !== "string") {
			return NextResponse.json(
				{ error: "Item ID is required" },
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

		// Verify item exists and belongs to this participant
		const [item] = await db
			.select()
			.from(wishlistItems)
			.where(eq(wishlistItems.id, itemId))
			.limit(1);

		if (!item || item.participantId !== participantId) {
			return NextResponse.json(
				{ error: "Wishlist item not found" },
				{ status: 404 }
			);
		}

		// Delete the item
		await db
			.delete(wishlistItems)
			.where(eq(wishlistItems.id, itemId));

		return NextResponse.json(
			{ message: "Wishlist item deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting wishlist item:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

