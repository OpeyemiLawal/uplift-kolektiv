"use client"

import { MainLayout } from "@/components/main-layout"
import { ContactForm } from "@/components/contact-form"
import { Mail, MessageCircle, Users } from "lucide-react"

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Get In Touch</h1>
            <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
              Ready to collaborate, book a performance, or just want to connect? We'd love to hear from you. Drop us a
              message and let's create something amazing together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Let's Connect</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Users className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Collaborations</h3>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Interested in working with our artists or joining the collective? Let's discuss opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <MessageCircle className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Bookings</h3>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Want to book our artists for your event? Share your event details and we'll get back to you.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Mail className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">General Inquiries</h3>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Have questions about our music, upcoming events, or just want to say hello? We're all ears.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-blue-500/5 via-blue-500/5 to-blue-500/5 rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-white mb-2">Join Our Community</h3>
                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                  Follow us on social media to stay updated with our latest releases, events, and behind-the-scenes
                  content.
                </p>
                <div className="text-sm text-blue-500 font-medium">United by sound, lifted by the rhythm</div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
