"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function TestDatabaseConnection() {
    const [status, setStatus] = useState<string>("Testing...")
    const [orders, setOrders] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        testConnection()
    }, [])

    const testConnection = async () => {
        const supabase = createClient()

        try {
            // Test 1: Check if we can connect to Supabase
            setStatus("🔄 Testing Supabase connection...")

            // Test 2: Try to fetch orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            if (ordersError) {
                setError(`❌ Orders table error: ${ordersError.message}`)
                setStatus("Failed to connect to orders table")
                return
            }

            setStatus(`✅ Connected! Found ${ordersData?.length || 0} orders`)
            setOrders(ordersData || [])

            // Test 3: Try to fetch profiles
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*')

            if (profilesError) {
                console.warn('Profiles table error:', profilesError)
            } else {
                console.log(`✅ Found ${profilesData?.length || 0} profiles`)
            }

        } catch (err: any) {
            setError(`❌ Connection error: ${err.message}`)
            setStatus("Failed to connect")
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

                <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl mb-6">
                    <h2 className="text-xl font-bold mb-4">Status</h2>
                    <p className="text-lg">{status}</p>
                    {error && (
                        <p className="text-red-400 mt-2">{error}</p>
                    )}
                </div>

                {orders.length > 0 && (
                    <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Orders in Database</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-black/40 p-4 rounded-lg border border-white/10">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-white/60">Order ID:</span>
                                            <p className="font-mono">{order.id.slice(0, 8)}...</p>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Model:</span>
                                            <p>{order.model}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Price:</span>
                                            <p className="font-bold">{order.price}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Status:</span>
                                            <p className="capitalize">{order.status}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Date:</span>
                                            <p>{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Payment:</span>
                                            <p className="capitalize">{order.payment_method}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-400">
                        ℹ️ This page tests the connection between your app and Supabase database.
                        The admin page uses the same connection to display orders.
                    </p>
                </div>
            </div>
        </div>
    )
}
