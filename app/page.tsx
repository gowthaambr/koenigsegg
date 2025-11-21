import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ImmersiveExperience } from "@/components/immersive-experience"
import { ModelShowcase } from "@/components/model-showcase"
import { Dealers } from "@/components/dealers"
import { Footer } from "@/components/footer"

export default function Home() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />
            <Hero />
            <ImmersiveExperience />
            <ModelShowcase />
            <Dealers />
            <Footer />
        </main>
    )
}
