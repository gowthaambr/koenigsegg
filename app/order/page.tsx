"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Car, Palette, Settings, Send } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"

const carModels = [
    { id: "jesko", name: "Jesko", price: "$3,000,000", description: "Ultimate track performance" },
    { id: "jesko-absolut", name: "Jesko Absolut", price: "$3,400,000", description: "Top speed record breaker" },
    { id: "gemera", name: "Gemera", price: "$1,700,000", description: "4-seater mega-GT" },
    { id: "cc850", name: "CC850", price: "$3,650,000", description: "Anniversary edition" },
]

const colors = [
    { id: "carbon", name: "Naked Carbon", hex: "#1a1a1a" },
    { id: "white", name: "Arctic White", hex: "#f8f8f8" },
    { id: "red", name: "Racing Red", hex: "#dc2626" },
    { id: "blue", name: "Ocean Blue", hex: "#2563eb" },
    { id: "orange", name: "Sunset Orange", hex: "#ea580c" },
    { id: "custom", name: "Custom Color", hex: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)" },
]

const interiorOptions = [
    { id: "black", name: "Black Leather" },
    { id: "tan", name: "Tan Leather" },
    { id: "red", name: "Red Alcantara" },
    { id: "carbon", name: "Carbon Fiber" },
]

export default function OrderPage() {
    const [step, setStep] = useState(1)
    const [selectedModel, setSelectedModel] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [selectedInterior, setSelectedInterior] = useState("")
    const [customizations, setCustomizations] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin')
        }
    }, [user, authLoading, router])

    const handleSubmit = async () => {
        if (!user) return

        // Store order details in sessionStorage and redirect to payment
        const orderDetails = {
            model: selectedModel,
            color: selectedColor,
            interior: selectedInterior,
            customizations: customizations,
            price: carModels.find(m => m.id === selectedModel)?.price || "$0"
        }

        sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails))
        router.push('/payment')
    }

    if (authLoading || !user) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading...</p>
                </div>
            </main>
        )
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center border-2 border-white">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Order Submitted!</h1>
                    <p className="text-white/70 mb-8">
                        Thank you for your interest in Koenigsegg. Our team will contact you shortly to discuss your configuration.
                    </p>
                    <Link
                        href="/exclusive"
                        className="inline-block px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all uppercase tracking-wider"
                    >
                        Back to Exclusive
                    </Link>
                </motion.div>
            </main>
        )
    }

    return (
        <main
            className="min-h-screen !bg-black text-white p-6 md:p-12 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <Link href="/exclusive" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Exclusive
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl"
                >
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">Configure Your Koenigsegg</h1>
                    <p className="text-white/60 mb-8">Build your dream hypercar</p>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-12">
                        {[
                            { id: 1, title: "Model", icon: Car },
                            { id: 2, title: "Exterior", icon: Palette },
                            { id: 3, title: "Interior", icon: Settings },
                        ].map((s, index) => {
                            const Icon = s.icon
                            const isActive = step === s.id
                            const isCompleted = step > s.id

                            return (
                                <div key={s.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-white bg-white text-black' :
                                            isCompleted ? 'border-white bg-white/10 text-white' :
                                                'border-white/20 bg-white/5 text-white/40'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <p className={`text-xs mt-2 font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>{s.title}</p>
                                    </div>
                                    {index < 2 && (
                                        <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-white' : 'bg-white/10'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Model Selection */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-2xl font-bold mb-6">Choose Your Model</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {carModels.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => setSelectedModel(model.id)}
                                            className={`p-6 rounded-xl border-2 transition-all text-left ${selectedModel === model.id
                                                ? 'border-white bg-white/10'
                                                : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                                            <p className="text-white/60 text-sm mb-3">{model.description}</p>
                                            <p className="text-2xl font-bold">{model.price}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Color Selection */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-2xl font-bold mb-6">Choose Exterior Color</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {colors.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => setSelectedColor(color.id)}
                                            className={`p-4 rounded-xl border-2 transition-all ${selectedColor === color.id
                                                ? 'border-white bg-white/10'
                                                : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div
                                                className="w-full h-20 rounded-lg mb-3"
                                                style={{ background: color.hex }}
                                            />
                                            <p className="font-medium">{color.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Interior & Customization */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-2xl font-bold mb-6">Interior & Customization</h2>

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold mb-4">Interior Finish</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {interiorOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setSelectedInterior(option.id)}
                                                className={`p-4 rounded-xl border-2 transition-all ${selectedInterior === option.id
                                                    ? 'border-white bg-white/10'
                                                    : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <p className="font-medium">{option.name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-4">Additional Customizations</h3>
                                    <textarea
                                        value={customizations}
                                        onChange={(e) => setCustomizations(e.target.value)}
                                        placeholder="Describe any special requests or customizations..."
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors min-h-[120px]"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 bg-white/10 text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-white/20 transition-all"
                            >
                                Back
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={
                                    (step === 1 && !selectedModel) ||
                                    (step === 2 && !selectedColor)
                                }
                                className="flex-1 bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !selectedInterior}
                                className="flex-1 bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? "Processing..." : (
                                    <>
                                        Proceed to Payment
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
