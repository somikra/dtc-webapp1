import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Loader2, LogOut } from 'lucide-react';

interface SEOData {
  url: string;
}

interface SEOResult {
  report?: string;
  error?: string;
}

export default function SEOAnalysis() {
  const { user, supabase, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SEOResult | null>(null);
  const [seoData, setSeoData] = useState<SEOData>({ url: '' });

  const handleSEOAnalysis = async () => {
    if (!seoData.url) {
      setResult({ error: 'Please enter a valid website URL.' });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await mockApiCall('seo', seoData);
      setResult(response);
      await supabase.from('tool_results').insert({
        user_id: user.id,
        tool: 'seo',
        input: seoData,
        output: response,
      });
    } catch (error) {
      setResult({ error: 'Failed to analyze SEO.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/tools');
    } catch (error) {
      console.error('Sign-out error:', (error as Error).message);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSeoData({ url: e.target.value });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            AI <span className="text-yellow-300">SEO Analysis</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Optimize your website with actionable SEO insights.
          </p>
        </div>
      </div>

      {/* Navigation and Sign-Out */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex justify-between items-center">
          <nav className="flex flex-wrap gap-4">
            <a
              href="/tools-dashboard"
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
            >
              Sales Dashboard
            </a>
            <a
              href="/sales-forecasting"
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
            >
              Sales Forecasting
            </a>
            <a
              href="/seo-analysis"
              className="px-4 py-2 bg-yellow-300 text-gray-900 rounded-full font-semibold transition-all duration-300"
            >
              SEO Analysis
            </a>
            <a
              href="/ad-copy-generator"
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
            >
              AI Ad Copy Generator
            </a>
            <a
              href="/customer-sentiment"
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
            >
              AI Customer Sentiment
            </a>
            <a
              href="/pricing-optimizer"
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
            >
              AI Pricing Optimizer
            </a>
            <a
              href="/trend-spotter"
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
            >
              AI Trend Spotter
            </a>
            <a
              href="/email-campaign"
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
            >
              AI Email Campaign
            </a>
          </nav>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
          >
            <LogOut className="h-5 w-5 mr-2" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tool Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2 text-center">
              Analyze Your Website
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              Enter your website URL to get actionable SEO insights
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your website URL (e.g., https://example.com)"
                value={seoData.url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button
                onClick={handleSEOAnalysis}
                disabled={loading}
                className="w-full px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Analyze SEO'}
              </button>
            </div>
            {result && (
              <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">SEO Analysis Report:</h4>
                <p className="text-gray-200">{result.report || result.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockApiCall = async (endpoint: string, data: SEOData): Promise<SEOResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint === 'seo') {
        resolve({
          report: `SEO Analysis for ${data.url}:\n- Page load speed: Good (2.1s)\n- Keyword density: Moderate (optimize for 'DTC growth')\n- Backlinks: 15 (consider building more).\nAction: Improve meta descriptions for better ranking.`,
        });
      } else {
        resolve({ error: 'Not implemented' });
      }
    }, 1500);
  });
}