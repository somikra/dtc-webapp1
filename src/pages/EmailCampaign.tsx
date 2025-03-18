import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Loader2, LogOut } from 'lucide-react';

interface EmailData {
  audience: string;
  product: string;
}

interface EmailResult {
  campaign?: string;
  error?: string;
}

export default function EmailCampaign() {
  const { user, supabase, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [emailData, setEmailData] = useState<EmailData>({ audience: '', product: '' });

  const handleEmailCampaign = async () => {
    if (!emailData.audience || !emailData.product) {
      setResult({ error: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await mockApiCall('email', emailData);
      setResult(response);
      await supabase.from('tool_results').insert({
        user_id: user.id,
        tool: 'email',
        input: emailData,
        output: response,
      });
    } catch (error) {
      setResult({ error: 'Failed to generate email campaign.' });
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            AI <span className="text-yellow-300">Email Campaign</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Generate personalized email campaigns for your audience.
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
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold transition-all duration-300"
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
              className="px-4 py-2 bg-yellow-300 text-gray-900 rounded-full font-semibold transition-all duration-300"
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
            <Mail className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2 text-center">
              Generate Email Campaign
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              Enter details to create a personalized email campaign
            </p>
            <div className="space-y-4">
              <input
                type="text"
                name="audience"
                placeholder="Target Audience (e.g., 25-35 fitness enthusiasts)"
                value={emailData.audience}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <input
                type="text"
                name="product"
                placeholder="Product Name"
                value={emailData.product}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button
                onClick={handleEmailCampaign}
                disabled={loading}
                className="w-full px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Generate Campaign'}
              </button>
            </div>
            {result && (
              <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Email Campaign:</h4>
                <p className="text-gray-200">{result.campaign || result.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockApiCall = async (endpoint: string, data: EmailData): Promise<EmailResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint === 'email') {
        resolve({
          campaign: `Subject: Exclusive Offer for ${data.audience}!\n\nHi ${data.audience.split(' ')[0]},\nGet your ${data.product} now with 20% off! Limited time only. Click here to shop: [Link]\nBest,\nYour Brand Team`,
        });
      } else {
        resolve({ error: 'Not implemented' });
      }
    }, 1500);
  });
};