"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

export default function SignInPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { signIn } = useAuth()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { error: signInError } = await signIn(formData.email, formData.password)

            if (signInError) {
                setError(signInError.message)
            } else {
                // Redirect to exclusive page after successful login
                router.push('/exclusive')
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main
            className="min-h-screen !bg-black text-white flex items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Sign In</h1>
                        <p className="text-white/60 text-sm">Access your exclusive Koenigsegg account</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold uppercase text-white/70 ml-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-bold uppercase text-white/70 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                        <div className="text-center mt-4 space-y-2">
                            <Link href="/forgot-password" className="block text-sm text-white/60 hover:text-white transition-colors">
                                Forgot your password?
                            </Link>
                            <p className="text-sm text-white/60">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-white hover:underline font-medium">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    )
}
