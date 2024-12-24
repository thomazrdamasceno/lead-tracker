interface VerificationResult {
  success: boolean;
  hasTrackingCode: boolean;
  hasScript: boolean;
  hasPixelId: boolean;
  error?: string;
  details?: {
    scriptUrl?: string;
    websiteId?: string;
    pixelId?: string;
  };
}

export async function verifyWebsiteInstallation(url: string, websiteId: string, pixelId?: string): Promise<VerificationResult> {
  try {
    // Normalize URL
    const normalizedUrl = normalizeUrl(url);
    
    // Use a proxy service to fetch the website HTML
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(normalizedUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.contents) {
      throw new Error('Failed to fetch website content');
    }

    const html = data.contents;

    // Check for tracking script
    const hasScript = html.includes('cdn.leadtracker.com/lt.js');
    
    // Check for website ID
    const hasCorrectWebsiteId = html.includes(`data-website-id="${websiteId}"`);
    
    // Check for pixel ID if required
    const hasCorrectPixelId = !pixelId || html.includes(`data-pixel-id="${pixelId}"`);

    // Extract details using regex
    const scriptUrlMatch = html.match(/src=["'](https:\/\/cdn\.leadtracker\.com\/lt\.js)["']/);
    const websiteIdMatch = html.match(/data-website-id=["']([^"']+)["']/);
    const pixelIdMatch = html.match(/data-pixel-id=["']([^"']+)["']/);

    const details = {
      scriptUrl: scriptUrlMatch?.[1],
      websiteId: websiteIdMatch?.[1],
      pixelId: pixelIdMatch?.[1],
    };

    const success = hasScript && hasCorrectWebsiteId && hasCorrectPixelId;

    return {
      success,
      hasTrackingCode: hasCorrectWebsiteId,
      hasScript,
      hasPixelId: hasCorrectPixelId,
      details,
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      hasTrackingCode: false,
      hasScript: false,
      hasPixelId: false,
      error: error instanceof Error ? error.message : 'Failed to verify installation'
    };
  }
}

function normalizeUrl(url: string): string {
  // Remove whitespace
  url = url.trim().toLowerCase();
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  
  return url;
}