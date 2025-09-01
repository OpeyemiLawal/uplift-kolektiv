"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { discord_webhook, cloudflare_secret, cloudflare_site_key } from "@/lib/media.config"
import { Send, CheckCircle, AlertCircle, Loader2, CalendarIcon, X, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Artist } from "@/lib/artists"

// Country codes for phone number dropdown
const countryCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+41", country: "Switzerland" },
  { code: "+43", country: "Austria" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" },
  { code: "+48", country: "Poland" },
  { code: "+420", country: "Czech Republic" },
  { code: "+36", country: "Hungary" },
  { code: "+40", country: "Romania" },
  { code: "+421", country: "Slovakia" },
  { code: "+386", country: "Slovenia" },
  { code: "+385", country: "Croatia" },
  { code: "+387", country: "Bosnia" },
  { code: "+382", country: "Montenegro" },
  { code: "+389", country: "North Macedonia" },
  { code: "+381", country: "Serbia" },
  { code: "+355", country: "Albania" },
  { code: "+30", country: "Greece" },
  { code: "+351", country: "Portugal" },
  { code: "+353", country: "Ireland" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "New Zealand" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+66", country: "Thailand" },
  { code: "+84", country: "Vietnam" },
  { code: "+62", country: "Indonesia" },
  { code: "+63", country: "Philippines" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+972", country: "Israel" },
  { code: "+90", country: "Turkey" },
  { code: "+7", country: "Russia" },
  { code: "+380", country: "Ukraine" },
  { code: "+375", country: "Belarus" },
  { code: "+371", country: "Latvia" },
  { code: "+372", country: "Estonia" },
  { code: "+370", country: "Lithuania" },
  { code: "+52", country: "Mexico" },
  { code: "+55", country: "Brazil" },
  { code: "+54", country: "Argentina" },
  { code: "+56", country: "Chile" },
  { code: "+57", country: "Colombia" },
  { code: "+58", country: "Venezuela" },
  { code: "+51", country: "Peru" },
  { code: "+593", country: "Ecuador" },
  { code: "+595", country: "Paraguay" },
  { code: "+598", country: "Uruguay" },
  { code: "+591", country: "Bolivia" },
  { code: "+27", country: "South Africa" },
  { code: "+234", country: "Nigeria" },
  { code: "+254", country: "Kenya" },
  { code: "+20", country: "Egypt" },
  { code: "+212", country: "Morocco" },
  { code: "+216", country: "Tunisia" },
  { code: "+213", country: "Algeria" },
]

interface FormData {
  name: string
  company: string
  eventName: string
  email: string
  phoneCountry: string
  phoneNumber: string
  selectedArtists: Artist[]
  eventDate: Date | undefined
  eventEndDate: Date | undefined
  isMultipleDayEvent: boolean
  country: string
  venue: string
  message: string
  gdprConsent: boolean
  dataAccuracy: boolean
  accommodationTerms: boolean
  bookingFeeTerms: boolean
}

interface FormErrors {
  name?: string
  company?: string
  eventName?: string
  email?: string
  phoneCountry?: string
  phoneNumber?: string
  selectedArtists?: string
  eventDate?: string
  eventEndDate?: string
  country?: string
  venue?: string
  message?: string
  gdprConsent?: string
  dataAccuracy?: string
  accommodationTerms?: string
  bookingFeeTerms?: string
  general?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    eventName: "",
    email: "",
    phoneCountry: "+1",
    phoneNumber: "",
    selectedArtists: [],
    eventDate: undefined,
    eventEndDate: undefined,
    isMultipleDayEvent: false,
    country: "",
    venue: "",
    message: "",
    gdprConsent: false,
    dataAccuracy: false,
    accommodationTerms: false,
    bookingFeeTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [artistSearchOpen, setArtistSearchOpen] = useState(false)
  const [artistSearchValue, setArtistSearchValue] = useState("")

  // Only check for client-side available variables
  const hasIntegrations = cloudflare_site_key // We'll check Discord on form submission
  const hasDiscord = true // We'll verify this on form submission
  const hasTurnstile = !!cloudflare_site_key && isClient

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch artists for autocomplete
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/artists')
        if (response.ok) {
          const artistsData = await response.json()
          setArtists(artistsData)
        }
      } catch (error) {
        console.error('Error fetching artists:', error)
      }
    }
    fetchArtists()
  }, [])

  // Debug logging
  useEffect(() => {
    if (isClient) {
      console.log('🔍 Integration Debug:', {
        cloudflare_site_key: cloudflare_site_key ? 'SET' : 'NOT SET',
        hasDiscord: 'WILL CHECK ON SUBMIT',
        hasTurnstile,
        hasIntegrations,
        isClient
      })
      
      // Log actual values for debugging (be careful with secrets)
      if (cloudflare_site_key) {
        console.log('🔐 Cloudflare site key:', cloudflare_site_key.substring(0, 20) + '...')
      }
    }
  }, [cloudflare_site_key, hasDiscord, hasTurnstile, hasIntegrations, isClient])

  // Initialize Cloudflare Turnstile
  useEffect(() => {
    if (hasTurnstile && cloudflare_site_key && isClient && typeof window !== 'undefined') {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        // Load Turnstile script if not already loaded
        if (!window.turnstile) {
          const script = document.createElement('script')
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
          script.async = true
          script.defer = true
          script.onload = () => {
            // Render the widget after script loads
            if (window.turnstile && typeof cloudflare_site_key === 'string') {
              const container = document.querySelector('.cf-turnstile')
              if (container && !container.querySelector('iframe')) {
                try {
                  window.turnstile.render('.cf-turnstile', {
                    sitekey: cloudflare_site_key,
                    callback: (token: string) => setTurnstileToken(token),
                    'expired-callback': () => setTurnstileToken(null),
                    'error-callback': () => setTurnstileToken(null),
                  })
                } catch (error) {
                  console.error('Turnstile render error:', error)
                }
              }
            }
          }
          document.head.appendChild(script)
        } else if (window.turnstile && typeof cloudflare_site_key === 'string') {
          // Script already loaded, render widget
          const container = document.querySelector('.cf-turnstile')
          if (container && !container.querySelector('iframe')) {
            try {
              window.turnstile.render('.cf-turnstile', {
                sitekey: cloudflare_site_key,
                callback: (token: string) => setTurnstileToken(token),
                'expired-callback': () => setTurnstileToken(null),
                'error-callback': () => setTurnstileToken(null),
              })
            } catch (error) {
              console.error('Turnstile render error:', error)
            }
          }
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [hasTurnstile, cloudflare_site_key, isClient])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Business email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone number validation (optional but if provided, must be valid)
    if (formData.phoneNumber.trim() && !/^\d{7,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    // If artists are selected, make date, country, venue mandatory
    if (formData.selectedArtists.length > 0) {
      if (!formData.eventDate) {
        newErrors.eventDate = "Event date is required when artists are selected"
      }
      if (!formData.country.trim()) {
        newErrors.country = "Country is required when artists are selected"
      }
      if (!formData.venue.trim()) {
        newErrors.venue = "Venue is required when artists are selected"
      }
      if (formData.isMultipleDayEvent && !formData.eventEndDate) {
        newErrors.eventEndDate = "End date is required for multiple day events"
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    // Required checkboxes
    if (!formData.gdprConsent) {
      newErrors.gdprConsent = "GDPR consent is required"
    }
    if (!formData.dataAccuracy) {
      newErrors.dataAccuracy = "Data accuracy confirmation is required"
    }

    // Conditional checkboxes for artists
    if (formData.selectedArtists.length > 0) {
      if (!formData.accommodationTerms) {
        newErrors.accommodationTerms = "Accommodation terms must be accepted when booking artists"
      }
      if (!formData.bookingFeeTerms) {
        newErrors.bookingFeeTerms = "Booking fee terms must be accepted when booking artists"
      }
    }

    // Validate Turnstile if enabled
    if (hasTurnstile && !turnstileToken) {
      newErrors.general = "Please complete the security verification"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleArtistSelect = (artist: Artist) => {
    if (!formData.selectedArtists.find(a => a["artist-tag"] === artist["artist-tag"])) {
      setFormData(prev => ({
        ...prev,
        selectedArtists: [...prev.selectedArtists, artist]
      }))
    }
    setArtistSearchValue("")
    setArtistSearchOpen(false)
  }

  const handleArtistRemove = (artistTag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedArtists: prev.selectedArtists.filter(a => a["artist-tag"] !== artistTag)
    }))
  }

  const handleMultipleDayToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isMultipleDayEvent: checked,
      eventEndDate: checked ? prev.eventEndDate : undefined
    }))
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
        selectedArtists: formData.selectedArtists.map(a => ({ name: a.name, tag: a["artist-tag"] })),
        eventDate: formData.eventDate?.toISOString(),
        eventEndDate: formData.eventEndDate?.toISOString(),
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
        setFormData({
          name: "",
          company: "",
          eventName: "",
          email: "",
          phoneCountry: "+1",
          phoneNumber: "",
          selectedArtists: [],
          eventDate: undefined,
          eventEndDate: undefined,
          isMultipleDayEvent: false,
          country: "",
          venue: "",
          message: "",
          gdprConsent: false,
          dataAccuracy: false,
          accommodationTerms: false,
          bookingFeeTerms: false,
        })
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

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(artistSearchValue.toLowerCase()) ||
    artist["artist-tag"].toLowerCase().includes(artistSearchValue.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto">
      {!hasIntegrations && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 text-amber-200">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p className="text-sm leading-relaxed">
              Contact form integrations are not yet configured. The form will work once Discord webhook and/or
              Cloudflare Turnstile are set up.
            </p>
          </div>
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Name Field */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`h-12 transition-all duration-200 bg-gray-800/50 border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 ${
              errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            }`}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Company Field */}
        <div className="space-y-3">
          <Label htmlFor="company" className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Company *
          </Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className={`h-12 transition-all duration-200 bg-gray-800/50 border-gray-600 focus:border-green-500 focus:ring-green-500/20 ${
              errors.company ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            }`}
            placeholder="Enter your company name"
            disabled={isSubmitting}
          />
          {errors.company && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {errors.company}
            </motion.p>
          )}
        </div>

        {/* Event Name Field */}
        <div className="space-y-3">
          <Label htmlFor="eventName" className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Event Name
            <span className="text-xs text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="eventName"
            type="text"
            value={formData.eventName}
            onChange={(e) => handleInputChange("eventName", e.target.value)}
            className="h-12 transition-all duration-200 bg-gray-800/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
            placeholder="Enter event name (if applicable)"
            disabled={isSubmitting}
          />
        </div>

        {/* Business Email Field */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Business Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`h-12 transition-all duration-200 bg-gray-800/50 border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 ${
              errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            }`}
            placeholder="your.business@company.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Phone Number Field */}
        <div className="space-y-3">
          <Label htmlFor="phone" className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Phone Number
            <span className="text-xs text-gray-400 font-normal">(optional)</span>
          </Label>
          <div className="flex gap-3">
            <Select
              value={formData.phoneCountry}
              onValueChange={(value) => handleInputChange("phoneCountry", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-36 h-12 text-white bg-gray-800/50 border-gray-600 focus:border-teal-500 focus:ring-teal-500/20">
                <SelectValue className="text-white" />
              </SelectTrigger>
              <SelectContent className="text-white bg-gray-800 border-gray-700">
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    {country.code} {country.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className={`flex-1 h-12 transition-all duration-200 bg-gray-800/50 border-gray-600 focus:border-teal-500 focus:ring-teal-500/20 ${
                errors.phoneNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              placeholder="Enter phone number"
              disabled={isSubmitting}
            />
          </div>
          {errors.phoneNumber && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {errors.phoneNumber}
            </motion.p>
          )}
        </div>

        {/* Artist Selection Field */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            Artist(s) of Interest
            <span className="text-xs text-gray-400 font-normal">(optional)</span>
          </Label>
          
          {/* Selected Artists Display */}
          {formData.selectedArtists.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg">
              {formData.selectedArtists.map((artist) => (
                <Badge key={artist["artist-tag"]} variant="secondary" className="bg-pink-500/20 text-pink-200 border-pink-500/30 hover:bg-pink-500/30 transition-colors">
                  <Users size={12} className="mr-1" />
                  {artist.name}
                  <button
                    type="button"
                    onClick={() => handleArtistRemove(artist["artist-tag"])}
                    className="ml-2 hover:text-red-300 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Artist Search */}
          <Popover open={artistSearchOpen} onOpenChange={setArtistSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={artistSearchOpen}
                className="w-full h-12 justify-between text-white bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-pink-500/50 transition-all duration-200"
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-pink-400" />
                  <span>{artistSearchValue || "Search for artists..."}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
              <Command>
                <CommandInput
                  placeholder="Type artist name or tag..."
                  value={artistSearchValue}
                  onValueChange={setArtistSearchValue}
                  className="text-white"
                />
                <CommandList>
                  <CommandEmpty>No artists found.</CommandEmpty>
                  <CommandGroup>
                    {filteredArtists.map((artist) => (
                      <CommandItem
                        key={artist["artist-tag"]}
                        value={artist["artist-tag"]}
                        onSelect={() => handleArtistSelect(artist)}
                        className="text-white hover:bg-gray-700"
                      >
                        <div>
                          <div className="font-medium">{artist.name}</div>
                          <div className="text-sm text-gray-400">@{artist["artist-tag"]}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Conditional Fields - Only show if artists are selected */}
        {formData.selectedArtists.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 p-6 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border border-blue-500/20 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Event Details</h3>
            </div>
            {/* Event Date Field */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Event Date *
              </Label>
              
              {/* Multiple Day Event Checkbox */}
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="multipleDay"
                  checked={formData.isMultipleDayEvent}
                  onCheckedChange={handleMultipleDayToggle}
                  disabled={isSubmitting}
                />
                <Label htmlFor="multipleDay" className="text-sm text-gray-300">
                  Multiple day event
                </Label>
              </div>

              {/* Date Picker(s) */}
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-white border-gray-600 hover:bg-gray-800",
                        !formData.eventDate && "text-gray-400"
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.eventDate ? format(formData.eventDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={formData.eventDate}
                      onSelect={(date) => handleInputChange("eventDate", date)}
                      disabled={(date) => date < new Date()}
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>

                {formData.isMultipleDayEvent && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-white border-gray-600 hover:bg-gray-800",
                          !formData.eventEndDate && "text-gray-400"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.eventEndDate ? format(formData.eventEndDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <Calendar
                        mode="single"
                        selected={formData.eventEndDate}
                        onSelect={(date) => handleInputChange("eventEndDate", date)}
                        disabled={(date) => date < (formData.eventDate || new Date())}
                        className="bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {errors.eventDate && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.eventDate}
                </p>
              )}
              {errors.eventEndDate && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.eventEndDate}
                </p>
              )}
            </div>

            {/* Country Field */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-white">
                Country *
              </Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={`transition-all duration-200 ${errors.country ? "border-destructive focus:border-destructive" : ""}`}
                placeholder="Event country"
                disabled={isSubmitting}
              />
              {errors.country && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.country}
                </p>
              )}
            </div>

            {/* Venue Field */}
            <div className="space-y-2">
              <Label htmlFor="venue" className="text-sm font-medium text-white">
                Venue *
              </Label>
              <Input
                id="venue"
                type="text"
                value={formData.venue}
                onChange={(e) => handleInputChange("venue", e.target.value)}
                className={`transition-all duration-200 ${errors.venue ? "border-destructive focus:border-destructive" : ""}`}
                placeholder="Event venue"
                disabled={isSubmitting}
              />
              {errors.venue && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.venue}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Message Field */}
        <div className="space-y-3">
          <Label htmlFor="message" className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Message *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className={`min-h-40 transition-all duration-200 bg-gray-800/50 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 resize-none ${
              errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            }`}
            placeholder="Tell us about your project, collaboration ideas, or any questions you have..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {errors.message}
            </motion.p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-6 p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Terms & Conditions</h3>
          </div>
          
          {/* Always Required */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <Checkbox
                id="gdpr"
                checked={formData.gdprConsent}
                onCheckedChange={(checked) => handleInputChange("gdprConsent", checked)}
                disabled={isSubmitting}
                className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Label htmlFor="gdpr" className="text-sm text-gray-200 leading-relaxed cursor-pointer">
                I agree that my data will be stored according to <span className="text-green-400 font-medium">GDPR</span> *
              </Label>
            </div>
            {errors.gdprConsent && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 flex items-center gap-2"
              >
                <AlertCircle size={14} />
                {errors.gdprConsent}
              </motion.p>
            )}

            <div className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <Checkbox
                id="dataAccuracy"
                checked={formData.dataAccuracy}
                onCheckedChange={(checked) => handleInputChange("dataAccuracy", checked)}
                disabled={isSubmitting}
                className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Label htmlFor="dataAccuracy" className="text-sm text-gray-200 leading-relaxed cursor-pointer">
                I confirm that all the data I introduced above is <span className="text-green-400 font-medium">correct</span> *
              </Label>
            </div>
            {errors.dataAccuracy && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 flex items-center gap-2"
              >
                <AlertCircle size={14} />
                {errors.dataAccuracy}
              </motion.p>
            )}
          </div>

          {/* Conditional Terms - Only show if artists are selected */}
          {formData.selectedArtists.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Users size={12} className="text-white" />
                </div>
                <h4 className="text-sm font-semibold text-white">Artist Booking Terms</h4>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Checkbox
                  id="accommodation"
                  checked={formData.accommodationTerms}
                  onCheckedChange={(checked) => handleInputChange("accommodationTerms", checked)}
                  disabled={isSubmitting}
                  className="mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor="accommodation" className="text-sm text-gray-200 leading-relaxed cursor-pointer">
                  I understand that as the event organizer I have to cover the artist's <span className="text-blue-400 font-medium">accommodation, transportation and meals</span>, to, from and during the event *
                </Label>
              </div>
              {errors.accommodationTerms && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 flex items-center gap-2"
                >
                  <AlertCircle size={14} />
                  {errors.accommodationTerms}
                </motion.p>
              )}

              <div className="flex items-start space-x-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Checkbox
                  id="bookingFee"
                  checked={formData.bookingFeeTerms}
                  onCheckedChange={(checked) => handleInputChange("bookingFeeTerms", checked)}
                  disabled={isSubmitting}
                  className="mt-1 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label htmlFor="bookingFee" className="text-sm text-gray-200 leading-relaxed cursor-pointer">
                  I understand that a <span className="text-purple-400 font-medium">booking fee will be charged that is 15%</span> of the artist fee *
                </Label>
              </div>
              {errors.bookingFeeTerms && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 flex items-center gap-2"
                >
                  <AlertCircle size={14} />
                  {errors.bookingFeeTerms}
                </motion.p>
              )}
            </div>
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

        {/* Submit Button */}
        <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-70 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin" />
                <span>Submitting...</span>
            </div>
          ) : (
              <div className="flex items-center gap-3">
                <Send size={20} />
                <span>Submit</span>
            </div>
          )}
        </Button>
        </div>
      </motion.form>
    </div>
  )
}
