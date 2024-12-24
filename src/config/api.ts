import { supabase } from '../lib/supabase/client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const API_CONFIG = {
  baseUrl: SUPABASE_URL,
  version: 'v1',
  endpoints: {
    events: '/functions/v1/events'  // Updated to use Edge Function
  }
};

export function getApiExample(apiKey: string): string {
  return `curl -X POST \\
  ${API_CONFIG.baseUrl}${API_CONFIG.endpoints.events} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "apikey: ${SUPABASE_ANON_KEY}" \\
  -d '{
    "website_id": "your-website-id",
    "event_type": "PageView",
    "page_url": "https://example.com/page",
    "lead": {
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "custom_data": {
        "source": "homepage"
      }
    },
    "data": {
      "customField": "value"
    }
  }'`;
}