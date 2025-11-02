import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
} from "drizzle-orm/pg-core";

// Better Auth required tables
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Custom users table for application-specific data
// This can be extended later for gift giver information
// For now, we'll use Better Auth's user table as the primary user table
// This table can be used for additional application-specific user data if needed
export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	email: text("email").notNull().unique(),
	// Additional columns can be added here for gift giver information
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Gift exchanges table
export const giftExchanges = pgTable("gift_exchanges", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	magicWord: text("magic_word"),
	spendingLimit: integer("spending_limit").notNull(),
	currency: text("currency").notNull().default("USD"),
	status: text("status").notNull().default("active"),
	createdBy: text("created_by")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Participants table
export const participants = pgTable("participants", {
	id: text("id").primaryKey(),
	exchangeId: text("exchange_id")
		.notNull()
		.references(() => giftExchanges.id, { onDelete: "cascade" }),
	firstName: text("first_name").notNull(),
	lastName: text("last_name"),
	visitorId: text("visitor_id"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
	id: text("id").primaryKey(),
	participantId: text("participant_id")
		.notNull()
		.references(() => participants.id, { onDelete: "cascade" }),
	description: text("description").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Assignments table - stores who gives to whom in a gift exchange
export const assignments = pgTable("assignments", {
	id: text("id").primaryKey(),
	exchangeId: text("exchange_id")
		.notNull()
		.references(() => giftExchanges.id, { onDelete: "cascade" }),
	participantId: text("participant_id")
		.notNull()
		.references(() => participants.id, { onDelete: "cascade" }),
	assignedToParticipantId: text("assigned_to_participant_id")
		.notNull()
		.references(() => participants.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

