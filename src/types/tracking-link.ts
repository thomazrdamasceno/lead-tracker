export interface TrackingLink {
  id: string;
  website_id: string;
  name: string;
  url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  clicks: number;
  created_at: string;
}