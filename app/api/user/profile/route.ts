import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { user } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
	try {
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const [userData] = await db
			.select({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				createdAt: user.createdAt,
			})
			.from(user)
			.where(eq(user.id, session.user.id))
			.limit(1);

		if (!userData) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			createdAt:
				userData.createdAt instanceof Date
					? userData.createdAt.toISOString()
					: new Date(userData.createdAt).toISOString(),
		});
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { firstName, lastName } = body;

		if (
			!firstName ||
			typeof firstName !== "string" ||
			firstName.trim().length === 0
		) {
			return NextResponse.json(
				{ error: "First name is required" },
				{ status: 400 },
			);
		}

		if (
			!lastName ||
			typeof lastName !== "string" ||
			lastName.trim().length === 0
		) {
			return NextResponse.json(
				{ error: "Last name is required" },
				{ status: 400 },
			);
		}

		const [updatedUser] = await db
			.update(user)
			.set({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				name: `${firstName.trim()} ${lastName.trim()}`.trim(), // Set name as full name
				updatedAt: new Date(),
			})
			.where(eq(user.id, session.user.id))
			.returning();

		return NextResponse.json({
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			email: updatedUser.email,
			createdAt:
				updatedUser.createdAt instanceof Date
					? updatedUser.createdAt.toISOString()
					: new Date(updatedUser.createdAt).toISOString(),
		});
	} catch (error) {
		console.error("Error updating user profile:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
