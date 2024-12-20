import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://trqxaizkwuizuhlfmdup.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRycXhhaXprd3VpenVobGZtZHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODk1NzcsImV4cCI6MjA1MDI2NTU3N30.uv3FElLBTsCNr3Vg4PooW7h1o2ZlivAFGawFH-Zqxns";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);