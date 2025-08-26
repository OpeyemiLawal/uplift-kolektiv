"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import { social_links } from "@/lib/media.config"
import { Instagram, Music, Youtube, Users, ImageIcon, Mic, Mail } from "lucide-react"

const navigationItems = [
  { href: "/about", label: "Who are we?", icon: Users },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/artists", label: "Artists", icon: Mic },
  { href: "/contact", label: "Contact Us", icon: Mail },
]

interface SidebarProps {
  isVisible: boolean
}

export function Sidebar({ isVisible }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: isVisible ? 0 : -300,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-80 z-40 flex flex-col bg-gradient-to-b from-gray-900 to-black shadow-2xl border-r border-gray-700/50 rounded-r-3xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-black/95"></div>

      {/* Header with Logo */}
      <div className="relative z-10 p-8 border-b border-gray-700/30">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center text-center"
        >
          <Link href="/" className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 mb-6 transition-all duration-300 group-hover:scale-110 relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-all duration-300"></div>
              <Logo className="w-full h-full text-blue-500 relative z-10" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3 transition-all duration-300 group-hover:text-blue-400 group-hover:scale-105">
              Uplift Kolektiv
            </h2>
          </Link>
          <p className="text-sm text-gray-300 leading-relaxed font-light italic">
            United by sound, lifted by the rhythm
          </p>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 py-8">
        <ul className="space-y-3 px-6">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            return (
              <motion.li
                key={item.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
                    ${
                      isActive
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105"
                        : "text-gray-300 hover:text-white hover:bg-blue-500/20 hover:scale-102"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl"></div>
                  )}
                  <IconComponent
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-300 rounded-full shadow-sm shadow-blue-300/50"></div>
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Footer with Social Links */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative z-10 p-6 border-t border-gray-700/30"
      >
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-6 font-light">Connect with us</p>
          <div className="flex justify-center space-x-4">
            <a
              href={social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-gray-800/50 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Instagram size={20} />
            </a>
            <a
              href={social_links.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-gray-800/50 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Music size={20} />
            </a>
            <a
              href={social_links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-gray-800/50 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </motion.footer>
    </motion.aside>
  )
}
