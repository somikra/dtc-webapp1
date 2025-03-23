import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;

    emailjs
      .sendForm(
        'service_fvu9lrj', // Replace with your EmailJS Service ID (e.g., service_abc123)
        'template_gf406x8', // Replace with your EmailJS Template ID (e.g., template_xyz789)
        form,
        'qnMj05dkiYsPCPYZEo8Kv' // Your Public Key from the screenshot
      )
      .then(
        (result) => {
          alert('Thanks! We’ll reach out soon to kickstart your DTC journey.');
          setIsPopupOpen(false);
          form.reset();
        },
        (error) => {
          alert('Oops! Something went wrong. Please try again.');
          console.error('EmailJS error:', error);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <nav
        className={`bg-gradient-to-r from-orange-500/80 to-purple-600/80 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out fixed top-0 left-0 w-full z-50 ${
          isShrunk ? 'h-16 py-2' : 'h-20 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex justify-between items-center h-full">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              {/* SVG Rocket Icon */}
              <svg
                className={`h-${isShrunk ? '14' : '20'} w-${isShrunk ? '14' : '20'} transition-all duration-300 group-hover:brightness-125 self-start mt-1`}
                viewBox="0 0 150 150"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                    <feOffset dx="0" dy="0" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.7" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Rocket Shape with Glow */}
                <path
                  d="M75 15 L90 60 L75 90 L60 60 Z"
                  fill="url(#grad1)"
                  stroke="#FDE047"
                  strokeWidth="5"
                  filter="url(#glow)"
                />
                <circle cx="75" cy="37.5" r="7.5" fill="#FDE047" filter="url(#glow)" />

                {/* Flames with Animation */}
                <path
                  d="M75 90 L67.5 112.5 L75 120 L82.5 112.5 Z"
                  fill="#F97316"
                  filter="url(#glow)"
                >
                  <animate
                    attributeName="d"
                    values="
                      M75 90 L67.5 112.5 L75 120 L82.5 112.5 Z;
                      M75 90 L65 115 L75 125 L85 115 Z;
                      M75 90 L67.5 112.5 L75 120 L82.5 112.5 Z"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Sparkles with Animation */}
                <path
                  d="M97.5 22.5 L99 25.5 L102 26.25 L99 27 L97.5 30 L96 27 L93 26.25 L96 25.5 Z"
                  fill="#FDE047"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
                <path
                  d="M52.5 30 L54 33 L57 33.75 L54 34.5 L52.5 37.5 L51 34.5 L48 33.75 L51 33 Z"
                  fill="#FDE047"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;1;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>

              {/* Text (Separate from SVG) */}
              <div className={`ml-${isShrunk ? '3' : '4'}`}>
                <span
                  className={`text-${isShrunk ? 'xl' : '3xl'} font-extrabold tracking-wide text-white group-hover:scale-105 group-hover:text-yellow-400 transition-all duration-300 font-montserrat drop-shadow-xl`}
                >
                  SOMIKRA
                </span>
                <p
                  className={`text-${isShrunk ? 'xs' : 'sm'} font-medium text-white group-hover:scale-105 transition-all duration-300 font-montserrat drop-shadow-md`}
                >
                  Forge Your DTC Empire
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/services"
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md font-montserrat`}
            >
              Services
            </Link>
            <Link
              to="/tools"
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md font-montserrat`}
            >
              Tools
            </Link>
            <Link
              to="/blog"
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md font-montserrat`}
            >
              Blog
            </Link>
            <button
              onClick={togglePopup}
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md font-montserrat`}
            >
              Talk to an Expert
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-100 hover:text-yellow-300 transition-colors duration-300"
            >
              {isShrunk ? (
                isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />
              ) : isOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-r from-orange-500/80 to-purple-600/80 backdrop-blur-md border-t border-gray-700">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link
                to="/services"
                className={`block px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300 font-montserrat`}
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/tools"
                className={`block px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300 font-montserrat`}
                onClick={() => setIsOpen(false)}
              >
                Tools
              </Link>
              <Link
                to="/blog"
                className={`block px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300 font-montserrat`}
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <button
                onClick={() => {
                  togglePopup();
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300 font-montserrat`}
              >
                Talk to an Expert
              </button>
            </div>
          </div>
        )}
      </nav>

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
            <h3 className="text-3xl font-extrabold text-white mb-4 text-center font-montserrat">
              Unleash Your DTC Potential
            </h3>
            <p className="text-gray-100 text-center mb-6 font-montserrat">
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
                  className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
                disabled={isSubmitting}
                className={`w-full px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-montserrat ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Let’s Crush It Together'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}