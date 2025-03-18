import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50); // Trigger shrink after 50px scroll
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks! We’ll reach out soon to kickstart your DTC journey.');
    setIsPopupOpen(false);
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
              <ShoppingBag
                className={`h-${isShrunk ? '6' : '8'} w-${isShrunk ? '6' : '8'} text-yellow-300 group-hover:text-yellow-400 transition-all duration-300`}
              />
              <div className={`ml-${isShrunk ? '2' : '4'}`}>
                <span
                  className={`text-${isShrunk ? 'xl' : '3xl'} font-extrabold text-white tracking-wide group-hover:text-yellow-300 transition-all duration-300`}
                >
                  SOMIKRA
                </span>
                <p
                  className={`text-${isShrunk ? 'xs' : 'sm'} font-medium text-gray-100 group-hover:text-yellow-400 transition-all duration-300`}
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
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md`}
            >
              Services
            </Link>
            <Link
              to="/tools"
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md`}
            >
              Tools
            </Link>
            <Link
              to="/blog"
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md`}
            >
              Blog
            </Link>
            <button
              onClick={togglePopup}
              className={`text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-md`}
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
                className={`block px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300`}
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/tools"
                className={`block px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300`}
                onClick={() => setIsOpen(false)}
              >
                Tools
              </Link>
              <Link
                to="/blog"
                className={`block px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300`}
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <button
                onClick={() => {
                  togglePopup();
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-${isShrunk ? 'sm' : 'lg'} text-gray-100 hover:text-yellow-300 font-semibold transition-colors duration-300`}
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
    </>
  );
}