export interface ApiKey {
  id: string;
  website_id: string;
  name: string;
  key: string;
  enabled: boolean;
  created_at: string;
  last_used_at?: string;
}