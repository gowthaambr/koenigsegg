"use client"

import { InteractiveGrid } from "@/components/ui/interactive-grid"
import { motion } from "framer-motion"
import { Play, ChevronRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{
                        backgroundImage: "url('/cropped-download-koenigsegg-agera-r-wallpapers-koenigsegg-agera-r-image-picture.jpg')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Interactive Grid Overlay (Subtle) */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <InteractiveGrid dotDistance={40} dotRadius={1.5} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h2 className="text-sm md:text-lg font-bold tracking-[0.5em] text-red-500 uppercase mb-4">
                        Koenigsegg Automotive AB
                    </h2>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-6 uppercase drop-shadow-2xl">
                        Agera <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">RS</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                >
                    The result of the endless pursuit of perfection. <br className="hidden md:block" />
                    Experience the ultimate driving machine.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <button
                        onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-4 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Explore Models <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>

                    <Link
                        href="https://youtu.be/WTi1OJfovnk"
                        target="_blank"
                        className="group flex items-center gap-3 px-8 py-4 text-lg font-medium text-white border border-white/30 rounded-full hover:bg-white/10 hover:border-white/60 transition-all backdrop-blur-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-white text-white ml-1" />
                        </div>
                        <span>Watch the Film</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
