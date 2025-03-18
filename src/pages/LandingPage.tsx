import React, { useState } from 'react';
import { ArrowRight, Rocket, BarChart, Zap, Award, ShoppingBag, Users, X, TrendingUp, Search, DollarSign, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic here to handle form submission (e.g., send to an API)
    alert('Thanks! We’ll reach out soon to kickstart your DTC journey.');
    setIsPopupOpen(false);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Launch Your DTC Empire <span className="text-yellow-300">Today</span>
              </h1>
              <p className="mt-6 text-xl text-gray-100 leading-relaxed">
                Overwhelmed by starting an online store? We’ve got your back with badass tools, killer marketing, and insider know-how to skyrocket your sales.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-400 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Kickstart Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Free Tools Await
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/dtc-ecommerce-dashboard-preview.jpg"
                alt="DTC Ecommerce Dashboard Preview"
                className="rounded-xl shadow-2xl transform hover:rotate-3 hover:scale-105 transition-all duration-500"
              />
              <div className="absolute -top-4 -right-4 bg-yellow-300 text-gray-900 font-bold px-4 py-2 rounded-full animate-pulse">
                Boost Your Sales Today!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-yellow-300">Your Secret Weapon for DTC Domination</h2>
            <p className="mt-4 text-xl text-gray-300">
              Stop guessing. Start winning with tools and strategies built for DTC hustlers.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-colors duration-300">
              <Rocket className="h-12 w-12 text-yellow-300 mb-6" />
              <h3 className="text-2xl font-bold text-white">Launch Like a Pro</h3>
              <p className="mt-4 text-gray-300">
                Skip the rookie mistakes. Our playbook gets your store live and selling in record time.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-colors duration-300">
              <BarChart className="h-12 w-12 text-yellow-300 mb-6" />
              <h3 className="text-2xl font-bold text-white">Master Your Numbers</h3>
              <p className="mt-4 text-gray-300">
                Sales dashboards and forecasts that turn data into dollars—no PhD required.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-colors duration-300">
              <Zap className="h-12 w-12 text-yellow-300 mb-6" />
              <h3 className="text-2xl font-bold text-white">Market Like a Beast</h3>
              <p className="mt-4 text-gray-300">
                SEO audits, ad hacks, and automation to flood your store with buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tools Promotion (Updated to match ToolsPage) */}
      <section className="py-16 bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  Steal Our <span className="text-orange-500">Free Tools</span> Now
                </h2>
                <p className="text-xl text-gray-700 mb-6 font-medium">
                  No catch. Unlock a powerhouse of tools that top DTC brands rely on to dominate the game!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Link to="/tools-dashboard" className="relative group bg-gradient-to-br from-gray-100 to-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <BarChart className="h-10 w-10 text-orange-500 mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">Sales Dashboard</h4>
                    <p className="text-sm text-gray-600">Dive into actionable sales data and trends.</p>
                  </Link>
                  <Link to="/sales-forecasting" className="relative group bg-gradient-to-br from-gray-100 to-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <TrendingUp className="h-10 w-10 text-orange-500 mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">Sales Forecasting</h4>
                    <p className="text-sm text-gray-600">Predict your future wins with precision.</p>
                  </Link>
                  <Link to="/seo-analysis" className="relative group bg-gradient-to-br from-gray-100 to-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <Search className="h-10 w-10 text-orange-500 mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">SEO Analysis</h4>
                    <p className="text-sm text-gray-600">Optimize your store for search dominance.</p>
                  </Link>
                  <Link to="/pricing-optimizer" className="relative group bg-gradient-to-br from-gray-100 to-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <DollarSign className="h-10 w-10 text-orange-500 mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">AI Pricing Optimizer</h4>
                    <p className="text-sm text-gray-600">Maximize profits with smart pricing.</p>
                  </Link>
                  <Link to="/email-campaign" className="relative group bg-gradient-to-br from-gray-100 to-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <Mail className="h-10 w-10 text-orange-500 mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">AI Email Campaign</h4>
                    <p className="text-sm text-gray-600">Engage customers with killer emails.</p>
                  </Link>
                </div>
                <Link
                  to="/tools"
                  className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full hover:from-orange-600 hover:to-purple-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg font-bold"
                >
                  Grab Free Tools Now
                  <ArrowRight className="ml-2 h-6 w-6 animate-pulse" />
                </Link>
              </div>
              <div className="flex-1 flex justify-center">
                <img
                  src="/sales-analytics-dashboard-preview.jpg"
                  alt="Sales Analytics Dashboard Preview"
                  className="rounded-lg shadow-xl max-w-md transform hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">Real Sellers, Real Wins</h2>
            <p className="mt-4 text-xl text-gray-600">
              We don’t use fake reviews—be the first to share your success story with our tools!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <p className="text-gray-700 font-medium leading-relaxed text-xl">
                No stories yet—because we’re just getting started! Be the pioneer and let the world know how our tools transformed your DTC game. <br /><br />
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-400 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mt-4"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-orange-500 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Stop Dreaming. Start Selling.
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Your DTC breakthrough is one click away. Join the rebels crushing it online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-400 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Launch Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button
              onClick={togglePopup}
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get a Free Consult
            </button>
          </div>
        </div>
      </section>

      {/* Popup Form */}
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
    </div>
  );
}