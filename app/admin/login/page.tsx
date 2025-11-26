"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, ArrowLeft, Shield, Fingerprint } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [biometricAvailable, setBiometricAvailable] = useState(false)
    const [biometricRegistered, setBiometricRegistered] = useState(false)

    const { signIn } = useAuth()
    const router = useRouter()

    // Hardcoded admin credentials - Works without Supabase
    const ADMIN_EMAIL = "admin@koenigsegg.com"
    const ADMIN_PASSWORD = "Admin@123"

    // Check if biometric authentication is available
    useEffect(() => {
        if (typeof window !== 'undefined' && window.PublicKeyCredential) {
            setBiometricAvailable(true)
            // Check if fingerprint is already registered
            const registered = localStorage.getItem('admin_biometric_registered')
            if (registered === 'true') {
                setBiometricRegistered(true)
            }
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Check hardcoded admin credentials first
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Store admin session in localStorage
                localStorage.setItem('admin_session', JSON.stringify({
                    email: ADMIN_EMAIL,
                    isAdmin: true,
                    loginTime: new Date().toISOString()
                }))

                // Redirect to admin dashboard
                router.push('/admin')
                return
            }

            // If not hardcoded admin, try Supabase authentication
            if (email !== ADMIN_EMAIL) {
                setError("Access denied. This email is not authorized for admin access.")
                setLoading(false)
                return
            }

            // Try Supabase sign in for admin email with different password
            const { error: signInError } = await signIn(email, password)

            if (signInError) {
                setError("Invalid credentials. Please check your email and password.")
                setLoading(false)
                return
            }

            // Redirect to admin dashboard
            router.push('/admin')
        } catch (err) {
            setError("Invalid credentials. Please try again.")
            setLoading(false)
        }
    }

    const registerFingerprint = async () => {
        if (!biometricAvailable) {
            setError("Biometric authentication is not available on this device.")
            return
        }

        try {
            setLoading(true)
            setError(null)

            // Create credential options
            const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
                challenge: new Uint8Array(32), // In production, get this from server
                rp: {
                    name: "Koenigsegg Admin",
                    id: window.location.hostname,
                },
                user: {
                    id: new Uint8Array(16),
                    name: ADMIN_EMAIL,
                    displayName: "Admin",
                },
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" },  // ES256
                    { alg: -257, type: "public-key" } // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required",
                },
                timeout: 60000,
                attestation: "direct"
            }

            // Create credential
            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            }) as PublicKeyCredential

            if (credential) {
                // Store credential ID
                localStorage.setItem('admin_biometric_registered', 'true')
                localStorage.setItem('admin_credential_id', credential.id)
                setBiometricRegistered(true)
                setError(null)
                alert("✅ Fingerprint registered successfully! You can now use biometric login.")
            }
        } catch (err: any) {
            console.error('Biometric registration error:', err)
            if (err.name === 'NotAllowedError') {
                setError("Biometric registration was cancelled.")
            } else if (err.name === 'NotSupportedError') {
                setError("Biometric authentication is not supported on this device.")
            } else {
                setError("Failed to register fingerprint. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const loginWithFingerprint = async () => {
        if (!biometricRegistered) {
            setError("Please register your fingerprint first.")
            return
        }

        try {
            setLoading(true)
            setError(null)

            const credentialId = localStorage.getItem('admin_credential_id')
            if (!credentialId) {
                setError("No fingerprint registered. Please register first.")
                setLoading(false)
                return
            }

            // Get credential options
            const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
                challenge: new Uint8Array(32), // In production, get this from server
                allowCredentials: [{
                    id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
                    type: 'public-key',
                    transports: ['internal']
                }],
                timeout: 60000,
                userVerification: "required"
            }

            // Get credential
            const assertion = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            }) as PublicKeyCredential

            if (assertion) {
                // Store admin session
                localStorage.setItem('admin_session', JSON.stringify({
                    email: ADMIN_EMAIL,
                    isAdmin: true,
                    loginTime: new Date().toISOString(),
                    method: 'biometric'
                }))

                // Redirect to admin dashboard
                router.push('/admin')
            }
        } catch (err: any) {
            console.error('Biometric login error:', err)
            if (err.name === 'NotAllowedError') {
                setError("Biometric authentication was cancelled.")
            } else {
                setError("Biometric authentication failed. Please try password login.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main
            className="min-h-screen !bg-black text-white flex items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
        >
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-black" />

            <div className="relative z-10 w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Admin Access</h1>
                        <p className="text-white/60 text-sm">Authorized personnel only</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Biometric Login Option */}
                    {biometricAvailable && (
                        <div className="mb-6">
                            {biometricRegistered ? (
                                <button
                                    onClick={loginWithFingerprint}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold uppercase tracking-widest py-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02]"
                                >
                                    <Fingerprint className="w-6 h-6" />
                                    {loading ? "Authenticating..." : "Login with Fingerprint"}
                                </button>
                            ) : (
                                <button
                                    onClick={registerFingerprint}
                                    disabled={loading}
                                    className="w-full bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    <Fingerprint className="w-6 h-6" />
                                    {loading ? "Registering..." : "Register Fingerprint"}
                                </button>
                            )}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-neutral-900 px-2 text-white/40">Or use password</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold uppercase text-white/70 ml-1">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="admin@koenigsegg.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-bold uppercase text-white/70 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                        >
                            {loading ? "Verifying..." : "Access Dashboard"}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-xs text-white/60 text-center">
                            <Lock className="w-3 h-3 inline mr-1" />
                            This area is restricted to authorized administrators only.
                        </p>
                    </div>

                    {/* Help */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-white/40">
                            Need help? Contact{" "}
                            <a href="mailto:support@koenigsegg.com" className="text-white/60 hover:text-white underline">
                                support@koenigsegg.com
                            </a>
                        </p>
                    </div>
                </motion.div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-white/40">
                        🔒 All login attempts are monitored and logged
                    </p>
                </div>
            </div>
        </main>
    )
}
