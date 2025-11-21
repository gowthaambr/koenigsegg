"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-6">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white uppercase">
                    Koenigsegg
                </Link>
                <Link
                    href="/exclusive"
                    className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    title="Ghost Squadron - Exclusive Access"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white transition-transform group-hover:rotate-12">
                        <path d="M12 2C9 2 7 4 7 7v5c0 2 1 3 1 3s-1 2-3 2c0 0 1 2 3 2v1c0 1 2 2 4 2h4c2 0 4-1 4-2v-1c2 0 3-2 3-2s-1-1-1-3c0 0 1-1 1-3V7c0-3-2-5-5-5zm0 2c1.5 0 3 1 3 3v1h-6V7c0-2 1.5-3 3-3zm-2 7c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1zm4 0c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
                <Link href="#models" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                    Models
                </Link>
                <Link href="#experience" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                    Experience
                </Link>
                <Link href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                    News
                </Link>
                <button
                    onClick={() => document.getElementById('dealers')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest"
                >
                    Dealers
                </button>
                <Link href="/signin" className="px-6 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-colors uppercase tracking-wider">
                    Sign In
                </Link>
                <Link href="/signup" className="px-6 py-2 text-sm font-bold text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wider">
                    Sign Up
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10"
                    >
                        <div className="flex flex-col p-6 space-y-6">
                            <Link href="#models" className="text-lg font-medium text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>
                                Models
                            </Link>
                            <Link href="#experience" className="text-lg font-medium text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>
                                Experience
                            </Link>
                            <Link href="#" className="text-lg font-medium text-white hover:text-gray-300" onClick={() => setIsOpen(false)}>
                                News
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    document.getElementById('dealers')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-lg font-medium text-white hover:text-gray-300 text-left"
                            >
                                Dealers
                            </button>
                            <Link
                                href="/signin"
                                className="w-full px-6 py-3 text-center font-bold text-black bg-white rounded-full hover:bg-gray-200 block"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="w-full px-6 py-3 text-center font-bold text-white border border-white/30 rounded-full hover:bg-white/10 block"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
