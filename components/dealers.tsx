"use client"

import { Globe } from "@/components/ui/globe"
import { motion } from "framer-motion"

export function Dealers() {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden py-20">
            <div className="relative z-10 text-center mb-10 px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-widest"
                >
                    Global Network
                </motion.h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Find authorized Koenigsegg dealers and service centers worldwide.
                </p>
            </div>

            <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center">
                <Globe className="top-10" />
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 text-center text-gray-400 text-sm">
                <div>
                    <h3 className="text-white font-bold mb-2">Europe</h3>
                    <p>Ängelholm, Sweden (HQ)</p>
                    <p>London, UK</p>
                    <p>Monaco</p>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-2">North America</h3>
                    <p>New York, USA</p>
                    <p>Los Angeles, USA</p>
                    <p>Vancouver, Canada</p>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-2">Asia</h3>
                    <p>Tokyo, Japan</p>
                    <p>Shanghai, China</p>
                    <p>Dubai, UAE</p>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-2">Oceania</h3>
                    <p>Melbourne, Australia</p>
                </div>
            </div>
        </section>
    )
}
