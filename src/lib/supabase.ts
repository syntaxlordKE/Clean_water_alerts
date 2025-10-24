import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WaterReport = {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: 'active' | 'investigating' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reported_by: string;
  contact_info: string | null;
  created_at: string;
  updated_at: string;
};
