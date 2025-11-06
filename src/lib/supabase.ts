// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

// Se existir env => cria o client real
let real: SupabaseClient | null = null
if (url && key) {
  real = createClient(url, key)
} else {
  console.warn('Supabase DESATIVADO (variáveis ausentes). Usando stub para evitar quebra.')
}

// --- STUB SEGURO (não quebra a app) ---
const chain = {
  // métodos encadeáveis comuns
  eq() { return this },
  order() { return this },
  // retornos assíncronos “inofensivos”
  async select() { return { data: [], error: null } },
  async insert() { return { data: null, error: null } },
  async upsert() { return { data: null, error: null } },
  async update() { return { data: null, error: null } },
  async delete() { return { data: null, error: null } },
  async single() { return { data: null, error: null } },
}
const stub = {
  from() { return chain },
  auth: {
    async getUser() { return { data: { user: null }, error: null } },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } }, error: null }
    },
  },
} as unknown as SupabaseClient
// ---------------------------------------

export const supabase: SupabaseClient = (real ?? stub)
export const hasSupabase = !!real
