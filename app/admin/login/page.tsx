"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, ArrowLeft, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { signIn } = useAuth()
    const router = useRouter()

    // Hardcoded admin credentials - Works without Supabase
    const ADMIN_EMAIL = "admin@koenigsegg.com"
    const ADMIN_PASSWORD = "Admin@123"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Check hardcoded admin credentials first
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Store admin session in localStorage
                localStorage.setItem('admin_session', JSON.stringify({
                    email: ADMIN_EMAIL,
                    isAdmin: true,
                    loginTime: new Date().toISOString()
                }))

                // Redirect to admin dashboard
                router.push('/admin')
                return
            }

            // If not hardcoded admin, try Supabase authentication
            if (email !== ADMIN_EMAIL) {
                setError("Access denied. This email is not authorized for admin access.")
                setLoading(false)
                return
            }

            // Try Supabase sign in for admin email with different password
            const { error: signInError } = await signIn(email, password)

            if (signInError) {
                setError("Invalid credentials. Please check your email and password.")
                setLoading(false)
                return
            }

            // Redirect to admin dashboard
            router.push('/admin')
        } catch (err) {
            setError("Invalid credentials. Please try again.")
            setLoading(false)
        }
    }

    return (
        <main
            className="min-h-screen !bg-black text-white flex items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Admin Access</h1>
                        <p className="text-white/60 text-sm">Authorized personnel only</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold uppercase text-white/70 ml-1">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="admin@koenigsegg.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-bold uppercase text-white/70 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                        >
                            {loading ? "Verifying..." : "Access Dashboard"}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-xs text-white/60 text-center">
                            <Lock className="w-3 h-3 inline mr-1" />
                            This area is restricted to authorized administrators only.
                        </p>
                    </div>

                    {/* Help */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-white/40">
                            Need help? Contact{" "}
                            <a href="mailto:support@koenigsegg.com" className="text-white/60 hover:text-white underline">
                                support@koenigsegg.com
                            </a>
                        </p>
                    </div>
                </motion.div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-white/40">
                        🔒 All login attempts are monitored and logged
                    </p>
                </div>
            </div>
        </main>
    )
}
