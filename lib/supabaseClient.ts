import { createClient } from '@supabase/supabase-js';

/*
  =============================================================================
  === DATABASE SETUP SCRIPT ===================================================
  =============================================================================
  Please copy the SQL script provided in the conversational response and run it 
  in your Supabase SQL Editor. This environment has restrictions that prevent 
  creating .sql files or embedding large scripts, so it is provided in the chat.

  --- Run the following in your Supabase SQL Editor for this update ---
  ALTER TABLE deals
  ADD COLUMN probability INTEGER CHECK (probability >= 0 AND probability <= 100);

  ALTER TABLE deals
  ADD COLUMN "nextStep" TEXT;
  =============================================================================
*/

// Hardcoding credentials because of environment restrictions.
// In a real-world project, this is not a recommended practice.
const supabaseUrl = "https://awslwnhevdmphyenaafe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3c2x3bmhldmRtcGh5ZW5hYWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTQ2MDQsImV4cCI6MjA3NDczMDYwNH0.ENEw00oyjj_qL9JK2DnPtSwcyuWeaAh48P-7lA2bcQ4";

// This check is useful for debugging in case the credentials are removed or invalid.
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is not set. Live data mode will not be available.');
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;