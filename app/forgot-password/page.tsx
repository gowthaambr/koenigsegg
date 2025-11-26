"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { resetPassword } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { error: resetError } = await resetPassword(email)

            if (resetError) {
                setError(resetError.message)
            } else {
                setSubmitted(true)
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
                <Link href="/signin" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                >
                    {!submitted ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-white/80" />
                                </div>
                                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Forgot Password</h1>
                                <p className="text-white/60 text-sm">Enter your email to reset your password</p>
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm text-white/60">
                                        Remember your password?{" "}
                                        <Link href="/signin" className="text-white hover:underline font-medium">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center border-2 border-white">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                            <p className="text-white/70 mb-6">
                                We've sent a password reset link to <br />
                                <span className="text-white font-medium">{email}</span>
                            </p>
                            <p className="text-sm text-white/50 mb-6">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <Link
                                href="/signin"
                                className="inline-block px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all uppercase tracking-wider"
                            >
                                Back to Sign In
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </main>
    )
}
