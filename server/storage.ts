import {
  users,
  trackingPixels,
  visitors,
  pageViews,
  leads,
  leadForms,
  analyticsDaily,
  type User,
  type UpsertUser,
  type TrackingPixel,
  type InsertTrackingPixel,
  type Visitor,
  type InsertVisitor,
  type PageView,
  type InsertPageView,
  type Lead,
  type InsertLead,
  type LeadForm,
  type InsertLeadForm,
  type AnalyticsDaily,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count, avg } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tracking pixel operations
  createTrackingPixel(pixel: InsertTrackingPixel & { trackingCode: string }): Promise<TrackingPixel>;
  getTrackingPixels(userId: string): Promise<TrackingPixel[]>;
  getTrackingPixel(id: string): Promise<TrackingPixel | undefined>;
  updateTrackingPixel(id: string, updates: Partial<TrackingPixel>): Promise<TrackingPixel>;
  
  // Visitor operations
  createVisitor(visitor: InsertVisitor): Promise<Visitor>;
  getVisitors(pixelId: string, limit?: number): Promise<Visitor[]>;
  getVisitorBySession(pixelId: string, sessionId: string): Promise<Visitor | undefined>;
  updateVisitor(id: string, updates: Partial<Visitor>): Promise<Visitor>;
  
  // Page view operations
  createPageView(pageView: InsertPageView): Promise<PageView>;
  getPageViews(pixelId: string, startDate?: Date, endDate?: Date): Promise<PageView[]>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(pixelId: string): Promise<Lead[]>;
  
  // Lead form operations
  createLeadForm(form: InsertLeadForm & { embedCode: string }): Promise<LeadForm>;
  getLeadForms(userId: string): Promise<LeadForm[]>;
  getLeadForm(id: string): Promise<LeadForm | undefined>;
  updateLeadForm(id: string, updates: Partial<LeadForm>): Promise<LeadForm>;
  
  // Analytics operations
  getDashboardStats(userId: string): Promise<{
    totalPageViews: number;
    uniqueVisitors: number;
    leadsCapture: number;
    conversionRate: number;
  }>;
  getTrafficData(pixelId: string, days: number): Promise<any[]>;
  getGeographicData(pixelId: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tracking pixel operations
  async createTrackingPixel(pixel: InsertTrackingPixel & { trackingCode: string }): Promise<TrackingPixel> {
    const [created] = await db.insert(trackingPixels).values(pixel).returning();
    return created;
  }

  async getTrackingPixels(userId: string): Promise<TrackingPixel[]> {
    return await db.select().from(trackingPixels).where(eq(trackingPixels.userId, userId)).orderBy(desc(trackingPixels.createdAt));
  }

  async getTrackingPixel(id: string): Promise<TrackingPixel | undefined> {
    const [pixel] = await db.select().from(trackingPixels).where(eq(trackingPixels.id, id));
    return pixel;
  }

  async updateTrackingPixel(id: string, updates: Partial<TrackingPixel>): Promise<TrackingPixel> {
    const [updated] = await db
      .update(trackingPixels)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trackingPixels.id, id))
      .returning();
    return updated;
  }

  // Visitor operations
  async createVisitor(visitor: InsertVisitor): Promise<Visitor> {
    const [created] = await db.insert(visitors).values(visitor).returning();
    return created;
  }

  async getVisitors(pixelId: string, limit = 50): Promise<Visitor[]> {
    return await db
      .select()
      .from(visitors)
      .where(eq(visitors.pixelId, pixelId))
      .orderBy(desc(visitors.createdAt))
      .limit(limit);
  }

  async getVisitorBySession(pixelId: string, sessionId: string): Promise<Visitor | undefined> {
    const [visitor] = await db
      .select()
      .from(visitors)
      .where(and(eq(visitors.pixelId, pixelId), eq(visitors.sessionId, sessionId)));
    return visitor;
  }

  async updateVisitor(id: string, updates: Partial<Visitor>): Promise<Visitor> {
    const [updated] = await db
      .update(visitors)
      .set(updates)
      .where(eq(visitors.id, id))
      .returning();
    return updated;
  }

  // Page view operations
  async createPageView(pageView: InsertPageView): Promise<PageView> {
    const [created] = await db.insert(pageViews).values(pageView).returning();
    return created;
  }

  async getPageViews(pixelId: string, startDate?: Date, endDate?: Date): Promise<PageView[]> {
    let conditions = [eq(pageViews.pixelId, pixelId)];
    
    if (startDate && endDate) {
      conditions.push(gte(pageViews.timestamp, startDate));
      conditions.push(lte(pageViews.timestamp, endDate));
    }
    
    return await db
      .select()
      .from(pageViews)
      .where(and(...conditions))
      .orderBy(desc(pageViews.timestamp));
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async getLeads(pixelId: string): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .where(eq(leads.pixelId, pixelId))
      .orderBy(desc(leads.createdAt));
  }

  // Lead form operations
  async createLeadForm(form: InsertLeadForm & { embedCode: string }): Promise<LeadForm> {
    const [created] = await db.insert(leadForms).values(form).returning();
    return created;
  }

  async getLeadForms(userId: string): Promise<LeadForm[]> {
    return await db
      .select()
      .from(leadForms)
      .where(eq(leadForms.userId, userId))
      .orderBy(desc(leadForms.createdAt));
  }

  async getLeadForm(id: string): Promise<LeadForm | undefined> {
    const [form] = await db.select().from(leadForms).where(eq(leadForms.id, id));
    return form;
  }

  async updateLeadForm(id: string, updates: Partial<LeadForm>): Promise<LeadForm> {
    const [updated] = await db
      .update(leadForms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leadForms.id, id))
      .returning();
    return updated;
  }

  // Analytics operations
  async getDashboardStats(userId: string): Promise<{
    totalPageViews: number;
    uniqueVisitors: number;
    leadsCapture: number;
    conversionRate: number;
  }> {
    // Get user's pixels
    const userPixels = await db.select({ id: trackingPixels.id }).from(trackingPixels).where(eq(trackingPixels.userId, userId));
    const pixelIds = userPixels.map(p => p.id);
    
    if (pixelIds.length === 0) {
      return { totalPageViews: 0, uniqueVisitors: 0, leadsCapture: 0, conversionRate: 0 };
    }

    // Get total page views
    const [pageViewsResult] = await db
      .select({ count: count() })
      .from(pageViews)
      .where(sql`${pageViews.pixelId} = ANY(${pixelIds})`);

    // Get unique visitors
    const [visitorsResult] = await db
      .select({ count: count() })
      .from(visitors)
      .where(sql`${visitors.pixelId} = ANY(${pixelIds})`);

    // Get leads captured
    const [leadsResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(sql`${leads.pixelId} = ANY(${pixelIds})`);

    const totalPageViews = pageViewsResult?.count || 0;
    const uniqueVisitors = visitorsResult?.count || 0;
    const leadsCapture = leadsResult?.count || 0;
    const conversionRate = uniqueVisitors > 0 ? (leadsCapture / uniqueVisitors) * 100 : 0;

    return {
      totalPageViews: Number(totalPageViews),
      uniqueVisitors: Number(uniqueVisitors),
      leadsCapture: Number(leadsCapture),
      conversionRate: Number(conversionRate.toFixed(2)),
    };
  }

  async getTrafficData(pixelId: string, days: number): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await db
      .select({
        date: sql<string>`DATE(${pageViews.timestamp})`,
        pageViews: count(pageViews.id),
        uniqueVisitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorId})`,
      })
      .from(pageViews)
      .where(and(eq(pageViews.pixelId, pixelId), gte(pageViews.timestamp, startDate)))
      .groupBy(sql`DATE(${pageViews.timestamp})`)
      .orderBy(sql`DATE(${pageViews.timestamp})`);

    return result;
  }

  async getGeographicData(pixelId: string): Promise<any[]> {
    const result = await db
      .select({
        country: visitors.country,
        count: count(),
      })
      .from(visitors)
      .where(eq(visitors.pixelId, pixelId))
      .groupBy(visitors.country)
      .orderBy(desc(count()))
      .limit(10);

    return result;
  }
}

export const storage = new DatabaseStorage();
