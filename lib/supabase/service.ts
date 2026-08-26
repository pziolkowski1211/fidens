import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Klient z pelnym dostepem do bazy (pomija RLS) - uzywany WYLACZNIE
// w kodzie dzialajacym po stronie serwera bez sesji uzytkownika
// (np. cron job synchronizacji z OtoMoto). NIGDY nie importowac
// tego pliku w komponentach klienckich ani nie ujawniac klucza
// service_role przegladarce.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error("Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY w zmiennych srodowiskowych")
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
