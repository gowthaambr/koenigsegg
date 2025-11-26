"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const { updatePassword } = useAuth()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        try {
            const { error: updateError } = await updatePassword(formData.password)

            if (updateError) {
                setError(updateError.message)
            } else {
                setSuccess(true)
                // Redirect to sign-in after 2 seconds
                setTimeout(() => {
                    router.push('/signin')
                }, 2000)
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <main
                className="min-h-screen !bg-black text-white flex items-center justify-center p-6 relative overflow-hidden"
                style={{ backgroundColor: '#000000' }}
            >
                <div className="absolute inset-0 z-0 bg-black" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center border-2 border-white">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Password Updated!</h1>
                    <p className="text-white/70 mb-6">
                        Your password has been successfully updated.
                    </p>
                    <p className="text-sm text-white/50">
                        Redirecting to sign in...
                    </p>
                </motion.div>
            </main>
        )
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
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Reset Password</h1>
                        <p className="text-white/60 text-sm">Enter your new password</p>
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
                            <label htmlFor="password" className="text-xs font-bold uppercase text-white/70 ml-1">New Password</label>
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

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-xs font-bold uppercase text-white/70 ml-1">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? "Updating Password..." : "Update Password"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </main>
    )
}
