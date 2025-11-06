// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

let real: SupabaseClient | null = null
if (url && key) {
  real = createClient(url, key)
} else {
  console.warn('⚠️ Supabase DESATIVADO (variáveis ausentes). Usando stub para evitar quebra.')
}

// ---- STUB com métodos comuns ----
const chain = {
  eq() { return this },
  neq() { return this },
  order() { return this },
  limit() { return this },
  single() { return { data: null, error: null } },
  async select()  { return { data: [],   error: null } },
  async insert()  { return { data: null, error: null } },
  async upsert()  { return { data: null, error: null } },
  async update()  { return { data: null, error: null } },
  async delete()  { return { data: null, error: null } },
}

const stub = {
  from() { return chain },
  rpc()  { return Promise.resolve({ data: null, error: null }) },
  storage: {
    from() { return {
      list: async () => ({ data: [],   error: null }),
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }},
  },
  auth: {
    // ✅ faltava isso no seu erro
    async getSession() { return { data: { session: null }, error: null } },
    async getUser()    { return { data: { user: null },    error: null } },
    async signInWithPassword() { return { data: { user: null, session: null }, error: null } },
    async signInWithOAuth()    { return { data: { user: null, session: null }, error: null } },
    async signOut()            { return { error: null } },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } }, error: null }
    },
  },
} as unknown as SupabaseClient
// ---------------------------------

export const supabase: SupabaseClient = (real ?? stub)
export const hasSupabase = !!real
