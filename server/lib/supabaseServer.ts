import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import * as dotenv from 'dotenv';
dotenv.config(); // Ensure env vars are loaded in Node context

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ [SUPABASE ERROR] Supabase URL or Anon Key is missing in server environment.");
}

if (!supabaseServiceKey) {
  console.warn("⚠️ [Supabase] SUPABASE_SERVICE_ROLE_KEY is missing. Server-side RLS bypass will not work.");
}

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co");

const globalSupabase = globalThis as any;

export const supabase = globalSupabase.supabase || createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: false, // Server shouldn't persist session globally like browser
      autoRefreshToken: false,
    },
    realtime: {
      transport: ws as any,
    }
  }
);

if (!globalSupabase.supabase) {
  globalSupabase.supabase = supabase;
}

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = globalSupabase.supabaseAdmin || ((supabaseServiceKey && isConfigured)
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      realtime: {
        transport: ws as any,
      }
    }) 
  : null);

if (!globalSupabase.supabaseAdmin && supabaseAdmin) {
  globalSupabase.supabaseAdmin = supabaseAdmin;
}

const clientCache = new Map<string, any>();

export const getScopedClient = (token?: string) => {
  if (token) {
    if (clientCache.has(token)) return clientCache.get(token);

    const client = createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-key",
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false
        },
        realtime: {
          transport: ws as any,
        }
      }
    );
    clientCache.set(token, client);
    
    // Clear cache if it grows too large (basic LRU-ish)
    if (clientCache.size > 100) {
      const firstKey = clientCache.keys().next().value;
      if (firstKey !== undefined) {
        clientCache.delete(firstKey);
      }
    }
    
    return client;
  }
  return supabaseAdmin || supabase;
};
