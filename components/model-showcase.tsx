"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, ArrowRight, Palette } from "lucide-react"

interface CarModel {
    id: string
    name: string
    tagline: string
    price: string
    specs: {
        hp: string
        topSpeed: string
        acceleration: string
    }
    description: string
    news: string
    colors: { name: string; class: string; restrictedRims?: string[] }[]
    rims: string[]
    images?: { [key: string]: string }
    category: "current" | "legacy"
}

const models: CarModel[] = [
    {
        id: "jesko",
        name: "Jesko Absolut",
        tagline: "The Fastest Koenigsegg Ever",
        price: "$3,000,000+",
        specs: { hp: "1600 hp", topSpeed: "330+ mph", acceleration: "2.5s" },
        description: "The Jesko Absolut is designed for top speed. Every surface element is constructed to reduce drag or surrounding turbulence while increasing high-speed stability.",
        news: "Jesko Absolut breaks new top speed record in simulation testing.",
        colors: [
            { name: "Black", class: "bg-black" },
            { name: "Red", class: "bg-red-700" },
            { name: "Carbon Fiber", class: "bg-neutral-900" },
            { name: "White", class: "bg-white" }
        ],
        rims: ["Silver Multi-Spoke Alloy", "Carbon Fiber 5-Spoke"],
        images: {
            "Black-Silver Multi-Spoke Alloy": "/jesko_black_silver.png",
            "Black-Carbon Fiber 5-Spoke": "/jesko_black_carbon.png",
            "Red-Silver Multi-Spoke Alloy": "/jesko_red_silver.png",
            "Red-Carbon Fiber 5-Spoke": "/jesko_red_carbon.png",
            "Carbon Fiber-Silver Multi-Spoke Alloy": "/Gemini_Generated_Image_9nq1vd9nq1vd9nq1.png",
            "White-Silver Multi-Spoke Alloy": "/Gemini_Generated_Image_j3qkp0j3qkp0j3qk.png",
            "Carbon Fiber-Carbon Fiber 5-Spoke": "/Gemini_Generated_Image_r4yz9yr4yz9yr4yz.png",
            "White-Carbon Fiber 5-Spoke": "/Gemini_Generated_Image_w60qnfw60qnfw60q.png"
        },
        category: "current"
    },
    {
        id: "gemera",
        name: "Gemera",
        tagline: "The World's First Mega-GT",
        price: "$1,700,000+",
        specs: { hp: "2300 hp", topSpeed: "248 mph", acceleration: "1.9s" },
        description: "The Gemera is the world's first Mega-GT and Koenigsegg's first four-seater. Extreme performance meets spacious interior.",
        news: "Gemera production version unveiled with optional V8 engine upgrade.",
        colors: [
            { name: "Launch Grey", class: "bg-gray-500" },
            { name: "Midnight Blue", class: "bg-blue-900" },
            { name: "Crystal White", class: "bg-white" },
            { name: "Carbon Black", class: "bg-black" }
        ],
        rims: ["Aircore Carbon", "Forged Aluminum"],
        images: {
            "Launch Grey-Aircore Carbon": "/gemera_silver.png",
            "Launch Grey-Forged Aluminum": "/gemera_silver.png",
            "Midnight Blue-Aircore Carbon": "/gemera_silver.png",
            "Midnight Blue-Forged Aluminum": "/gemera_silver.png",
            "Crystal White-Aircore Carbon": "/gemera_silver.png",
            "Crystal White-Forged Aluminum": "/gemera_silver.png",
            "Carbon Black-Aircore Carbon": "/gemera_silver.png",
            "Carbon Black-Forged Aluminum": "/gemera_silver.png"
        },
        category: "current"
    },
    {
        id: "cc850",
        name: "CC850",
        tagline: "The Reimagined Classic",
        price: "$3,650,000",
        specs: { hp: "1385 hp", topSpeed: "Unknown", acceleration: "2.7s" },
        description: "A tribute to the CC8S, the CC850 features the revolutionary ESS (Engage Shift System) allowing both manual and automatic shifting.",
        news: "All 70 units of CC850 sold out instantly upon announcement.",
        colors: [
            { name: "Crystal White", class: "bg-white" },
            { name: "Silver", class: "bg-gray-300" },
            { name: "Orange", class: "bg-orange-500" }
        ],
        rims: ["Telephone Dial", "Carbon 5-Spoke"],
        images: {
            "Crystal White-Telephone Dial": "/cc850_silver.png",
            "Crystal White-Carbon 5-Spoke": "/cc850_silver.png",
            "Silver-Telephone Dial": "/cc850_silver.png",
            "Silver-Carbon 5-Spoke": "/cc850_silver.png",
            "Orange-Telephone Dial": "/cc850_silver.png",
            "Orange-Carbon 5-Spoke": "/cc850_silver.png"
        },
        category: "current"
    },
    {
        id: "agera-rs",
        name: "Agera RS",
        tagline: "The Record Breaker",
        price: "Legacy",
        specs: { hp: "1160 hp", topSpeed: "277.87 mph", acceleration: "2.8s" },
        description: "The Agera RS was the world's fastest production car, setting a record of 277.87 mph in 2017.",
        news: "Agera RS record stands for years as a benchmark of engineering.",
        colors: [
            { name: "Red", class: "bg-red-700" },
            { name: "Black", class: "bg-black" },
            { name: "White", class: "bg-white" },
            { name: "Carbon Fiber", class: "bg-neutral-900", restrictedRims: ["Standard Alloy"] }
        ],
        rims: ["Standard Alloy", "Carbon Fiber"],
        images: {
            "Black-Standard Alloy": "/Gemini_Generated_Image_3ivcd53ivcd53ivc.png",
            "Black-Carbon Fiber": "/Gemini_Generated_Image_783i5y783i5y783i.png",
            "White-Carbon Fiber": "/Gemini_Generated_Image_9nq1vd9nq1vd9nq1.png",
            "Red-Carbon Fiber": "/Gemini_Generated_Image_j3qkp0j3qkp0j3qk.png",
            "White-Standard Alloy": "/Gemini_Generated_Image_r4yz9yr4yz9yr4yz.png",
            "Red-Standard Alloy": "/Gemini_Generated_Image_w60qnfw60qnfw60q.png",
            "Carbon Fiber-Carbon Fiber": "/Gemini_Generated_Image_x8pyuex8pyuex8py.png"
        },
        category: "legacy"
    },
    {
        id: "one1",
        name: "One:1",
        tagline: "The World's First Megacar",
        price: "Legacy",
        specs: { hp: "1360 hp", topSpeed: "273 mph", acceleration: "2.8s" },
        description: "The One:1 was named for its 1:1 hp-to-kg curb weight ratio. It was the first homologated production car with one Megawatt of power.",
        news: "One:1 remains one of the most exclusive hypercars in history.",
        colors: [
            { name: "Silver", class: "bg-gray-300" },
            { name: "Carbon Fiber", class: "bg-neutral-900" },
            { name: "White", class: "bg-white" }
        ],
        rims: ["Standard Alloy", "Carbon Fiber"],
        images: {
            "Silver-Standard Alloy": "/one1_silver.png",
            "Silver-Carbon Fiber": "/one1_silver.png",
            "Carbon Fiber-Standard Alloy": "/one1_silver.png",
            "Carbon Fiber-Carbon Fiber": "/one1_silver.png",
            "White-Standard Alloy": "/one1_silver.png",
            "White-Carbon Fiber": "/one1_silver.png"
        },
        category: "legacy"
    }
]

