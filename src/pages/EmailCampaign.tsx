import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, LogOut, BarChart2, TrendingUp, Search, DollarSign, X,
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

export default function EmailCampaign() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [challengeContext, setChallengeContext] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/tools');
  };

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

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
          setIsPopupOpen(false);
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
    <div className="bg-gray-900 min-h-screen text-white font-poppins relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-center text-white">
            Email Campaigns for <span className="text-yellow-300">DTC Growth</span> <Mail className="inline h-8 w-8" />
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Engage your audience with powerful email strategies built for e-commerce success.
          </p>
        </div>
      </header>

      {/* Navigation - Launch Pad */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full">
              <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Launch Pad
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <a href="/tools-dashboard" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <BarChart2 className="w-4 h-4 mr-2" /> Sales Dashboard
                </a>
                <a href="/sales-forecasting" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <TrendingUp className="w-4 h-4 mr-2" /> Sales Forecasting
                </a>
                <a href="/seo-analysis" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <Search className="w-4 h-4 mr-2" /> SEO Analysis
                </a>
                <a href="/pricing-optimizer" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <DollarSign className="w-4 h-4 mr-2" /> Pricing Optimizer
                </a>
                <a href="/email-campaign" className="group relative px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <Mail className="w-4 h-4 mr-2" /> Email Campaign
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Hot</span>
                </a>
              </div>
            </div>
            <button onClick={handleSignOut} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-xl shadow-lg hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 flex items-center text-sm font-semibold transform hover:scale-105 flex-shrink-0">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Work in Progress */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Email Campaign <span className="text-yellow-300">Coming Soon</span>
          </h2>
          <div className="relative flex justify-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full animate-pulse opacity-50 absolute"></div>
            <svg className="w-24 h-24 text-yellow-300 animate-spin-slow relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            We’re crafting an email tool to supercharge your DTC outreach! Stay tuned for campaigns that convert and grow your e-commerce empire.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/tools" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full font-semibold hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 flex items-center">
              Explore Other Tools <TrendingUp className="h-5 w-5 ml-2" />
            </a>
            <button onClick={togglePopup} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full font-semibold hover:from-purple-700 hover:to-orange-600 transition-all duration-300 flex items-center">
              Connect with Us <Mail className="h-5 w-5 ml-2" />
            </button>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            <p>Building the future of DTC growth, one pixel at a time.</p>
          </div>
        </div>
      </main>

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
                className={`w-full px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Let’s Crush It Together'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom CSS
const styles = `
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .card-tilt:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 255, 0, 0.2); }
  .animate-spin-slow { animation: spin 3s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);