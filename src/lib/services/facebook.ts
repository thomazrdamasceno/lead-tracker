import { logger } from './logging';

interface FacebookEvent {
  event_name: string;
  event_time: number;
  user_data?: {
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  custom_data?: Record<string, any>;
}

interface FacebookResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function sendFacebookEvent(
  pixelId: string, 
  accessToken: string, 
  event: FacebookEvent,
  testCode?: string
) {
  try {
    // Hash user data before sending
    const hashedEvent = {
      ...event,
      user_data: event.user_data ? {
        ...event.user_data,
        email: event.user_data.email ? 
          await hashData(event.user_data.email.toLowerCase()) : 
          undefined,
        phone: event.user_data.phone ? 
          await hashData(event.user_data.phone.replace(/\D/g, '')) : 
          undefined
      } : undefined
    };

    const requestBody = {
      data: [hashedEvent],
      ...(testCode ? { test_event_code: testCode } : {}),
      access_token: accessToken
    };

    logger.debug('Sending Facebook event', { 
      pixelId, 
      event: hashedEvent,
      testCode 
    });

    const response = await fetch(
      `https://graph.facebook.com/v17.0/${pixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data: FacebookResponse = await response.json();
    
    if (!response.ok) {
      logger.error('Facebook API error', data);
      return {
        success: false,
        data,
        error: data.error?.message || 'Failed to send event to Facebook',
        request: requestBody,
        rawResponse: data
      };
    }

    logger.info('Facebook event sent successfully', data);
    return {
      success: true,
      data,
      request: requestBody,
      rawResponse: data
    };
  } catch (error) {
    logger.error('Facebook API error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send event to Facebook',
      rawResponse: null
    };
  }
}