export function ModelShowcase() {
    const [selectedCategory, setSelectedCategory] = useState<"current" | "legacy">("current")
    const [selectedModel, setSelectedModel] = useState<CarModel>(models[0])
    const [selectedRim, setSelectedRim] = useState(models[0].rims[0])
    const [selectedColor, setSelectedColor] = useState(models[0].colors[0])

    // Ensure selected color is valid when rim changes
    const availableColors = selectedModel.colors.filter(
        (color) => !color.restrictedRims?.includes(selectedRim)
    )

    if (!availableColors.find(c => c.name === selectedColor.name)) {
        setSelectedColor(availableColors[0])
    }

    const filteredModels = models.filter(m => m.category === selectedCategory)

    return (
        <section id="models" className="min-h-screen bg-black text-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold uppercase tracking-tighter"
                    >
                        Model Range
                    </motion.h2>

                    <div className="flex gap-4 mt-4 md:mt-0">
                        <button
                            onClick={() => setSelectedCategory("current")}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all ${selectedCategory === "current" ? "bg-white text-black" : "bg-neutral-900 text-gray-400 hover:bg-neutral-800"}`}
                        >
                            Current
                        </button>
                        <button
                            onClick={() => setSelectedCategory("legacy")}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all ${selectedCategory === "legacy" ? "bg-white text-black" : "bg-neutral-900 text-gray-400 hover:bg-neutral-800"}`}
                        >
                            Legacy
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Model List */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {filteredModels.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => {
                                    setSelectedModel(model)
                                    setSelectedColor(model.colors[0])
                                    setSelectedRim(model.rims[0])
                                }}
                                className={`text-left p-6 rounded-xl transition-all border ${selectedModel.id === model.id
                                    ? "bg-white text-black border-white"
                                    : "bg-neutral-900 text-gray-400 border-neutral-800 hover:bg-neutral-800"
                                    }`}
                            >
                                <h3 className="text-2xl font-bold uppercase">{model.name}</h3>
                                <p className={`text-sm mt-1 ${selectedModel.id === model.id ? "text-gray-600" : "text-gray-500"}`}>
                                    {model.tagline}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Model Details */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedModel.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className={`relative rounded-3xl overflow-hidden border border-white/10 min-h-[600px] flex flex-col bg-neutral-900/50 backdrop-blur-xl`}
                            >
                                {/* Image Section */}
                                <div className="relative h-[300px] md:h-[400px] w-full bg-gradient-to-b from-white/5 to-transparent p-8 flex items-center justify-center overflow-hidden">
                                    {/* Dynamic Background Glow */}
                                    <div className={`absolute inset-0 opacity-20 transition-colors duration-500 ${selectedColor.class}`} />

                                    {selectedModel.images && selectedModel.images[`${selectedColor.name}-${selectedRim}`] ? (
                                        <motion.img
                                            key={`${selectedColor.name}-${selectedRim}`}
                                            initial={{ opacity: 0, scale: 1.1, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            src={selectedModel.images[`${selectedColor.name}-${selectedRim}`]}
                                            alt={`${selectedModel.name} - ${selectedColor.name} with ${selectedRim}`}
                                            className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white/20 font-bold uppercase tracking-widest">
                                            Image Not Available
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-6 md:p-8 lg:p-12 flex flex-col justify-between bg-black/40">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
                                        <div>
                                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-2">
                                                {selectedModel.name}
                                            </h3>
                                            <p className="text-base md:text-xl text-white/80">{selectedModel.tagline}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-xs md:text-sm text-white/60 uppercase tracking-wider">Starting at</p>
                                            <p className="text-xl md:text-2xl font-bold">{selectedModel.price}</p>
                                        </div>
                                    </div>

                                    {/* Customization Options */}
                                    <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
                                        {/* Color Picker */}
                                        <div>
                                            <p className="text-xs text-white/60 uppercase mb-3">Select Finish</p>
                                            <div className="flex items-center gap-3 md:gap-4 bg-black/20 p-3 md:p-4 rounded-xl w-fit backdrop-blur-sm border border-white/5">
                                                <Palette className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
                                                <div className="flex flex-wrap gap-2">
                                                    {availableColors.map((color) => (
                                                        <button
                                                            key={color.name}
                                                            onClick={() => setSelectedColor(color)}
                                                            className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all ${color.class} ${selectedColor.name === color.name ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent hover:scale-105"}`}
                                                            aria-label={`Select ${color.name}`}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rim Selector */}
                                        <div>
                                            <p className="text-xs text-white/60 uppercase mb-3">Select Rims</p>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedModel.rims.map((rim) => (
                                                    <button
                                                        key={rim}
                                                        onClick={() => setSelectedRim(rim)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedRim === rim
                                                            ? "bg-white text-black border-white"
                                                            : "bg-black/30 text-white/70 border-white/10 hover:bg-black/50"
                                                            }`}
                                                    >
                                                        {rim}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-3 gap-4 mb-12">
                                        <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                            <p className="text-xs text-white/60 uppercase">Power</p>
                                            <p className="text-2xl md:text-3xl font-bold">{selectedModel.specs.hp}</p>
                                        </div>
                                        <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                            <p className="text-xs text-white/60 uppercase">0-60 mph</p>
                                            <p className="text-2xl md:text-3xl font-bold">{selectedModel.specs.acceleration}</p>
                                        </div>
                                        <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                            <p className="text-xs text-white/60 uppercase">Top Speed</p>
                                            <p className="text-2xl md:text-3xl font-bold">{selectedModel.specs.topSpeed}</p>
                                        </div>
                                    </div>

                                    <p className="text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
                                        {selectedModel.description}
                                    </p>

                                    {/* News / Footer */}
                                    <div className="mt-auto pt-8 border-t border-white/10">
                                        <div className="flex items-start gap-3 bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/5">
                                            <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold uppercase text-blue-400 mb-1">Latest News</p>
                                                <p className="text-sm text-white/90">{selectedModel.news}</p>
                                            </div>
                                            <button className="ml-auto text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                                Read <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
