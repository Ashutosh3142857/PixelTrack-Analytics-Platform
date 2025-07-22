import { storage } from "../storage";
import { nanoid } from "nanoid";

export function generateTrackingCode(pixelId: string, domain: string): string {
  return `<script>
(function() {
  var pixelId = '${pixelId}';
  var script = document.createElement('script');
  script.src = '/tracking-pixel.js?pid=' + pixelId;
  script.async = true;
  document.head.appendChild(script);
})();
</script>`;
}

export function generateLeadFormEmbedCode(formId: string): string {
  return `<div id="pixeltrack-form-${formId}"></div>
<script>
(function() {
  var formId = '${formId}';
  var script = document.createElement('script');
  script.src = '/lead-form.js?fid=' + formId;
  script.async = true;
  script.onload = function() {
    if (window.PixelTrackForm) {
      window.PixelTrackForm.render('${formId}');
    }
  };
  document.head.appendChild(script);
})();
</script>`;
}

export async function processVisitorData(data: {
  pixelId: string;
  sessionId: string;
  url: string;
  title?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  try {
    const { getGeoLocation, parseUserAgent } = await import('./geoip');
    
    // Check if visitor already exists
    let visitor = await storage.getVisitorBySession(data.pixelId, data.sessionId);
    
    if (!visitor) {
      // Get geo location and parse user agent
      const geoData = data.ipAddress ? await getGeoLocation(data.ipAddress) : null;
      const deviceData = data.userAgent ? parseUserAgent(data.userAgent) : { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
      
      // Create new visitor
      visitor = await storage.createVisitor({
        pixelId: data.pixelId,
        sessionId: data.sessionId,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        country: geoData?.country || null,
        region: geoData?.region || null,
        city: geoData?.city || null,
        latitude: geoData?.latitude || null,
        longitude: geoData?.longitude || null,
        device: deviceData.device,
        browser: deviceData.browser,
        os: deviceData.os,
        referrer: data.referrer || null,
        landingPage: data.url,
        isNewVisitor: true,
        visitCount: 1,
      });
    } else {
      // Update existing visitor
      await storage.updateVisitor(visitor.id, {
        visitCount: (visitor.visitCount || 0) + 1,
        isNewVisitor: false,
      });
    }

    // Record page view
    await storage.createPageView({
      visitorId: visitor.id,
      pixelId: data.pixelId,
      url: data.url,
      title: data.title || null,
    });

    return visitor;
  } catch (error) {
    console.error('Error processing visitor data:', error);
    throw error;
  }
}
