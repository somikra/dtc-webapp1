import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

export default function Footer() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [isPrivacyPopupOpen, setIsPrivacyPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [challengeContext, setChallengeContext] = useState('');

  const toggleContactPopup = () => setIsContactPopupOpen(!isContactPopupOpen);
  const togglePrivacyPopup = () => setIsPrivacyPopupOpen(!isPrivacyPopupOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;

    emailjs
      .sendForm(
        'service_fvu9lrj', // Replace with your EmailJS Service ID
        'template_gf406x8', // Replace with your EmailJS Template ID
        form
      )
      .then(
        (result) => {
          toast.success('Thanks! We’ll reach out soon to kickstart your DTC journey.', {
            style: {
              background: '#10B981',
              color: '#fff',
              fontFamily: 'Poppins, sans-serif',
            },
          });
          setIsContactPopupOpen(false);
          form.reset();
          setChallenge('');
          setChallengeContext('');
        },
        (error) => {
          toast.error('Oops! Something went wrong. Please try again.', {
            style: {
              background: '#EF4444',
              color: '#fff',
              fontFamily: 'Poppins, sans-serif',
            },
          });
          console.error('EmailJS error:', error);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-10 w-10 text-yellow-300" />
              <div className="ml-3">
                <span className="text-2xl font-extrabold text-white">SOMIKRA</span>
                <p className="text-xs font-medium text-gray-300">Forge Your DTC Empire</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Arming DTC renegades with cutting-edge tools, killer strategies, and insider know-how to dominate the game.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline"
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <button
                  onClick={toggleContactPopup}
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline w-full text-left"
                >
                  Talk to an Expert
                </button>
              </li>
              <li>
                <button
                  onClick={togglePrivacyPopup}
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline w-full text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-6">
              <a
                href="https://x.com"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:scale-110"
              >
                <X className="h-8 w-8" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:scale-110"
              >
                <Linkedin className="h-8 w-8" />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:scale-110"
              >
                <Instagram className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} SOMIKRA. All rights reserved.</p>
        </div>
      </div>

      {/* Contact Popup */}
      {isContactPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            <button
              onClick={toggleContactPopup}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-3xl font-extrabold text-white mb-4 text-center font-poppins">
              Unleash Your DTC Potential
            </h3>
            <p className="text-gray-100 text-center mb-6 font-poppins">
              Drop your details, and our DTC gurus will hit you up with a free, no-BS consult.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 !text-gray-900"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="business-name"
                  placeholder="Your Business Name (optional)"
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>
              <div>
                <select
                  name="challenge"
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  required
                >
                  <option value="" disabled>
                    What’s Your Biggest Challenge?
                  </option>
                  <option value="launching">Launching My Store</option>
                  <option value="sales">Boosting Sales</option>
                  <option value="marketing">Nailing Marketing</option>
                  <option value="seo">Fixing SEO</option>
                  <option value="other">Something Else</option>
                </select>
              </div>
              {challenge === 'other' && (
                <div>
                  <textarea
                    name="challenge-context"
                    value={challengeContext}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setChallengeContext(e.target.value);
                      }
                    }}
                    placeholder="Please provide more context (max 500 characters)"
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-200 mt-1">
                    {challengeContext.length}/500 characters
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-poppins ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Let’s Crush It Together'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Policy Popup */}
      {isPrivacyPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl transform transition-all duration-300 scale-100 max-h-[80vh] overflow-y-auto">
            <button
              onClick={togglePrivacyPopup}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-3xl font-extrabold text-white mb-4 text-center font-poppins">
              Privacy Policy
            </h3>
            <div className="text-gray-300 font-poppins text-sm space-y-4">
              <p>
                <strong>Effective Date:</strong> March 24, 2025
              </p>
              <p>
                SOMIKRA ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our webapp, tools, and digital marketing services tailored for Direct-to-Consumer (DTC) entrepreneurs. By accessing or using our services, you agree to this policy.
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">1. Information We Collect</h4>
              <p>
                We collect personal and non-personal information to provide tools like Sales Dashboard, Sales Forecasting, and SEO Analysis, as well as digital marketing services and blog content:
                <ul className="list-disc pl-5">
                  <li><strong>Personal Data:</strong> Name, email address, business name, and any additional details you provide via our "Talk to an Expert" form or feedback submissions.</li>
                  <li><strong>Business Data:</strong> Sales data you upload for analysis, website URLs for SEO feedback, and related metrics.</li>
                  <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and interaction with our tools and blogs, collected via cookies and analytics.</li>
                </ul>
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">2. How We Use Your Information</h4>
              <p>
                We use your data to:
                <ul className="list-disc pl-5">
                  <li>Provide and improve our services, including sales insights, forecasting, and SEO feedback.</li>
                  <li>Respond to inquiries and offer personalized consultations.</li>
                  <li>Analyze usage trends to enhance our webapp and develop new tools.</li>
                  <li>Send marketing communications (with your consent where required).</li>
                </ul>
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">3. Data Sharing and Disclosure</h4>
              <p>
                We do not sell your personal data. We may share it with:
                <ul className="list-disc pl-5">
                  <li><strong>Service Providers:</strong> Third-party tools like EmailJS for form submissions and analytics providers, bound by confidentiality agreements.</li>
                  <li><strong>Legal Compliance:</strong> If required by law or to protect our rights, safety, or property.</li>
                </ul>
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">4. Data Security</h4>
              <p>
                We implement reasonable security measures to protect your data, but no system is 100% secure. You use our services at your own risk.
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">5. Your Rights</h4>
              <p>
                Depending on your location (e.g., GDPR for EU, CCPA for California), you may have rights to access, correct, delete, or restrict your data. Contact us at support@somikra.com to exercise these rights.
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">6. International Users</h4>
              <p>
                Our services are hosted in the United States. By using our webapp, you consent to the transfer of your data to the U.S., subject to applicable data protection laws.
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">7. Disclaimers</h4>
              <p>
                <ul className="list-disc pl-5">
                  <li>Our tools (e.g., Sales Dashboard, SEO Analysis) provide insights based on data you upload or we collect. We are not liable for inaccuracies in your data or decisions made based on our outputs.</li>
                  <li>Digital marketing services and blog content are for informational purposes only and do not constitute legal, financial, or professional advice.</li>
                  <li>We are not responsible for third-party websites linked from our blogs or tools.</li>
                </ul>
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">8. Changes to This Policy</h4>
              <p>
                We may update this policy as our services evolve. Check back regularly for the latest version.
              </p>
              <h4 className="text-lg font-semibold text-yellow-300">9. Contact Us</h4>
              <p>
                Questions? Reach out at support@somikra.com.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}