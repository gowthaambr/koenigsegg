"use client"

import { Globe } from "@/components/ui/globe"
import { motion } from "framer-motion"
import { useState } from "react"

interface Dealer {
    id: string
    name: string
    location: string
    coordinates: [number, number]
    address: string
    phone: string
}

const dealers: Dealer[] = [
    {
        id: "hq",
        name: "Koenigsegg HQ",
        location: "Ängelholm, Sweden",
        coordinates: [56.2925, 12.8567],
        address: "Kelliehousevägen 73, 262 74 Ängelholm",
        phone: "+46 431 45 44 60"
    },
    {
        id: "london",
        name: "Koenigsegg London",
        location: "London, UK",
        coordinates: [51.5074, -0.1278],
        address: "385 Kensington High St, London W14 8QA",
        phone: "+44 20 7371 5000"
    },
    {
        id: "monaco",
        name: "Koenigsegg Monaco",
        location: "Monte Carlo, Monaco",
        coordinates: [43.7384, 7.4246],
        address: "17 Avenue des Spélugues, 98000 Monaco",
        phone: "+377 97 97 30 30"
    },
    {
        id: "nyc",
        name: "Koenigsegg New York",
        location: "New York, USA",
        coordinates: [40.7128, -74.0060],
        address: "11th Avenue, New York, NY 10019",
        phone: "+1 212 594 5000"
    },
    {
        id: "la",
        name: "Koenigsegg Los Angeles",
        location: "Beverly Hills, USA",
        coordinates: [34.0736, -118.4004],
        address: "8833 W Olympic Blvd, Beverly Hills, CA 90211",
        phone: "+1 310 247 0000"
    },
    {
        id: "tokyo",
        name: "Koenigsegg Tokyo",
        location: "Tokyo, Japan",
        coordinates: [35.6762, 139.6503],
        address: "Minato City, Tokyo 106-0032",
        phone: "+81 3 1234 5678"
    },
    {
        id: "dubai",
        name: "Koenigsegg Dubai",
        location: "Dubai, UAE",
        coordinates: [25.2048, 55.2708],
        address: "Sheikh Zayed Road, Dubai",
        phone: "+971 4 123 4567"
    },
    {
        id: "shanghai",
        name: "Koenigsegg Shanghai",
        location: "Shanghai, China",
        coordinates: [31.2304, 121.4737],
        address: "Xintiandi, Shanghai",
        phone: "+86 21 1234 5678"
    },
]

export function Dealers() {
    const [activeDealer, setActiveDealer] = useState<Dealer | null>(null)
    const [markerPositions, setMarkerPositions] = useState<{ lat: number; lng: number; x: number; y: number; visible: boolean }[]>([])

    const markers = dealers.map(d => ({
        location: d.coordinates,
        size: activeDealer?.id === d.id ? 0.1 : 0.05
    }))

    const handleMarkerClick = (dealer: Dealer) => {
        setActiveDealer(dealer)
        // Scroll to the dealer in the list
        const dealerElement = document.getElementById(`dealer-${dealer.id}`)
        if (dealerElement) {
            dealerElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    return (
        <section id="dealers" className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden py-20">
            <div className="relative z-10 text-center mb-12 px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-widest"
                >
                    Global Network
                </motion.h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Find authorized Koenigsegg dealers and service centers worldwide. Click on the markers to view details.
                </p>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    {/* Globe Section */}
                    <div className="lg:col-span-2 relative h-[500px] md:h-[700px] flex items-center justify-center order-2 lg:order-1">
                        <Globe
                            className="top-0"
                            markers={markers}
                            onMarkerUpdate={setMarkerPositions}
                        />

                        {/* Clickable Marker Overlays */}
                        {markerPositions.map((pos, index) => {
                            const dealer = dealers[index]
                            if (!dealer || !pos.visible) return null

                            return (
                                <button
                                    key={dealer.id}
                                    onClick={() => handleMarkerClick(dealer)}
                                    onMouseEnter={() => setActiveDealer(dealer)}
                                    onMouseLeave={() => setActiveDealer(null)}
                                    className="absolute w-10 h-10 rounded-full hover:bg-white/10 transition-all cursor-pointer z-10 group"
                                    style={{
                                        left: `${pos.x}%`,
                                        top: `${pos.y}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                    title={dealer.name}
                                >
                                    <span className="absolute inset-0 rounded-full bg-orange-500/20 group-hover:bg-orange-500/40 animate-pulse" />
                                </button>
                            )
                        })}

                        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,0.8))]" />

                        {/* Tooltip on Hover */}
                        {activeDealer && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center pointer-events-none z-20"
                            >
                                <h3 className="text-white font-bold text-lg">{activeDealer.name}</h3>
                                <p className="text-gray-300 text-sm">{activeDealer.location}</p>
                                <p className="text-gray-400 text-xs mt-1">Click to view details</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Dealers List */}
                    <div className="lg:col-span-1 h-[500px] overflow-y-auto pr-4 custom-scrollbar order-1 lg:order-2">
                        <div className="flex flex-col gap-4">
                            {dealers.map((dealer) => (
                                <motion.div
                                    key={dealer.id}
                                    id={`dealer-${dealer.id}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    onMouseEnter={() => setActiveDealer(dealer)}
                                    onMouseLeave={() => setActiveDealer(null)}
                                    className={`p-6 rounded-xl border transition-all cursor-pointer ${activeDealer?.id === dealer.id
                                        ? "bg-white/10 border-white/40 scale-105"
                                        : "bg-neutral-900/50 border-white/5 hover:bg-neutral-800"
                                        }`}
                                >
                                    <h3 className="text-xl font-bold text-white mb-1">{dealer.name}</h3>
                                    <p className="text-blue-400 text-sm font-medium mb-3 uppercase tracking-wider">{dealer.location}</p>
                                    <div className="space-y-1 text-sm text-gray-400">
                                        <p>{dealer.address}</p>
                                        <p>{dealer.phone}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
