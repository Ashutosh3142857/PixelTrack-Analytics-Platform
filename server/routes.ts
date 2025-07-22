import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  insertTrackingPixelSchema, 
  insertLeadFormSchema, 
  insertLeadSchema 
} from "@shared/schema";
import { generateTrackingCode, generateLeadFormEmbedCode, processVisitorData } from "./services/analytics";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Note: Auth routes are now handled in setupAuth function

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Tracking pixels
  app.get('/api/tracking-pixels', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const pixels = await storage.getTrackingPixels(userId);
      res.json(pixels);
    } catch (error) {
      console.error("Error fetching tracking pixels:", error);
      res.status(500).json({ message: "Failed to fetch tracking pixels" });
    }
  });

  app.post('/api/tracking-pixels', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const pixelData = insertTrackingPixelSchema.parse({
        ...req.body,
        userId,
      });
      
      const trackingCode = generateTrackingCode('temp', pixelData.domain);
      
      const pixel = await storage.createTrackingPixel({
        ...pixelData,
        trackingCode,
      });
      
      // Update with actual pixel ID
      const finalTrackingCode = generateTrackingCode(pixel.id, pixelData.domain);
      const updatedPixel = await storage.updateTrackingPixel(pixel.id, {
        trackingCode: finalTrackingCode,
      });
      
      res.json(updatedPixel);
    } catch (error) {
      console.error("Error creating tracking pixel:", error);
      res.status(500).json({ message: "Failed to create tracking pixel" });
    }
  });

  app.get('/api/tracking-pixels/:id', isAuthenticated, async (req: any, res) => {
    try {
      const pixel = await storage.getTrackingPixel(req.params.id);
      if (!pixel) {
        return res.status(404).json({ message: "Tracking pixel not found" });
      }
      res.json(pixel);
    } catch (error) {
      console.error("Error fetching tracking pixel:", error);
      res.status(500).json({ message: "Failed to fetch tracking pixel" });
    }
  });

  app.put('/api/tracking-pixels/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = req.body;
      const pixel = await storage.updateTrackingPixel(req.params.id, updates);
      res.json(pixel);
    } catch (error) {
      console.error("Error updating tracking pixel:", error);
      res.status(500).json({ message: "Failed to update tracking pixel" });
    }
  });

  // Visitors
  app.get('/api/visitors/:pixelId', isAuthenticated, async (req: any, res) => {
    try {
      const { pixelId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const visitors = await storage.getVisitors(pixelId, limit);
      res.json(visitors);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      res.status(500).json({ message: "Failed to fetch visitors" });
    }
  });

  // Analytics data
  app.get('/api/analytics/traffic/:pixelId', isAuthenticated, async (req: any, res) => {
    try {
      const { pixelId } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      const data = await storage.getTrafficData(pixelId, days);
      res.json(data);
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      res.status(500).json({ message: "Failed to fetch traffic data" });
    }
  });

  app.get('/api/analytics/geographic/:pixelId', isAuthenticated, async (req: any, res) => {
    try {
      const { pixelId } = req.params;
      const data = await storage.getGeographicData(pixelId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching geographic data:", error);
      res.status(500).json({ message: "Failed to fetch geographic data" });
    }
  });

  // Lead forms
  app.get('/api/lead-forms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const forms = await storage.getLeadForms(userId);
      res.json(forms);
    } catch (error) {
      console.error("Error fetching lead forms:", error);
      res.status(500).json({ message: "Failed to fetch lead forms" });
    }
  });

  app.post('/api/lead-forms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const formData = insertLeadFormSchema.parse({
        ...req.body,
        userId,
      });
      
      const embedCode = generateLeadFormEmbedCode('temp');
      
      const form = await storage.createLeadForm({
        ...formData,
        embedCode,
      });
      
      // Update with actual form ID
      const finalEmbedCode = generateLeadFormEmbedCode(form.id);
      const updatedForm = await storage.updateLeadForm(form.id, {
        embedCode: finalEmbedCode,
      });
      
      res.json(updatedForm);
    } catch (error) {
      console.error("Error creating lead form:", error);
      res.status(500).json({ message: "Failed to create lead form" });
    }
  });

  // Leads
  app.get('/api/leads/:pixelId', isAuthenticated, async (req: any, res) => {
    try {
      const { pixelId } = req.params;
      const leads = await storage.getLeads(pixelId);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post('/api/leads', async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  // Tracking pixel endpoint (public)
  app.post('/api/track', async (req, res) => {
    try {
      const { pixelId, sessionId, url, title, referrer } = req.body;
      
      if (!pixelId || !sessionId || !url) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const visitorData = {
        pixelId,
        sessionId,
        url,
        title,
        referrer,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
      };

      await processVisitorData(visitorData);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing tracking data:", error);
      res.status(500).json({ message: "Failed to process tracking data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
