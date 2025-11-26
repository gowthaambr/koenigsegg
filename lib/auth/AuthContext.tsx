"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    loading: boolean
    signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>
    updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Check if Supabase is configured
    const isSupabaseConfigured =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')

    const supabase = isSupabaseConfigured ? createClient() : null

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false)
            setError('Supabase not configured. Please add your credentials to .env.local')
            return
        }

        // Get initial session
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
                setLoading(false)
            } catch (err) {
                console.error('Auth error:', err)
                setLoading(false)
            }
        }

        getUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)

                // Refresh the page to update server components
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                    router.refresh()
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, router, isSupabaseConfigured])

    const signUp = async (email: string, password: string, metadata?: any) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } as AuthError }
        }
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        return { error }
    }

    const signIn = async (email: string, password: string) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } as AuthError }
        }
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { error }
    }

    const signOut = async () => {
        if (!supabase) return
        await supabase.auth.signOut()
        router.push('/')
    }

    const resetPassword = async (email: string) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } as AuthError }
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        return { error }
    }

    const updatePassword = async (newPassword: string) => {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } as AuthError }
        }
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        })
        return { error }
    }

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
