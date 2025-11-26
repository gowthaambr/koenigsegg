"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, User, Phone, MapPin, DollarSign, Car } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"

const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Contact", icon: Phone },
    { id: 3, title: "Preferences", icon: DollarSign },
]

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        netWorthRange: "",
        ownsCar: false,
        carModel: ""
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        setError(null)
    }

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Get current user with retry logic
            let currentUser = user

            if (!currentUser && !authLoading) {
                // Wait a bit and try again
                await new Promise(resolve => setTimeout(resolve, 1000))
                const { data: { user: freshUser } } = await supabase.auth.getUser()
                currentUser = freshUser
            }

            if (!currentUser) {
                // If still no user, save to localStorage and continue
                console.warn('No user session, saving to localStorage')
                localStorage.setItem('onboarding_data', JSON.stringify(formData))
                router.push('/exclusive')
                return
            }

            // Try to save to Supabase profiles table
            try {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: currentUser.id,
                        full_name: formData.fullName,
                        phone: formData.phone,
                        preferences: {
                            address: formData.address,
                            netWorthRange: formData.netWorthRange,
                            ownsCar: formData.ownsCar,
                            carModel: formData.carModel
                        },
                        updated_at: new Date().toISOString()
                    })

                if (profileError) {
                    console.warn('Profile save error, using localStorage:', profileError)
                    localStorage.setItem('onboarding_data', JSON.stringify({
                        ...formData,
                        userId: currentUser.id
                    }))
                }
            } catch (dbError) {
                console.warn('Database error, using localStorage:', dbError)
                localStorage.setItem('onboarding_data', JSON.stringify({
                    ...formData,
                    userId: currentUser.id
                }))
            }

            // Always redirect to exclusive page
            router.push('/exclusive')

        } catch (err) {
            console.error('Onboarding error:', err)
            setError("An error occurred. Redirecting anyway...")
            setTimeout(() => router.push('/exclusive'), 2000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main
            className="min-h-screen !bg-black text-white flex items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1"></div>
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">Welcome to Koenigsegg</h1>
                                <p className="text-white/60 text-sm">Complete your profile to access exclusive content</p>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.push('/exclusive')}
                                    className="text-sm text-white/60 hover:text-white transition-colors underline"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-12">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-white bg-white text-black' :
                                            isCompleted ? 'border-white bg-white/10 text-white' :
                                                'border-white/20 bg-white/5 text-white/40'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <p className={`text-xs mt-2 font-medium ${isActive ? 'text-white' : 'text-white/40'
                                            }`}>{step.title}</p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-white' : 'bg-white/10'
                                            }`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label htmlFor="fullName" className="text-xs font-bold uppercase text-white/70 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-xs font-bold uppercase text-white/70 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="address" className="text-xs font-bold uppercase text-white/70 ml-1">Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                            placeholder="123 Hypercar Blvd"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label htmlFor="netWorthRange" className="text-xs font-bold uppercase text-white/70 ml-1">Estimated Net Worth</label>
                                        <select
                                            id="netWorthRange"
                                            name="netWorthRange"
                                            value={formData.netWorthRange}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Select Range</option>
                                            <option value="<1M">Less than $1M</option>
                                            <option value="1M-5M">$1M - $5M</option>
                                            <option value="5M-10M">$5M - $10M</option>
                                            <option value="10M-50M">$10M - $50M</option>
                                            <option value="50M+">$50M+</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="ownsCar"
                                                checked={formData.ownsCar}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded border-white/20 bg-black/40 text-white focus:ring-white/40"
                                            />
                                            <span className="text-sm text-white/80">I own a Koenigsegg</span>
                                        </label>

                                        {formData.ownsCar && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                <label htmlFor="carModel" className="text-xs font-bold uppercase text-white/70 ml-1">Car Model</label>
                                                <input
                                                    type="text"
                                                    id="carModel"
                                                    name="carModel"
                                                    value={formData.carModel}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                                    placeholder="e.g., Jesko, Gemera, CC850"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-4 mt-8">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 bg-white/10 text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-white/20 transition-all"
                                >
                                    Back
                                </button>
                            )}

                            {currentStep < steps.length ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    Next <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? "Completing..." : "Complete"}
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    )
}
