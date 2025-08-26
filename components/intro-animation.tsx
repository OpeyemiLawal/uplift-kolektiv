"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "./logo"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-complete after 3 seconds
    const timer = setTimeout(() => {
      handleComplete()
    }, 3000)

    // Handle scroll or click to complete early
    const handleInteraction = () => {
      handleComplete()
    }

    window.addEventListener("scroll", handleInteraction)
    window.addEventListener("click", handleInteraction)
    window.addEventListener("keydown", handleInteraction)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleInteraction)
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
    }
  }, [])

  const handleComplete = () => {
    if (isVisible) {
      setIsVisible(false)
      setTimeout(() => {
        onComplete()
      }, 800) // Wait for exit animation
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-muted to-background backdrop-blur-sm"
          onClick={handleComplete}
        >
          {/* Blurred background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 backdrop-blur-3xl" />

          <div className="relative z-10 text-center">
            {/* Large centered logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="w-48 h-48 mx-auto">
                <Logo className="w-full h-full text-primary" />
              </div>
            </motion.div>

            {/* Motto */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-md mx-auto"
            >
              <p className="text-xl font-medium text-foreground/80 leading-relaxed">
                United by sound, lifted by the rhythm
              </p>
            </motion.div>

            {/* Subtle interaction hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 1.5 }}
              className="mt-12"
            >
              <p className="text-sm text-muted-foreground">Click anywhere or scroll to continue</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
