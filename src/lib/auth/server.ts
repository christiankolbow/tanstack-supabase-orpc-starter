import { createServerFn } from '@tanstack/react-start'
import { env } from '@/env'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: res, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) return { error: true, message: error.message }
    return { error: false, user: { id: res.user?.id, email: res.user?.email } }
  })

export const signupFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (error) return { error: true, message: error.message }
    return { error: false, message: 'Check your email to confirm.' }
  })

export const recoverFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: env.VITE_SITE_URL ? `${env.VITE_SITE_URL}/reset` : undefined,
    })
    if (error) return { error: true, message: error.message }
    return { error: false, message: 'Recovery email sent.' }
  })

export const logoutFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signOut()
    if (error) return { error: true, message: error.message }
    return { error: false }
  })
