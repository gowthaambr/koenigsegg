"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Smartphone, Check, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"

export default function PaymentPage() {
    const [orderDetails, setOrderDetails] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Delivery address states
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    })

    // Payment form states
    const [cardNumber, setCardNumber] = useState("")
    const [cardName, setCardName] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCvv] = useState("")

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin')
            return
        }

        // Get order details from sessionStorage
        const stored = sessionStorage.getItem('orderDetails')
        if (stored) {
            setOrderDetails(JSON.parse(stored))
        } else {
            // Initialize with Mock Order if accessed directly
            setOrderDetails({
                model: "Jesko Absolut (Test Spec)",
                color: "Crystal White",
                interior: "Desiato Black",
                price: "$3,000,000",
                customizations: "Track Package, Ghost Squadron Badge"
            })
        }
    }, [user, authLoading, router])

    const fillTestData = () => {
        setDeliveryAddress({
            street: "123 Test Avenue",
            city: "Supercar City",
            state: "Speed State",
            zipCode: "90210",
            country: "Testland"
        })
        setPaymentMethod("credit")
        setCardNumber("4242 4242 4242 4242")
        setCardName("Test Driver")
        setExpiryDate("12/30")
        setCvv("123")
    }

    const handlePayment = async () => {
        if (!user || !orderDetails) {
            console.error('Missing user or order details:', { user, orderDetails })
            alert('Missing required information. Please try again.')
            return
        }

        setLoading(true)

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Prepare delivery address
            const deliveryAddressStr = deliveryAddress.street || deliveryAddress.city || deliveryAddress.country
                ? `${deliveryAddress.street || ''}, ${deliveryAddress.city || ''}, ${deliveryAddress.state || ''} ${deliveryAddress.zipCode || ''}, ${deliveryAddress.country || ''}`.replace(/,\s*,/g, ',').trim()
                : 'Mock Delivery Address'

            const orderData = {
                id: crypto.randomUUID(),
                user_id: user.id,
                model: orderDetails.model,
                color: orderDetails.color,
                interior: orderDetails.interior,
                customizations: orderDetails.customizations || null,
                price: orderDetails.price,
                payment_method: 'mock',
                delivery_address: deliveryAddressStr,
                status: 'processing',
                created_at: new Date().toISOString()
            }

            console.log('Attempting to save order:', orderData)

            // Try Supabase first, fallback to localStorage
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .insert(orderData)
                    .select()

                if (error) {
                    console.warn('Supabase error, using localStorage fallback:', error)
                    // Store in localStorage as fallback
                    const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
                    existingOrders.unshift(orderData)
                    localStorage.setItem('mock_orders', JSON.stringify(existingOrders))
                    console.log('Order saved to localStorage')
                } else {
                    console.log('Order created successfully in Supabase:', data)
                }
            } catch (dbError) {
                console.warn('Database error, using localStorage:', dbError)
                // Store in localStorage as fallback
                const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
                existingOrders.unshift(orderData)
                localStorage.setItem('mock_orders', JSON.stringify(existingOrders))
                console.log('Order saved to localStorage')
            }

            setSuccess(true)
            sessionStorage.removeItem('orderDetails')
            sessionStorage.setItem('lastOrderId', orderData.id)

        } catch (err) {
            console.error('Payment error:', err)
            alert(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || !orderDetails) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading...</p>
                </div>
            </main>
        )
    }

    if (success) {
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
                    <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
                    <p className="text-white/70 mb-4">
                        Your order has been confirmed. Our team will contact you within 24 hours to finalize the details.
                    </p>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-8 text-left">
                        <p className="text-sm text-white/60 mb-2">Order Summary:</p>
                        <p className="font-bold text-lg">{orderDetails.model}</p>
                        <p className="text-white/80">{orderDetails.color} • {orderDetails.interior}</p>
                        <p className="text-2xl font-bold mt-3">{orderDetails.price}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/orders"
                            className="inline-block px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all uppercase tracking-wider"
                        >
                            Track Your Order
                        </Link>
                        <Link
                            href="/exclusive"
                            className="inline-block px-8 py-3 text-sm font-bold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all uppercase tracking-wider"
                        >
                            Back to Exclusive
                        </Link>
                    </div>
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
                <Link href="/order" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Configuration
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl h-fit"
                    >
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-white/60 text-sm">Model</p>
                                <p className="text-xl font-bold capitalize">{orderDetails.model.replace('-', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Exterior Color</p>
                                <p className="font-medium capitalize">{orderDetails.color.replace('-', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">Interior</p>
                                <p className="font-medium capitalize">{orderDetails.interior}</p>
                            </div>
                            {orderDetails.customizations && (
                                <div>
                                    <p className="text-white/60 text-sm">Customizations</p>
                                    <p className="font-medium">{orderDetails.customizations}</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-medium">Total Amount</p>
                                <p className="text-3xl font-bold">{orderDetails.price}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-white" />
                                <h2 className="text-2xl font-bold">Confirm Order</h2>
                            </div>
                            <button
                                type="button"
                                onClick={fillTestData}
                                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors border border-white/20"
                            >
                                ⚡️ Auto-Fill
                            </button>
                        </div>

                        {/* Delivery Address (Optional) */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-4">Delivery Address (Optional)</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={deliveryAddress.street}
                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                                    placeholder="Street Address (Optional)"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={deliveryAddress.city}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                        placeholder="City (Optional)"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        value={deliveryAddress.state}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                                        placeholder="State/Province (Optional)"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={deliveryAddress.zipCode}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                                        placeholder="ZIP/Postal Code (Optional)"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        value={deliveryAddress.country}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                                        placeholder="Country (Optional)"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mock Payment Notice */}
                        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                            <p className="text-sm text-white/70 text-center">
                                🎭 <strong>Mock Payment Mode</strong> - No actual payment required
                            </p>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                        >
                            {loading ? "Processing Order..." : `Confirm Order - ${orderDetails.price}`}
                        </button>

                        <p className="text-xs text-white/40 text-center mt-4">
                            🔒 This is a demonstration - No payment will be charged
                        </p>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
