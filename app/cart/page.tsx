"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart/CartContext"

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart()
    const router = useRouter()

    const handleCheckout = () => {
        if (items.length === 0) return

        // Store cart items for payment
        sessionStorage.setItem('cartItems', JSON.stringify(items))
        router.push('/payment')
    }

    return (
        <main
            className="min-h-screen !bg-black text-white p-6 md:p-12 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="w-8 h-8" />
                    <h1 className="text-4xl font-bold uppercase tracking-wider">Your Cart</h1>
                    <span className="text-white/60">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                </div>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-12 rounded-2xl text-center"
                    >
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/40" />
                        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-white/60 mb-6">Add some incredible Koenigsegg models to get started</p>
                        <Link
                            href="/#models"
                            className="inline-block px-8 py-3 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all uppercase tracking-wider"
                        >
                            Browse Models
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items */}
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-6 flex items-center justify-between ${index !== items.length - 1 ? 'border-b border-white/10' : ''
                                        }`}
                                >
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-1">{item.model}</h3>
                                        <p className="text-white/60">Koenigsegg {item.model}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 bg-black/40 rounded-lg p-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right min-w-[120px]">
                                            <p className="text-2xl font-bold">{item.price}</p>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Clear Cart
                                </button>
                                <div className="text-right">
                                    <p className="text-sm text-white/60 mb-1">Total Items</p>
                                    <p className="text-3xl font-bold">{totalItems}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02]"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
