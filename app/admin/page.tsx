"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
    Package,
    CreditCard,
    User,
    Calendar,
    MapPin,
    DollarSign,
    Filter,
    Search,
    Download,
    Eye,
    LogOut
} from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"
import { createClient } from "@/lib/supabase/client"

interface Order {
    id: string
    user_id: string
    model: string
    color: string
    interior: string
    customizations: string | null
    price: string
    payment_method: string
    delivery_address: string
    status: string
    created_at: string
    card_last_four?: string
    card_holder_name?: string
    card_type?: string
    user_email?: string
    user_name?: string
}

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    // Admin email - Change this to your admin email
    const ADMIN_EMAIL = "admin@koenigsegg.com" // TODO: Change to your admin email

    useEffect(() => {
        // Check for hardcoded admin session first
        const adminSession = localStorage.getItem('admin_session')
        if (adminSession) {
            try {
                const session = JSON.parse(adminSession)
                if (session.isAdmin && session.email === ADMIN_EMAIL) {
                    setIsAdmin(true)
                    fetchAllOrders()
                    return
                }
            } catch (e) {
                console.error('Invalid admin session')
            }
        }

        // Otherwise check Supabase authentication
        if (!authLoading && !user) {
            router.push('/admin/login')
            return
        }

        if (user) {
            // Check if user is admin
            if (user.email === ADMIN_EMAIL) {
                setIsAdmin(true)
                fetchAllOrders()
            } else {
                setIsAdmin(false)
                setLoading(false)
            }
        }
    }, [user, authLoading, router])

    const fetchAllOrders = async () => {
        console.log('🔄 Fetching orders from Supabase...')
        try {
            // Try to fetch from Supabase orders table
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            if (ordersError) {
                console.warn('❌ Supabase orders error:', ordersError)
                throw ordersError
            }

            console.log(`✅ Fetched ${ordersData?.length || 0} orders from Supabase`)

            if (!ordersData || ordersData.length === 0) {
                console.log('📭 No orders in Supabase, checking localStorage...')
                const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
                setOrders(localOrders)
                setFilteredOrders(localOrders)
                setLoading(false)
                return
            }

            // Fetch user details from profiles table and auth
            const ordersWithUserData = await Promise.all(
                ordersData.map(async (order) => {
                    try {
                        // Try to get user email from profiles table first
                        const { data: profileData } = await supabase
                            .from('profiles')
                            .select('full_name')
                            .eq('id', order.user_id)
                            .single()

                        // Try to get email from auth.users (requires service role key)
                        let userEmail = 'Unknown'
                        try {
                            const { data: { user: authUser } } = await supabase.auth.admin.getUserById(order.user_id)
                            userEmail = authUser?.email || 'Unknown'
                        } catch (authError) {
                            console.warn('Could not fetch auth user:', authError)
                            // Fallback: extract from user_id if it looks like an email
                            userEmail = order.user_id.includes('@') ? order.user_id : 'Unknown'
                        }

                        return {
                            ...order,
                            user_email: userEmail,
                            user_name: profileData?.full_name || 'Unknown'
                        }
                    } catch (err) {
                        console.warn(`Error fetching user data for order ${order.id}:`, err)
                        return {
                            ...order,
                            user_email: 'Unknown',
                            user_name: 'Unknown'
                        }
                    }
                })
            )

            console.log('✅ Orders with user data:', ordersWithUserData.length)
            setOrders(ordersWithUserData)
            setFilteredOrders(ordersWithUserData)

        } catch (err) {
            console.error('❌ Error fetching from Supabase:', err)
            console.log('🔄 Falling back to localStorage...')

            // Fallback to localStorage
            const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
            console.log(`📦 Found ${localOrders.length} orders in localStorage`)
            setOrders(localOrders)
            setFilteredOrders(localOrders)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let filtered = orders

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter)
        }

        setFilteredOrders(filtered)
    }, [searchTerm, statusFilter, orders])

    const exportToCSV = () => {
        const headers = ['Order ID', 'User Email', 'Model', 'Color', 'Interior', 'Price', 'Payment Method', 'Card Type', 'Status', 'Date']
        const rows = filteredOrders.map(order => [
            order.id,
            order.user_email || 'N/A',
            order.model,
            order.color,
            order.interior,
            order.price,
            order.payment_method,
            order.card_type || 'N/A',
            order.status,
            new Date(order.created_at).toLocaleDateString()
        ])

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `koenigsegg-orders-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'manufacturing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            case 'quality_check': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'shipping': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    if (authLoading || loading) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Loading admin panel...</p>
                </div>
            </main>
        )
    }

    if (!isAdmin) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🚫</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                    <p className="text-white/60 mb-6">You don't have permission to access the admin panel.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Go to Homepage
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">Admin Dashboard</h1>
                            <p className="text-white/60">Manage all Koenigsegg orders</p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('admin_session')
                                router.push('/')
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Exit Admin
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
                            <Package className="w-8 h-8 mb-2 text-blue-400" />
                            <p className="text-2xl font-bold">{orders.length}</p>
                            <p className="text-white/60 text-sm">Total Orders</p>
                        </div>
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
                            <DollarSign className="w-8 h-8 mb-2 text-green-400" />
                            <p className="text-2xl font-bold">
                                ${orders.reduce((sum, o) => sum + parseFloat(o.price.replace(/[$,]/g, '')), 0).toLocaleString()}
                            </p>
                            <p className="text-white/60 text-sm">Total Revenue</p>
                        </div>
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
                            <User className="w-8 h-8 mb-2 text-purple-400" />
                            <p className="text-2xl font-bold">{new Set(orders.map(o => o.user_id)).size}</p>
                            <p className="text-white/60 text-sm">Unique Customers</p>
                        </div>
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
                            <CreditCard className="w-8 h-8 mb-2 text-yellow-400" />
                            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</p>
                            <p className="text-white/60 text-sm">Pending Orders</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by order ID, model, or email..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                        >
                            <option value="all">All Status</option>
                            <option value="processing">Processing</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="quality_check">Quality Check</option>
                            <option value="shipping">Shipping</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/40 border-b border-white/10">
                                <tr>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Order ID</th>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Customer</th>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Model</th>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Price</th>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Payment</th>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Status</th>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Date</th>
                                    <th className="text-left p-4 font-bold uppercase text-xs text-white/70">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4">
                                            <p className="font-mono text-sm text-white/80">{order.id.slice(0, 8)}...</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm">{order.user_email || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium">{order.model}</p>
                                            <p className="text-xs text-white/60">{order.color}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold">{order.price}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm capitalize">{order.payment_method.replace('_', ' ')}</p>
                                            {order.card_type && (
                                                <p className="text-xs text-white/60">{order.card_type} •••• {order.card_last_four}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {order.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-white/80">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
                            <p className="text-white/60">No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setSelectedOrder(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6">Order Details</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Order ID</p>
                                    <p className="font-mono text-sm">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Customer Email</p>
                                    <p className="text-sm">{selectedOrder.user_email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Model</p>
                                    <p className="font-medium">{selectedOrder.model}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Price</p>
                                    <p className="font-bold text-xl">{selectedOrder.price}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Exterior Color</p>
                                    <p>{selectedOrder.color}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Interior</p>
                                    <p>{selectedOrder.interior}</p>
                                </div>
                            </div>

                            {selectedOrder.customizations && (
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Customizations</p>
                                    <p>{selectedOrder.customizations}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-white/60 text-sm mb-1">Delivery Address</p>
                                <p>{selectedOrder.delivery_address}</p>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h3 className="font-bold mb-3">Payment Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-white/60 text-sm mb-1">Payment Method</p>
                                        <p className="capitalize">{selectedOrder.payment_method.replace('_', ' ')}</p>
                                    </div>
                                    {selectedOrder.card_type && (
                                        <>
                                            <div>
                                                <p className="text-white/60 text-sm mb-1">Card Type</p>
                                                <p>{selectedOrder.card_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm mb-1">Card Number</p>
                                                <p>•••• •••• •••• {selectedOrder.card_last_four}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-sm mb-1">Cardholder</p>
                                                <p>{selectedOrder.card_holder_name}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-white/60 text-sm mb-1">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm mb-1">Order Date</p>
                                        <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="w-full mt-6 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </main>
    )
}
