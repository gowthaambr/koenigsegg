import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
}

export const metadata: Metadata = {
    title: "Koenigsegg | The Ultimate Performance",
    description: "Experience the world of Koenigsegg. Megacars, technology, and innovation.",
    keywords: ["Koenigsegg", "Megacar", "Hypercar", "Jesko", "Gemera", "CC850", "Performance", "Luxury"],
    authors: [{ name: "Koenigsegg Automotive AB" }],
    openGraph: {
        title: "Koenigsegg | The Ultimate Performance",
        description: "Experience the world of Koenigsegg. Megacars, technology, and innovation.",
        type: "website",
        locale: "en_US",
        siteName: "Koenigsegg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
                {children}
            </body>
        </html>
    );
}
