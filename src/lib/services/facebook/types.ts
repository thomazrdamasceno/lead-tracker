export interface FacebookUserData {
  email?: string;
  phone?: string;
  [key: string]: any;
}

export interface FacebookEvent {
  event_name: string;
  event_time: number;
  user_data?: FacebookUserData;
  custom_data?: Record<string, any>;
}

export interface FacebookError {
  message: string;
  type: string;
  code: number;
  fbtrace_id: string;
}

export interface FacebookResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: FacebookError;
}

export interface FacebookResult {
  success: boolean;
  data?: FacebookResponse;
  error?: string;
  request?: any;
  rawResponse: FacebookResponse | null;
  apiUrl: string; // Added apiUrl field
}