import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Users, Headphones } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { COLORS, ICON_SIZES } from '../utils/constants';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Let's Start a
            <span className="block" style={{ color: COLORS.secondary }}>Conversation</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Whether you're ready to join the Chappi network, have questions about our platform, 
            or want to explore partnership opportunities, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 md:py-16 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLORS.text.primary }}>
              Choose How You'd Like to Connect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: <MessageCircle className={ICON_SIZES.large} />,
                title: 'WhatsApp Support',
                description: 'Get instant help and quick answers',
                contact: '+234 800 CHAPPI',
                action: 'Chat Now',
                color: COLORS.accent
              },
              {
                icon: <Mail className={ICON_SIZES.large} />,
                title: 'Email Support',
                description: 'Detailed inquiries and documentation',
                contact: 'hello@chappi.com',
                action: 'Send Email',
                color: COLORS.primary
              },
              {
                icon: <Phone className={ICON_SIZES.large} />,
                title: 'Business Line',
                description: 'Enterprise and partnership discussions',
                contact: '+234 1 CHAPPI-BIZ',
                action: 'Call Now',
                color: COLORS.secondary
              }
            ].map((option, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                style={{ backgroundColor: COLORS.background.light, border: `1px solid ${COLORS.neutral}20` }}
              >
                <div className="mb-4 md:mb-6 flex justify-center" style={{ color: option.color }}>
                  {option.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: COLORS.text.primary }}>
                  {option.title}
                </h3>
                <p className="text-sm md:text-base mb-4 leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {option.description}
                </p>
                <p className="font-semibold mb-4" style={{ color: option.color }}>
                  {option.contact}
                </p>
                <Button variant="primary" className="w-full">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Get Detailed Support
                </h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Use the form to send us a detailed message, and we'll get back to you within 24 hours. 
                  For urgent matters, please use our WhatsApp or phone support.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <Clock className={ICON_SIZES.large} />,
                    title: 'Response Time',
                    content: 'Within 24 hours',
                    description: 'We respond to all inquiries promptly'
                  },
                  {
                    icon: <Users className={ICON_SIZES.large} />,
                    title: 'Dedicated Support',
                    content: 'Expert team ready to help',
                    description: 'Specialized support for different user types'
                  },
                  {
                    icon: <Headphones className={ICON_SIZES.large} />,
                    title: 'Multi-language',
                    content: 'English, French, Arabic',
                    description: 'Support in major African languages'
                  },
                  {
                    icon: <MapPin className={ICON_SIZES.large} />,
                    title: 'Local Presence',
                    content: 'Offices across Africa',
                    description: 'Lagos, Nairobi, Accra, and more'
                  }
                ].map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.secondary}20` }}>
                      <div style={{ color: COLORS.secondary }}>
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {info.title}
                      </h4>
                      <p className="font-medium mb-1" style={{ color: COLORS.secondary }}>
                        {info.content}
                      </p>
                      <p className="text-sm text-blue-200">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-lg p-6 md:p-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-white mb-2">
                    I'm interested in: *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 min-h-[44px]"
                  >
                    <option value="general">General Information</option>
                    <option value="consumer">Joining as Consumer</option>
                    <option value="retailer">Becoming a Retail Partner</option>
                    <option value="brand">Brand Partnership</option>
                    <option value="support">Technical Support</option>
                    <option value="press">Press & Media</option>
                    <option value="careers">Career Opportunities</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 min-h-[44px]"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 min-h-[44px]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 min-h-[44px]"
                    placeholder="Your company name (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-yellow-400 resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" variant="secondary" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: COLORS.background.light }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-6" style={{ color: COLORS.text.primary }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How do I get started with Chappi?",
                answer: "Getting started is easy! Simply download our app or join via WhatsApp, complete your profile, and start browsing available missions in your area."
              },
              {
                question: "What countries does Chappi operate in?",
                answer: "We currently operate across 54 African countries, with active missions and retail partners in major cities and growing rural coverage."
              },
              {
                question: "How do brands partner with Chappi?",
                answer: "Brands can partner with us through our enterprise program. Contact our business team to discuss campaign objectives, target audiences, and partnership terms."
              },
              {
                question: "Is there a cost to join Chappi?",
                answer: "Joining Chappi as a consumer is completely free. Retailers and brands have different partnership models - contact us for detailed pricing information."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-md"
                style={{ backgroundColor: COLORS.background.light, border: `1px solid ${COLORS.neutral}20` }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: COLORS.text.primary }}>
                  {faq.question}
                </h3>
                <p className="leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};