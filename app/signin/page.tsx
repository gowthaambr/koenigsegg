"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignInPage() {
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        gmail: "",
        address: "",
        netWorth: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        // Handle login logic here
    }

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),rgba(0,0,0,0))]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20" />
            </div>

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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-xs font-bold uppercase text-white/70 ml-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="number" className="text-xs font-bold uppercase text-white/70 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="gmail" className="text-xs font-bold uppercase text-white/70 ml-1">Gmail Address</label>
                            <input
                                type="email"
                                id="gmail"
                                name="gmail"
                                value={formData.gmail}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                placeholder="john.doe@gmail.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address" className="text-xs font-bold uppercase text-white/70 ml-1">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                placeholder="123 Hypercar Blvd"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="netWorth" className="text-xs font-bold uppercase text-white/70 ml-1">Estimated Net Worth</label>
                            <select
                                id="netWorth"
                                name="netWorth"
                                value={formData.netWorth}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none"
                            >
                                <option value="" disabled>Select Range</option>
                                <option value="<1M">Less than $1M</option>
                                <option value="1M-5M">$1M - $5M</option>
                                <option value="5M-10M">$5M - $10M</option>
                                <option value="10M-50M">$10M - $50M</option>
                                <option value="50M+">$50M+</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] mt-4"
                        >
                            Sign In
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
