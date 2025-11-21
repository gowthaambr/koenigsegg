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
            <div className="flex items-center gap-2">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white uppercase">
                    Koenigsegg
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
                    className="px-6 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-colors uppercase tracking-wider"
                >
                    Dealers
                </button>
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
                                className="w-full px-6 py-3 text-center font-bold text-black bg-white rounded-full hover:bg-gray-200"
                            >
                                Dealers
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
