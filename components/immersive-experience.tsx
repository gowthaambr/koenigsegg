"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Power, Gauge, Battery, Zap, Eye, Car } from "lucide-react"

export function ImmersiveExperience() {
    const [isStarted, setIsStarted] = useState(false)
    const [viewMode, setViewMode] = useState<"cockpit" | "front">("cockpit")
    const [rpm, setRpm] = useState(0)
    const [speed, setSpeed] = useState(0)

    useEffect(() => {
        if (isStarted) {
            const interval = setInterval(() => {
                setRpm(prev => Math.min(prev + 100, 8500))
                setSpeed(prev => Math.min(prev + 2, 300))
            }, 50)
            return () => clearInterval(interval)
        } else {
            setRpm(0)
            setSpeed(0)
        }
    }, [isStarted])

    return (
        <section id="experience" className="relative w-full h-screen bg-neutral-900 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-black opacity-80" />

            {/* Front View Animation Layer */}
            {viewMode === "front" && isStarted && (
                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                    {/* Moving Road Effect */}
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-gray-900 to-black transform perspective-[1000px]">
                        <div className="w-full h-full flex justify-center">
                            <div className="w-2 h-full bg-white/20 animate-[moveRoad_0.5s_linear_infinite]" />
                        </div>
                    </div>
                    {/* Speed Lines */}
                    <div className="absolute inset-0 w-full h-full opacity-30">
                        <div className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-white/50 -translate-x-1/2 -translate-y-1/2 rotate-45 animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-white/50 -translate-x-1/2 -translate-y-1/2 -rotate-45 animate-pulse delay-75" />
                    </div>
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-6xl px-4">
                <motion.div
                    className="text-center mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-widest">
                        {viewMode === "cockpit" ? "Cockpit View" : "Front View"}
                    </h2>
                    <p className="text-gray-400">Engage the hypercar experience.</p>
                </motion.div>

                {/* Controls */}
                <div className="flex gap-6 mb-8">
                    <button
                        onClick={() => setViewMode("cockpit")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${viewMode === "cockpit" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
                    >
                        <Gauge className="w-5 h-5" /> Cockpit
                    </button>
                    <button
                        onClick={() => setViewMode("front")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${viewMode === "front" ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
                    >
                        <Eye className="w-5 h-5" /> Front View
                    </button>
                </div>

                {/* Start Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsStarted(!isStarted)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isStarted
                            ? "border-red-500 bg-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.5)]"
                            : "border-white/20 bg-white/5 hover:border-white/50"
                        }`}
                >
                    <Power className={`w-10 h-10 ${isStarted ? "text-red-500" : "text-white"}`} />
                </motion.button>

                {/* Dashboard (Cockpit Mode) */}
                <AnimatePresence>
                    {isStarted && viewMode === "cockpit" && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 shadow-2xl"
                        >
                            {/* Speedometer */}
                            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                                <Gauge className="w-8 h-8 text-blue-400 mb-4" />
                                <span className="text-6xl font-mono font-bold text-white tabular-nums">
                                    {speed}
                                </span>
                                <span className="text-sm text-gray-400 uppercase tracking-wider mt-2">KM/H</span>
                            </div>

                            {/* Center Console */}
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                                        style={{ width: `${(rpm / 9000) * 100}%` }}
                                    />
                                </div>
                                <span className="text-2xl font-mono font-bold text-white tabular-nums">
                                    {rpm} <span className="text-sm text-gray-500">RPM</span>
                                </span>
                                <div className="flex gap-4 mt-4">
                                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold uppercase border border-green-500/30">
                                        Sport Mode
                                    </div>
                                    <div className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-bold uppercase border border-orange-500/30">
                                        Traction Off
                                    </div>
                                </div>
                            </div>

                            {/* Battery/Power */}
                            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4 mb-4">
                                    <Battery className="w-6 h-6 text-green-400" />
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-white">98%</span>
                                    <span className="text-xs text-gray-400 uppercase">Battery</span>
                                </div>
                                <div className="w-full h-1 bg-neutral-700 rounded-full mt-4 overflow-hidden">
                                    <div className="w-[98%] h-full bg-green-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Front View Overlay (Simple HUD) */}
                <AnimatePresence>
                    {isStarted && viewMode === "front" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-10 w-full max-w-4xl flex justify-between px-8 pointer-events-none"
                        >
                            <div className="text-white font-mono text-4xl font-bold drop-shadow-lg">{speed} <span className="text-sm">KM/H</span></div>
                            <div className="text-white font-mono text-4xl font-bold drop-shadow-lg">{rpm} <span className="text-sm">RPM</span></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}
