"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { logo_path } from "@/lib/media.config"

interface LogoProps {
  size?: "small" | "large"
  className?: string
  animate?: boolean
}

export function Logo({ size = "large", className = "", animate = true }: LogoProps) {
  const dimensions = size === "large" ? { width: 200, height: 200 } : { width: 60, height: 60 }

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  }

  const LogoComponent = (
    <Image
      src={logo_path || "/placeholder.svg"}
      alt="Uplift Kolektiv Logo"
      width={dimensions.width}
      height={dimensions.height}
      className={`object-contain ${className}`}
      priority
    />
  )

  if (!animate) {
    return LogoComponent
  }

  return (
    <motion.div
      variants={logoVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-center justify-center"
    >
      {LogoComponent}
    </motion.div>
  )
}

export default Logo
