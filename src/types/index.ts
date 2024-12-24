export interface Website {
  id: string;
  user_id: string;
  name: string;
  domain: string;
  pixel_id?: string | null;
  pixel_token?: string | null;
  created_at: string;
}

export interface Conversion {
  id: string;
  website_id: string;
  title: string;
  trigger_type: string;
  event_type: string;
  configuration: {
    loadOn: string;
    triggerConfig: Record<string, any>;
    productInfo: Record<string, any>;
    advanced: Record<string, any>;
  };
  created_at: string;
}

export interface Lead {
  id: string;
  website_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  last_ip: string | null;
  custom_data: Record<string, any>;
  created_at: string;
  events_count?: number;
  conversions_count?: number;
}

export * from './api';
export * from './events';