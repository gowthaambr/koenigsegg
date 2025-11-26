"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Sparkles, Zap, Settings2, Palette, Gauge } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

const models = [
    { id: "jesko", name: "Jesko", price: "$3,000,000" },
    { id: "jesko-absolut", name: "Jesko Absolut", price: "$3,400,000" },
    { id: "gemera", name: "Gemera", price: "$1,700,000" },
    { id: "cc850", name: "CC850", price: "$3,650,000" },
]

const exteriorColors = [
    { id: "carbon", name: "Naked Carbon Fiber", price: "+$50,000" },
    { id: "white", name: "Arctic White Pearl", price: "+$15,000" },
    { id: "red", name: "Racing Red Metallic", price: "+$20,000" },
    { id: "blue", name: "Ocean Blue Metallic", price: "+$20,000" },
    { id: "orange", name: "Sunset Orange", price: "+$25,000" },
    { id: "custom", name: "Custom Color Match", price: "+$75,000" },
]

const interiorOptions = [
    { id: "black-leather", name: "Black Nappa Leather", price: "Included" },
    { id: "tan-leather", name: "Tan Nappa Leather", price: "+$10,000" },
    { id: "red-alcantara", name: "Red Alcantara", price: "+$15,000" },
    { id: "carbon-fiber", name: "Full Carbon Fiber", price: "+$50,000" },
    { id: "bespoke", name: "Bespoke Interior", price: "+$100,000" },
]

const performancePackages = [
    { id: "standard", name: "Standard", description: "Factory specifications", price: "Included" },
    { id: "track", name: "Track Package", description: "Enhanced aerodynamics, racing suspension", price: "+$150,000" },
    { id: "ultimate", name: "Ultimate Performance", description: "Maximum power output, carbon ceramics", price: "+$250,000" },
]

const wheelOptions = [
    { id: "standard", name: "Standard Forged Alloy", price: "Included" },
    { id: "carbon", name: "Carbon Fiber Wheels", price: "+$50,000" },
    { id: "diamond", name: "Diamond-Cut Alloy", price: "+$25,000" },
]

const aerodynamicOptions = [
    { id: "standard", name: "Standard Aero", checked: true },
    { id: "active-rear", name: "Active Rear Wing", checked: false, price: "+$30,000" },
    { id: "front-splitter", name: "Carbon Front Splitter", checked: false, price: "+$15,000" },
    { id: "side-skirts", name: "Extended Side Skirts", checked: false, price: "+$10,000" },
    { id: "diffuser", name: "Enhanced Rear Diffuser", checked: false, price: "+$20,000" },
]

const technologyOptions = [
    { id: "sound", name: "Premium Sound System", checked: false, price: "+$25,000" },
    { id: "telemetry", name: "Advanced Telemetry System", checked: false, price: "+$35,000" },
    { id: "cameras", name: "360° Camera System", checked: false, price: "+$15,000" },
    { id: "hud", name: "Head-Up Display", checked: false, price: "+$20,000" },
]

