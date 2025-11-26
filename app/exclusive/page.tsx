"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

export default function ExclusivePage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Redirect to sign-in if not authenticated
        if (!loading && !user) {
            router.push('/signin')
        }
    }, [user, loading, router])

    // Show loading state while checking authentication
    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading...</p>
                </div>
            </main>
        )
    }

    // Don't render content if not authenticated
    if (!user) {
        return null
    }

    return (
        <main
            className="min-h-screen !bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            {/* Background Elements */}
            {/* Background Elements - Removed to ensure pure black */}
            {/* <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),rgba(0,0,0,0))]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20" />
            </div> */}
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        <Lock className="w-10 h-10 text-white/80" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6"
                >
                    Ghost <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Squadron</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-400 mb-8 font-light"
                >
                    Welcome to the exclusive Koenigsegg owners lounge, <br />
                    <span className="text-white font-medium">{user.email}</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl mb-8"
                >
                    <h2 className="text-2xl font-bold mb-4">Exclusive Content</h2>
                    <p className="text-white/70 mb-6">
                        This is your private space. Here you'll find exclusive updates, early access to new models,
                        private events, and a community of fellow Koenigsegg enthusiasts.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold mb-2">Private Events</h3>
                            <p className="text-sm text-white/60">Access to exclusive track days and owner gatherings</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold mb-2">Early Access</h3>
                            <p className="text-sm text-white/60">First look at new models and configurations</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold mb-2">Community</h3>
                            <p className="text-sm text-white/60">Connect with fellow owners worldwide</p>
                        </div>
                    </div>

                    <Link
                        href="/configurator"
                        className="mt-6 inline-block px-8 py-4 text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full hover:opacity-90 transition-all hover:scale-105 uppercase tracking-widest"
                    >
                        ✨ Exclusive Configurator - Build Your Dream Car
                    </Link>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-105 uppercase tracking-widest border border-white/20"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </motion.button>
            </div>
        </main>
    )
}
