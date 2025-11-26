import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Check if credentials are valid (not placeholders)
    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') ||
        supabaseKey.includes('placeholder')) {
        throw new Error('Please configure your Supabase credentials in .env.local')
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}
