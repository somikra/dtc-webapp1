import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Loader2, LogOut } from 'lucide-react';

interface SentimentData {
  text: string;
}

interface SentimentResult {
  sentiment?: string;
  score?: number;
  error?: string;
}

export default function CustomerSentiment() {
  const { user, supabase, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData>({ text: '' });

  const handleSentimentAnalysis = async () => {
    if (!sentimentData.text) {
      setResult({ error: 'Please enter customer feedback or review text.' });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await mockApiCall('sentiment', sentimentData);
      setResult(response);
      await supabase.from('tool_results').insert({
        user_id: user.id,
        tool: 'sentiment',
        input: sentimentData,
        output: response,
      });
    } catch (error) {
      setResult({ error: 'Failed to analyze sentiment.' });
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

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSentimentData({ text: e.target.value });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            AI <span className="text-yellow-300">Customer Sentiment</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Understand customer sentiment from reviews and feedback.
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
              className="px-4 py-2 bg-yellow-300 text-gray-900 rounded-full font-semibold transition-all duration-300"
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
            <Bot className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2 text-center">
              Analyze Customer Sentiment
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              Enter customer feedback or review text to analyze sentiment
            </p>
            <div className="space-y-4">
              <textarea
                placeholder="Enter customer feedback (e.g., 'Great product, fast shipping!')"
                value={sentimentData.text}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 h-24"
              />
              <button
                onClick={handleSentimentAnalysis}
                disabled={loading}
                className="w-full px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : 'Analyze Sentiment'}
              </button>
            </div>
            {result && (
              <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Sentiment Analysis:</h4>
                <p className="text-gray-200">
                  Sentiment: {result.sentiment || 'N/A'}<br />
                  Score: {result.score !== undefined ? `${result.score.toFixed(2)}/1.0` : 'N/A'}<br />
                  {result.error || ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockApiCall = async (endpoint: string, data: SentimentData): Promise<SentimentResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint === 'sentiment') {
        const positiveKeywords = ['great', 'excellent', 'fast', 'love'];
        const negativeKeywords = ['bad', 'slow', 'poor', 'hate'];
        const score = positiveKeywords.filter(word => data.text.toLowerCase().includes(word)).length -
                     negativeKeywords.filter(word => data.text.toLowerCase().includes(word)).length;
        const sentiment = score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral';
        resolve({ sentiment, score: Math.max(0, Math.min(1, (score + 3) / 6)) });
      } else {
        resolve({ error: 'Not implemented' });
      }
    }, 1500);
  });
};