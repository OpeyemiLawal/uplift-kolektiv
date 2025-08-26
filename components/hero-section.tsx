"use client"

import { motion } from "framer-motion"
import { hero_path, hero_type } from "@/lib/media.config"

interface HeroSectionProps {
  onExplore: () => void
}

export function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Media */}
      {hero_type === "video" ? (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={hero_path} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hero_path})` }}
        />
      )}

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Uplift Kolektiv</h1>

          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Where music transcends boundaries and rhythm unites souls. Experience the collective energy that lifts us
            all.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
