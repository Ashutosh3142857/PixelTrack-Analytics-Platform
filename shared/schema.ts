import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  uuid,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // for email auth users
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id"), // for Google auth users
  authProvider: varchar("auth_provider").notNull().default("email"), // email, google
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tracking pixels table
export const trackingPixels = pgTable("tracking_pixels", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  domain: varchar("domain").notNull(),
  status: varchar("status").notNull().default("active"), // active, paused, disabled
  trackingCode: text("tracking_code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Visitors table
export const visitors = pgTable("visitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  pixelId: uuid("pixel_id").notNull().references(() => trackingPixels.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  country: varchar("country"),
  region: varchar("region"), 
  city: varchar("city"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  device: varchar("device"), // desktop, mobile, tablet
  browser: varchar("browser"),
  os: varchar("os"),
  referrer: text("referrer"),
  landingPage: text("landing_page"),
  isNewVisitor: boolean("is_new_visitor").default(true),
  visitCount: integer("visit_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Page views table
export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitorId: uuid("visitor_id").notNull().references(() => visitors.id, { onDelete: "cascade" }),
  pixelId: uuid("pixel_id").notNull().references(() => trackingPixels.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: varchar("title"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitorId: uuid("visitor_id").notNull().references(() => visitors.id, { onDelete: "cascade" }),
  pixelId: uuid("pixel_id").notNull().references(() => trackingPixels.id, { onDelete: "cascade" }),
  formId: uuid("form_id"),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  company: varchar("company"),
  additionalData: jsonb("additional_data"),
  source: varchar("source"), // form, pixel, api
  createdAt: timestamp("created_at").defaultNow(),
});

// Lead forms table
export const leadForms = pgTable("lead_forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  pixelId: uuid("pixel_id").references(() => trackingPixels.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  title: varchar("title"),
  description: text("description"),
  fields: jsonb("fields").notNull(), // array of form field configurations
  styling: jsonb("styling"), // form styling options
  behavior: jsonb("behavior"), // trigger conditions, display rules
  isActive: boolean("is_active").default(true),
  embedCode: text("embed_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics aggregations table for performance
export const analyticsDaily = pgTable("analytics_daily", {
  id: uuid("id").primaryKey().defaultRandom(),
  pixelId: uuid("pixel_id").notNull().references(() => trackingPixels.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  newVisitors: integer("new_visitors").default(0),
  returningVisitors: integer("returning_visitors").default(0),
  leads: integer("leads").default(0),
  bounceRate: real("bounce_rate"),
  avgSessionDuration: real("avg_session_duration"),
  topCountries: jsonb("top_countries"),
  topReferrers: jsonb("top_referrers"),
  topPages: jsonb("top_pages"),
  deviceBreakdown: jsonb("device_breakdown"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertTrackingPixel = typeof trackingPixels.$inferInsert;
export type TrackingPixel = typeof trackingPixels.$inferSelect;

export type InsertVisitor = typeof visitors.$inferInsert;
export type Visitor = typeof visitors.$inferSelect;

export type InsertPageView = typeof pageViews.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;

export type InsertLead = typeof leads.$inferInsert;
export type Lead = typeof leads.$inferSelect;

export type InsertLeadForm = typeof leadForms.$inferInsert;
export type LeadForm = typeof leadForms.$inferSelect;

export type AnalyticsDaily = typeof analyticsDaily.$inferSelect;

// Zod schemas
export const insertTrackingPixelSchema = createInsertSchema(trackingPixels).omit({
  id: true,
  trackingCode: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadFormSchema = createInsertSchema(leadForms).omit({
  id: true,
  embedCode: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
