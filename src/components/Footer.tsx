import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks! We’ll reach out soon to kickstart your DTC journey.');
    setIsPopupOpen(false);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
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
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline"
                >
                  Documentation
                </a>
              </li>
              <li>
                <button
                  onClick={togglePopup}
                  className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:underline w-full text-left"
                >
                  Talk to an Expert
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:scale-110"
              >
                <Twitter className="h-8 w-8" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-300 transition-colors duration-300 hover:scale-110"
              >
                <Linkedin className="h-8 w-8" />
              </a>
              <a
                href="#"
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
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            <button
              onClick={togglePopup}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-3xl font-extrabold text-white mb-4 text-center">
              Unleash Your DTC Potential
            </h3>
            <p className="text-gray-100 text-center mb-6">
              Drop your details, and our DTC gurus will hit you up with a free, no-BS consult.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your Business Name (optional)"
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>
              <div>
                <select
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  required
                >
                  <option value="" disabled selected>
                    What’s Your Biggest Challenge?
                  </option>
                  <option value="launching">Launching My Store</option>
                  <option value="sales">Boosting Sales</option>
                  <option value="marketing">Nailing Marketing</option>
                  <option value="seo">Fixing SEO</option>
                  <option value="other">Something Else</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Let’s Crush It Together
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}