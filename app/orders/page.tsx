"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"

interface Order {
    id: string
    user_id: string
    model: string
    color: string
    interior: string
    price: string
    status: string
    delivery_address: string
    created_at: string
    payment_method: string
}

const statusSteps = [
    { id: 'processing', label: 'Order Processing', icon: Clock },
    { id: 'manufacturing', label: 'Manufacturing', icon: Package },
    { id: 'quality_check', label: 'Quality Check', icon: CheckCircle },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: MapPin },
]

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin')
            return
        }

        if (user) {
            fetchOrders()

            // Auto-refresh every 30 seconds to get latest status updates
            const interval = setInterval(() => {
                fetchOrders()
            }, 30000)

            return () => clearInterval(interval)
        }
    }, [user, authLoading, router])

    const fetchOrders = async () => {
        try {
            console.log('🔄 Fetching user orders...')
            // Try Supabase first
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.warn('Supabase error, using localStorage fallback:', error)
                // Fallback to localStorage
                const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
                const userOrders = localOrders.filter((order: Order) => order.user_id === user?.id)
                setOrders(userOrders)
            } else {
                console.log(`✅ Fetched ${data?.length || 0} orders`)
                setOrders(data || [])
            }
        } catch (err) {
            console.error('Error fetching orders, using localStorage:', err)
            // Fallback to localStorage
            const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
            const userOrders = localOrders.filter((order: Order) => order.user_id === user?.id)
            setOrders(userOrders)
        } finally {
            setLoading(false)
        }
    }

    const generateMockOrder = async () => {
        if (!user) return

        const mockOrder = {
            id: crypto.randomUUID(),
            user_id: user.id,
            model: "Jesko Absolut",
            color: "Crystal White",
            interior: "Desiato Black",
            price: "$3,000,000",
            payment_method: "credit",
            delivery_address: "123 Test St, Mock City, MC 12345, Testland",
            status: 'processing',
            created_at: new Date().toISOString()
        }

        try {
            const { error } = await supabase
                .from('orders')
                .insert(mockOrder)

            if (error) {
                console.warn('Supabase error, using localStorage:', error)
                const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
                existingOrders.unshift(mockOrder)
                localStorage.setItem('mock_orders', JSON.stringify(existingOrders))
            }

            fetchOrders()
        } catch (err) {
            console.error('Error, using localStorage:', err)
            const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
            existingOrders.unshift(mockOrder)
            localStorage.setItem('mock_orders', JSON.stringify(existingOrders))
            fetchOrders()
        }
    }

    const getStatusIndex = (status: string) => {
        return statusSteps.findIndex(step => step.id === status)
    }

    if (authLoading || loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading your orders...</p>
                </div>
            </main>
        )
    }

    return (
        <main
            className="min-h-screen !bg-black text-white p-6 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 max-w-6xl mx-auto">
                <Link href="/exclusive" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Exclusive
                </Link>

                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">Your Orders</h1>
                        <p className="text-white/60">Track your Koenigsegg orders</p>
                    </div>
                    <button
                        onClick={generateMockOrder}
                        className="px-4 py-2 text-xs font-bold text-black bg-white/80 hover:bg-white rounded-full transition-all uppercase tracking-wider"
                    >
                        + Mock Order
                    </button>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-12 rounded-2xl text-center"
                    >
                        <Package className="w-16 h-16 mx-auto mb-4 text-white/40" />
                        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                        <p className="text-white/60 mb-6">Start your journey by configuring your dream Koenigsegg</p>
                        <Link
                            href="/configurator"
                            className="inline-block px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all uppercase tracking-wider"
                        >
                            Configure Your Car
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => {
                            const currentStatusIndex = getStatusIndex(order.status)

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-white/10">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-1 capitalize">{order.model.replace('-', ' ')}</h3>
                                            <p className="text-white/60 text-sm">
                                                Order placed: {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-white/60 text-sm">Order ID: {order.id.slice(0, 8)}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 text-left md:text-right">
                                            <p className="text-3xl font-bold">{order.price}</p>
                                            <p className="text-white/60 text-sm capitalize">{order.payment_method} Card</p>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <h4 className="text-sm font-bold uppercase text-white/60 mb-3">Configuration</h4>
                                            <div className="space-y-2">
                                                <p className="text-white/90">
                                                    <span className="text-white/60">Exterior:</span> {order.color.replace('-', ' ')}
                                                </p>
                                                <p className="text-white/90">
                                                    <span className="text-white/60">Interior:</span> {order.interior}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase text-white/60 mb-3">Delivery Address</h4>
                                            <p className="text-white/90 text-sm">{order.delivery_address}</p>
                                        </div>
                                    </div>

                                    {/* Status Timeline */}
                                    <div>
                                        <h4 className="text-sm font-bold uppercase text-white/60 mb-4">Order Status</h4>
                                        <div className="relative">
                                            {/* Progress Line */}
                                            <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10">
                                                <div
                                                    className="h-full bg-white transition-all duration-500"
                                                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                                                />
                                            </div>

                                            {/* Status Steps */}
                                            <div className="relative flex justify-between">
                                                {statusSteps.map((step, stepIndex) => {
                                                    const Icon = step.icon
                                                    const isCompleted = stepIndex <= currentStatusIndex
                                                    const isCurrent = stepIndex === currentStatusIndex

                                                    return (
                                                        <div key={step.id} className="flex flex-col items-center" style={{ width: '20%' }}>
                                                            <div
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                                                                    ? 'bg-white text-black'
                                                                    : 'bg-white/10 text-white/40'
                                                                    } ${isCurrent ? 'ring-4 ring-white/30 scale-110' : ''}`}
                                                            >
                                                                <Icon className="w-6 h-6" />
                                                            </div>
                                                            <p className={`text-xs text-center font-medium ${isCompleted ? 'text-white' : 'text-white/40'
                                                                }`}>
                                                                {step.label}
                                                            </p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estimated Delivery */}
                                    <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                                        <p className="text-sm text-white/60">Estimated Delivery</p>
                                        <p className="text-lg font-bold">
                                            {order.status === 'delivered'
                                                ? 'Delivered'
                                                : '12-18 months from order date'}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
