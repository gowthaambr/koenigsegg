"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function AuthCodeErrorPage() {
    return (
        <main
            className="min-h-screen !bg-black text-white flex items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>

                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">Authentication Error</h1>

                    <p className="text-white/70 mb-6">
                        There was an error processing your authentication request. This could be due to:
                    </p>

                    <ul className="text-left text-white/60 text-sm mb-8 space-y-2">
                        <li>• The verification link has expired</li>
                        <li>• The link has already been used</li>
                        <li>• An invalid or corrupted link</li>
                    </ul>

                    <div className="space-y-3">
                        <Link
                            href="/signup"
                            className="block w-full px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all uppercase tracking-wider"
                        >
                            Try Signing Up Again
                        </Link>

                        <Link
                            href="/signin"
                            className="block w-full px-8 py-3 text-sm font-bold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all uppercase tracking-wider"
                        >
                            Sign In Instead
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white mt-4 transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
