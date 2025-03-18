import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjusted path

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            Welcome to Your <span className="text-yellow-300">DTC Growth Hub</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Unlock the power of AI to grow your direct-to-consumer business with our suite of tools.
          </p>
          <div className="mt-10 flex justify-center">
            {user ? (
              <Link
                to="/tools-dashboard"
                className="px-8 py-4 bg-yellow-300 text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/tools"
                className="px-8 py-4 bg-yellow-300 text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Explore Tools
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Insights</h3>
            <p className="text-gray-400">Leverage artificial intelligence to gain actionable insights for your business.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <h3 className="text-xl font-semibold text-white mb-3">Easy Integration</h3>
            <p className="text-gray-400">Seamlessly integrate our tools with your existing workflows.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <h3 className="text-xl font-semibold text-white mb-3">Grow Faster</h3>
            <p className="text-gray-400">Scale your DTC business with data-driven decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}