import { pgTable, serial, timestamp, varchar, integer, text } from 'drizzle-orm/pg-core';

export const accessCodes = pgTable('access_codes', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  maxUses: integer('max_uses'),
  usedCount: integer('used_count').default(0).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const emailCaptures = pgTable('email_captures', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  toolId: varchar('tool_id', { length: 50 }),
  source: varchar('source', { length: 100 }),
  ipAddress: varchar('ip_address', { length: 100 }),
  userAgent: text('user_agent'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
