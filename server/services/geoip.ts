// Simple GeoIP service using a free API
export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}

export async function getGeoLocation(ipAddress: string): Promise<GeoLocation | null> {
  try {
    // Use ipapi.co free tier (1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    
    if (!response.ok) {
      console.warn(`GeoIP API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn(`GeoIP API error: ${data.reason}`);
      return null;
    }

    return {
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      latitude: parseFloat(data.latitude) || 0,
      longitude: parseFloat(data.longitude) || 0,
    };
  } catch (error) {
    console.error('GeoIP lookup failed:', error);
    return null;
  }
}

export function parseUserAgent(userAgent: string): {
  device: string;
  browser: string;
  os: string;
} {
  const device = /Mobile|Android|iPhone|iPad/.test(userAgent) 
    ? (/iPad/.test(userAgent) ? 'tablet' : 'mobile')
    : 'desktop';

  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  return { device, browser, os };
}
