import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth-server";
import { db } from "@/app/db";
import { user } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
	try {
		const session = await getSession({ headers: request.headers });

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Delete the user - this will cascade delete all related data (sessions, exchanges, etc.)
		// due to the foreign key constraints with onDelete: "cascade"
		await db
			.delete(user)
			.where(eq(user.id, session.user.id));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting user account:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

