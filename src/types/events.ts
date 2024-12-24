export interface EventData {
  website_id: string;
  event_type: string;
  page_url: string;
  lead?: {
    email?: string;
    name?: string;
    phone?: string;
    custom_data?: Record<string, any>;
  };
  data?: Record<string, any>;
}