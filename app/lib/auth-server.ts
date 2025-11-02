import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { db } from "@/app/db";
import { user, session } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export function isAuthBypassEnabled(): boolean {
	return process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
}

function createMagicLinkEmail(magicLinkUrl: string): { html: string; text: string } {
	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Your Magic Link - IncogniGift</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
	<table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fafafa;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
					<tr>
						<td align="center" style="padding: 40px 30px 30px 30px; background-color: #ffffff;">
							<div style="font-size: 32px; margin-bottom: 12px;">🎁</div>
							<h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #000000; letter-spacing: -0.01em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">IncogniGift</h1>
						</td>
					</tr>
					<tr>
						<td style="padding: 0 30px 30px 30px;">
							<h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #000000; line-height: 1.4;">Sign in to your account</h2>
							<p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #525252;">
								Click the button below to securely sign in to your IncogniGift account. This link will expire in 5 minutes.
							</p>
							<table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
								<tr>
									<td align="center">
										<a href="${magicLinkUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; font-weight: 600; letter-spacing: -0.01em;">Sign In</a>
									</td>
								</tr>
							</table>
							<p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #737373; word-break: break-all;">
								Or copy and paste this link into your browser:<br>
								<a href="${magicLinkUrl}" style="color: #000000; text-decoration: underline;">${magicLinkUrl}</a>
							</p>
							<p style="margin: 0; padding: 16px; background-color: #f5f5f5; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #525252;">
								<strong style="color: #000000;">Security note:</strong> If you didn't request this link, you can safely ignore this email. This link will expire in 5 minutes for your security.
							</p>
						</td>
					</tr>
					<tr>
						<td align="center" style="padding: 30px; border-top: 1px solid #e5e5e5; background-color: #ffffff;">
							<p style="margin: 0; font-size: 13px; color: #737373; line-height: 1.6;">
								This email was sent by <strong style="color: #000000;">IncogniGift</strong><br>
								Anonymous gift pairing made simple.
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`;

	const text = `IncogniGift 🎁

Sign in to your account

Click the link below to securely sign in to your IncogniGift account. This link will expire in 5 minutes.

${magicLinkUrl}

Security note: If you didn't request this link, you can safely ignore this email. This link will expire in 5 minutes for your security.

---
This email was sent by IncogniGift
Anonymous gift pairing made simple.`;

	return { html, text };
}

function createTransporter() {
	if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
		throw new Error("SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD environment variables.");
	}

	const port = parseInt(process.env.SMTP_PORT || "587", 10);
	const useSSL = port === 465;

	const config: any = {
		host: process.env.SMTP_HOST,
		port: port,
		secure: useSSL,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	};

	if (!useSSL && port === 587) {
		config.requireTLS = true;
		config.tls = {
			rejectUnauthorized: false,
		};
	}

	return nodemailer.createTransport(config);
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: false,
	},
	plugins: [
		magicLink({
			sendMagicLink: async ({ email, url, token }) => {
				if (isAuthBypassEnabled()) {
					return;
				}
				
				try {
					const transporter = createTransporter();
					const { html, text } = createMagicLinkEmail(url);
					const from = process.env.SMTP_FROM || "IncogniGift <[email protected]>";

					await transporter.sendMail({
						from: from,
						to: email,
						subject: "Sign in to IncogniGift",
						html: html,
						text: text,
					});
				} catch (error) {
					if ((error as any)?.code === "EAUTH" || (error as any)?.responseCode === 535) {
						const authError = new Error(
							"SMTP authentication failed. Check your SMTP credentials. " +
							"For Gmail, use an App Password instead of your regular password. " +
							"Make sure SMTP_USER and SMTP_PASSWORD are correct in your .env file."
						);
						(authError as any).originalError = error;
						throw authError;
					}

					throw error;
				}
			},
		}),
	],
	secret: process.env.BETTER_AUTH_SECRET || "change-me-in-production",
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	basePath: "/api/auth",
});

export async function createBypassSession() {
	const mockUserEmail = "[email protected]";
	const mockUserFirstName = "Mock";
	const mockUserLastName = "User";
	
	let mockUserRecord = await db.select().from(user).where(eq(user.email, mockUserEmail)).limit(1);
	
	let userId: string;
	if (mockUserRecord.length === 0) {
		userId = crypto.randomUUID();
		await db.insert(user).values({
			id: userId,
			email: mockUserEmail,
			firstName: mockUserFirstName,
			lastName: mockUserLastName,
			emailVerified: true,
		});
	} else {
		userId = mockUserRecord[0].id;
		
		const existingSessions = await db.select().from(session).where(eq(session.userId, userId));
		const validSession = existingSessions.find(s => s.expiresAt > new Date());
		
		if (validSession) {
			const userData = mockUserRecord[0];
			return buildSessionResponse(userData, validSession);
		}
	}
	
	const sessionToken = crypto.randomBytes(32).toString("hex");
	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	
	await db.delete(session).where(eq(session.userId, userId));
	
	await db.insert(session).values({
		id: sessionId,
		token: sessionToken,
		userId: userId,
		expiresAt: expiresAt,
		ipAddress: null,
		userAgent: null,
	});
	
	const userRecord = await db.select().from(user).where(eq(user.id, userId)).limit(1);
	const userData = userRecord[0];
	
	const newSession = {
		id: sessionId,
		token: sessionToken,
		userId: userId,
		expiresAt: expiresAt,
	};
	
	return buildSessionResponse(userData, newSession);
}

function buildSessionResponse(userData: any, sessionData: any) {
	return {
		sessionToken: sessionData.token,
		response: {
			user: {
				id: userData.id,
				email: userData.email,
				firstName: userData.firstName,
				lastName: userData.lastName,
				emailVerified: userData.emailVerified,
				createdAt: userData.createdAt instanceof Date 
					? userData.createdAt.toISOString() 
					: new Date(userData.createdAt).toISOString(),
				updatedAt: userData.updatedAt instanceof Date
					? userData.updatedAt.toISOString()
					: new Date(userData.updatedAt).toISOString(),
			},
			session: {
				id: sessionData.id,
				userId: sessionData.userId,
				expiresAt: sessionData.expiresAt instanceof Date
					? sessionData.expiresAt.toISOString()
					: sessionData.expiresAt,
				token: sessionData.token,
			},
		},
	};
}

export async function getSession(params: { headers: Headers | Record<string, string> }) {
	if (isAuthBypassEnabled()) {
		const { response } = await createBypassSession();
		return response;
	}
	
	return await auth.api.getSession(params);
}

