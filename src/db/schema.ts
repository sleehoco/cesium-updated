import { pgTable, text, timestamp, uuid, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Database Schema for Cesium Cyber Platform
 * Using Drizzle ORM with PostgreSQL (Supabase)
 */

// Enums
export const iocTypeEnum = pgEnum('ioc_type', ['ip', 'domain', 'url', 'hash']);
export const severityLevelEnum = pgEnum('severity_level', [
  'low',
  'medium',
  'high',
  'critical',
]);

// Users table (extends Supabase auth.users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Threat analyses table
export const threatAnalyses = pgTable('threat_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  iocType: iocTypeEnum('ioc_type').notNull(),
  iocValue: text('ioc_value').notNull(),
  analysisResult: jsonb('analysis_result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Security logs table
export const securityLogs = pgTable('security_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  logContent: text('log_content').notNull(),
  analysisResult: jsonb('analysis_result'),
  severity: severityLevelEnum('severity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Vulnerability scans table
export const vulnerabilityScans = pgTable('vulnerability_scans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  target: text('target').notNull(),
  scanType: text('scan_type').notNull(),
  results: jsonb('results').notNull(),
  vulnerabilitiesFound: jsonb('vulnerabilities_found'),
  severity: severityLevelEnum('severity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Phishing analyses table
export const phishingAnalyses = pgTable('phishing_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  analysisType: text('analysis_type').notNull(), // 'email', 'url', 'content'
  content: text('content').notNull(),
  isPhishing: text('is_phishing').notNull(), // 'yes', 'no', 'likely', 'unlikely'
  confidenceScore: text('confidence_score'),
  indicators: jsonb('indicators'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Incident responses table
export const incidentResponses = pgTable('incident_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  incidentType: text('incident_type').notNull(),
  description: text('description').notNull(),
  responseSteps: jsonb('response_steps').notNull(),
  status: text('status').notNull().default('open'), // 'open', 'in_progress', 'resolved'
  severity: severityLevelEnum('severity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  threatAnalyses: many(threatAnalyses),
  securityLogs: many(securityLogs),
  vulnerabilityScans: many(vulnerabilityScans),
  phishingAnalyses: many(phishingAnalyses),
  incidentResponses: many(incidentResponses),
}));

export const threatAnalysesRelations = relations(threatAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [threatAnalyses.userId],
    references: [users.id],
  }),
}));

export const securityLogsRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, {
    fields: [securityLogs.userId],
    references: [users.id],
  }),
}));

export const vulnerabilityScansRelations = relations(
  vulnerabilityScans,
  ({ one }) => ({
    user: one(users, {
      fields: [vulnerabilityScans.userId],
      references: [users.id],
    }),
  })
);

export const phishingAnalysesRelations = relations(
  phishingAnalyses,
  ({ one }) => ({
    user: one(users, {
      fields: [phishingAnalyses.userId],
      references: [users.id],
    }),
  })
);

export const incidentResponsesRelations = relations(
  incidentResponses,
  ({ one }) => ({
    user: one(users, {
      fields: [incidentResponses.userId],
      references: [users.id],
    }),
  })
);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ThreatAnalysis = typeof threatAnalyses.$inferSelect;
export type NewThreatAnalysis = typeof threatAnalyses.$inferInsert;
export type SecurityLog = typeof securityLogs.$inferSelect;
export type NewSecurityLog = typeof securityLogs.$inferInsert;
export type VulnerabilityScan = typeof vulnerabilityScans.$inferSelect;
export type NewVulnerabilityScan = typeof vulnerabilityScans.$inferInsert;
export type PhishingAnalysis = typeof phishingAnalyses.$inferSelect;
export type NewPhishingAnalysis = typeof phishingAnalyses.$inferInsert;
export type IncidentResponse = typeof incidentResponses.$inferSelect;
export type NewIncidentResponse = typeof incidentResponses.$inferInsert;
