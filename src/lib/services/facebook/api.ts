import { logger } from '../logging';
import { hashUserData } from './utils';
import type { FacebookEvent, FacebookResponse, FacebookResult } from './types';

const FB_API_VERSION = 'v21.0';
const FB_API_BASE_URL = 'https://graph.facebook.com';

export async function sendFacebookEvent(
  pixelId: string, 
  accessToken: string, 
  event: FacebookEvent,
  testEventCode?: string
): Promise<FacebookResult> {
  try {
    // Hash user data
    const hashedUserData = await hashUserData(event.user_data);
    
    // Build request body
    const requestBody = {
      ...(testEventCode ? { test_event_code: testEventCode } : {}), // Conditionally add test_event_code
      data: [{
        event_name: event.event_name, // Use the provided event name
        event_time: Math.floor(Date.now() / 1000),
        user_data: hashedUserData,
        custom_data: event.custom_data || {}
      }],
      access_token: accessToken
    };

    // Build API URL
    const apiUrl = `${FB_API_BASE_URL}/${FB_API_VERSION}/${pixelId}/events`;

    logger.debug('Sending Facebook event', { 
      pixelId,
      testEventCode,
      apiUrl,
      request: requestBody
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data: FacebookResponse = await response.json();
    
    if (!response.ok) {
      logger.error('Facebook API error', data);
      return {
        success: false,
        error: data.error?.message || 'Failed to send event to Facebook',
        request: requestBody,
        rawResponse: data,
        apiUrl
      };
    }

    logger.info('Facebook event sent successfully', data);
    return {
      success: true,
      data,
      request: requestBody,
      rawResponse: data,
      apiUrl
    };
  } catch (error) {
    logger.error('Facebook API error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send event to Facebook',
      rawResponse: null,
      apiUrl: `${FB_API_BASE_URL}/${FB_API_VERSION}/${pixelId}/events`
    };
  }
}