"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { discord_webhook, cloudflare_secret, cloudflare_site_key } from "@/lib/media.config"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
  general?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])



  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }



    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('🚀 Form submission started')
    console.log('📋 Form data:', formData)
    console.log('🔐 Turnstile token:', turnstileToken ? 'SET' : 'NOT SET')
    console.log('📧 Has Discord:', hasDiscord)

    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrors({}) // Clear previous errors

    try {
      console.log('📤 Sending to Discord webhook...')
      
      const payload = {
        ...formData,
        turnstileToken: hasTurnstile ? turnstileToken : null,
      }
      
      console.log('📦 Payload:', payload)
      
      // Submit to Discord webhook
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

        console.log('📡 API Response status:', response.status)
        const result = await response.json()
        console.log('📡 API Response body:', result)

        if (!response.ok) {
          // Handle specific error messages from the API
          const errorMessage = result.error || "Failed to send message"
          console.log('❌ API Error:', errorMessage)
          if (result.details) {
            console.log('🔍 Error details:', result.details)
          }
          throw new Error(errorMessage)
        }

        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
        setTurnstileToken(null) // Reset Turnstile token
        
        // Reset Turnstile widget if it exists
        if (window.turnstile && hasTurnstile) {
          const container = document.querySelector('.cf-turnstile')
          if (container) {
            window.turnstile.reset('.cf-turnstile')
          }
        }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
      setErrors({ general: error instanceof Error ? error.message : "Failed to send message. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!hasIntegrations && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
        >
          <div className="flex items-center gap-2 text-gray-300">
            <AlertCircle size={16} />
            <p className="text-sm">
              Contact form integrations are not yet configured. The form will work once Discord webhook and/or
              Cloudflare Turnstile are set up.
            </p>
          </div>
        </motion.div>
      )}

      {isClient && hasIntegrations && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-green-900/20 border border-green-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-300">
            <CheckCircle size={16} />
            <p className="text-sm">
              {hasDiscord && hasTurnstile && "Discord webhook and Cloudflare Turnstile are configured and active."}
              {hasDiscord && !hasTurnstile && "Discord webhook is configured and active."}
              {!hasDiscord && hasTurnstile && "Cloudflare Turnstile is configured and active."}
            </p>
          </div>
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-white">
            Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`transition-all duration-200 ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
            placeholder="Your full name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`transition-all duration-200 ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-white">
            Message *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className={`min-h-32 transition-all duration-200 ${errors.message ? "border-destructive focus:border-destructive" : ""}`}
            placeholder="Tell us about your project, collaboration ideas, or any questions you have..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.message}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile Widget */}
        {isClient && hasTurnstile && cloudflare_site_key && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">
              Security Verification *
            </Label>
            <div className="cf-turnstile" />
            {!turnstileToken && hasTurnstile && (
              <p className="text-sm text-gray-400">
                Please complete the security verification above
              </p>
            )}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>
                {errors.general === "Captcha verification failed" 
                  ? "❌ Security verification failed. Please complete the captcha and try again."
                  : errors.general === "All fields are required"
                  ? "❌ Please fill in all required fields."
                  : errors.general === "Invalid email format"
                  ? "❌ Please enter a valid email address."
                  : errors.general === "Please complete the security verification"
                  ? "❌ Please complete the security verification above."
                  : `❌ ${errors.general}`
                }
              </span>
            </p>
          </div>
        )}

        {/* Submission Status */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg"
          >
            <p className="text-sm text-blue-400 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Sending message to Discord webhook...
            </p>
          </motion.div>
        )}

        {/* Success Message */}
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg"
          >
            <p className="text-sm text-green-400 flex items-center gap-2">
              <CheckCircle size={16} />
              ✅ Message sent successfully to Discord! We'll get back to you soon.
            </p>
          </motion.div>
        )}

        {/* Test Turnstile Button (for debugging) */}
        {hasTurnstile && turnstileToken && (
          <Button
            type="button"
            onClick={async () => {
              console.log("🧪 Testing Turnstile token...")
              try {
                const response = await fetch("/api/test-turnstile", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token: turnstileToken })
                })
                const result = await response.json()
                console.log("🧪 Turnstile test result:", result)
              } catch (error) {
                console.error("🧪 Turnstile test error:", error)
              }
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            🧪 Test Turnstile Token
          </Button>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Sending to Discord...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send size={16} />
              Send to Discord
            </div>
          )}
        </Button>
      </motion.form>
    </div>
  )
}
