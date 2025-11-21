"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-neutral-950 text-white pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <h3 className="text-2xl font-bold uppercase tracking-widest mb-6">Koenigsegg</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Koenigsegg Automotive AB is a Swedish manufacturer of high-performance sports cars, based in Ängelholm, Skåne County, Sweden.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Models Column */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">Models</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Jesko Absolut</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Jesko Attack</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Gemera</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">CC850</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Regera</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Agera RS</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Press & Media</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Factory Tours</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-lg font-bold uppercase mb-6">Contact</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-white/50 mt-1" />
                                <span>Koenigsegg Automotive AB<br />Kelliehousevägen 73<br />262 74 Ängelholm, Sweden</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-white/50" />
                                <span>+46 431 45 44 60</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-white/50" />
                                <span>info@koenigsegg.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Koenigsegg Automotive AB. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
