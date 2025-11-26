import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Use placeholder values if env vars are missing (for build-time)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

    // Only warn in development, don't throw during build
    if (typeof window !== 'undefined' &&
        (supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder'))) {
        console.warn('⚠️ Supabase credentials not configured. Some features may not work.')
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}
