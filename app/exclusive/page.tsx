"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

export default function ExclusivePage() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),rgba(0,0,0,0))]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20" />
            </div>

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
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
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
                    className="text-xl text-gray-400 mb-12 font-light"
                >
                    Exclusive access for Koenigsegg owners. <br />
                    Please sign in to verify your ownership and access the lounge.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link
                        href="/signin"
                        className="inline-block px-12 py-4 text-lg font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] uppercase tracking-widest"
                    >
                        Owner Login
                    </Link>
                </motion.div>
            </div>
        </main>
    )
}