export default function ConfiguratorPage() {
    const [step, setStep] = useState(1)
    const [config, setConfig] = useState({
        model: "",
        exteriorColor: "",
        interior: "",
        performance: "",
        wheels: "",
        aero: aerodynamicOptions,
        technology: technologyOptions,
        customNotes: ""
    })

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin')
        }
    }, [user, authLoading, router])

    const handleAeroToggle = (id: string) => {
        setConfig(prev => ({
            ...prev,
            aero: prev.aero.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        }))
    }

    const handleTechToggle = (id: string) => {
        setConfig(prev => ({
            ...prev,
            technology: prev.technology.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        }))
    }

    const handleSubmit = () => {
        const orderDetails = {
            ...config,
            aero: config.aero.filter(a => a.checked),
            technology: config.technology.filter(t => t.checked),
        }
        sessionStorage.setItem('exclusiveOrder', JSON.stringify(orderDetails))
        router.push('/payment')
    }

    if (authLoading || !user) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </main>
        )
    }

    const totalSteps = 6

    return (
        <main
            className="min-h-screen !bg-black text-white relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 max-w-6xl mx-auto">
                <Link href="/exclusive" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Ghost Squadron
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    <div>
                        <h1 className="text-4xl font-bold uppercase tracking-wider">Exclusive Configurator</h1>
                        <p className="text-white/60">Ghost Squadron Members Only</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between mb-2">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 h-2 mx-1 rounded-full transition-all ${i + 1 <= step ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-white/60 text-center">Step {step} of {totalSteps}</p>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Model Selection */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Zap className="w-8 h-8 text-yellow-400" />
                                Select Your Model
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {models.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => setConfig({ ...config, model: model.id })}
                                        className={`p-6 rounded-xl border-2 transition-all text-left ${config.model === model.id
                                            ? 'border-yellow-400 bg-yellow-400/10'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                                        <p className="text-3xl font-bold text-yellow-400">{model.price}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Exterior Color */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Palette className="w-8 h-8 text-yellow-400" />
                                Exterior Finish
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {exteriorColors.map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => setConfig({ ...config, exteriorColor: color.id })}
                                        className={`p-6 rounded-xl border-2 transition-all text-left ${config.exteriorColor === color.id
                                            ? 'border-yellow-400 bg-yellow-400/10'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <h3 className="text-xl font-bold mb-1">{color.name}</h3>
                                        <p className="text-yellow-400 font-medium">{color.price}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Interior */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <Settings2 className="w-8 h-8 text-yellow-400" />
                                Interior Configuration
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {interiorOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setConfig({ ...config, interior: option.id })}
                                        className={`p-6 rounded-xl border-2 transition-all text-left ${config.interior === option.id
                                            ? 'border-yellow-400 bg-yellow-400/10'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <h3 className="text-xl font-bold mb-1">{option.name}</h3>
                                        <p className="text-yellow-400 font-medium">{option.price}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Performance & Wheels */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Gauge className="w-8 h-8 text-yellow-400" />
                                    Performance Package
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {performancePackages.map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => setConfig({ ...config, performance: pkg.id })}
                                            className={`p-6 rounded-xl border-2 transition-all text-left ${config.performance === pkg.id
                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                                                    <p className="text-white/60 text-sm">{pkg.description}</p>
                                                </div>
                                                <p className="text-yellow-400 font-bold">{pkg.price}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold mb-4">Wheel Selection</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {wheelOptions.map((wheel) => (
                                        <button
                                            key={wheel.id}
                                            onClick={() => setConfig({ ...config, wheels: wheel.id })}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${config.wheels === wheel.id
                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <h4 className="font-bold mb-1">{wheel.name}</h4>
                                            <p className="text-yellow-400 text-sm">{wheel.price}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Aerodynamics */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-6">Aerodynamic Enhancements</h2>
                            <div className="space-y-3">
                                {config.aero.map((option) => (
                                    <label
                                        key={option.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={option.checked}
                                                onChange={() => handleAeroToggle(option.id)}
                                                disabled={option.id === 'standard'}
                                                className="w-5 h-5 rounded"
                                            />
                                            <span className="font-medium">{option.name}</span>
                                        </div>
                                        {option.price && <span className="text-yellow-400">{option.price}</span>}
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 6: Technology & Final Notes */}
                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Technology Options</h2>
                                <div className="space-y-3">
                                    {config.technology.map((option) => (
                                        <label
                                            key={option.id}
                                            className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={option.checked}
                                                    onChange={() => handleTechToggle(option.id)}
                                                    className="w-5 h-5 rounded"
                                                />
                                                <span className="font-medium">{option.name}</span>
                                            </div>
                                            <span className="text-yellow-400">{option.price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold mb-4">Special Requests</h3>
                                <textarea
                                    value={config.customNotes}
                                    onChange={(e) => setConfig({ ...config, customNotes: e.target.value })}
                                    placeholder="Any bespoke modifications, custom stitching patterns, personalized details..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400 transition-colors min-h-[150px]"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-4 mt-8">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="flex-1 bg-white/10 text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-white/20 transition-all"
                        >
                            Back
                        </button>
                    )}

                    {step < totalSteps ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={
                                (step === 1 && !config.model) ||
                                (step === 2 && !config.exteriorColor) ||
                                (step === 3 && !config.interior) ||
                                (step === 4 && (!config.performance || !config.wheels))
                            }
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold uppercase tracking-widest py-4 rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold uppercase tracking-widest py-4 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Proceed to Payment
                        </button>
                    )}
                </div>
            </div>
        </main>
    )
}
