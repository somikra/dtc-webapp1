import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Loader2, LogOut, BarChart2, TrendingUp, PieChart, DollarSign, Mail,
  AlertTriangle, CheckCircle, Clock, Smartphone, Link, Eye, ShoppingCart, Lock, FileText,
} from 'lucide-react';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface SEOData {
  url: string;
}

interface SEOInsight {
  title: string;
  status: 'Good' | 'Bad' | 'Warning';
  description: string;
  recommendation: string;
  impact: string;
}

interface SEOResult {
  url: string;
  overallScore: number;
  insights: SEOInsight[];
}

export default function SEOAnalysis() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SEOResult | null>(null);
  const [seoData, setSeoData] = useState<SEOData>({ url: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSEOAnalysis = async () => {
    if (!seoData.url || !isValidUrl(seoData.url)) {
      setError('Please enter a valid website URL (e.g., https://example.com).');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeSEO(seoData.url);
      setResult(response);
    } catch (err) {
      setError(`Failed to analyze SEO: ${err.message || 'Unknown error'}.`);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
    return pattern.test(url);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/tools');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSeoData({ url: e.target.value });
  };

  const analyzeSEO = async (url: string): Promise<SEOResult> => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    let html = '';
    try {
      const response = await axios.get(`${proxyUrl}${targetUrl}`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        timeout: 10000,
      });
      html = response.data;
    } catch (err) {
      console.error('Fetch failed:', err.response ? err.response.status : err.message);
    }

    const $ = cheerio.load(html);
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const hasCanonical = !!$('link[rel="canonical"]').length;
    const imageAlts = $('img[alt]').length / ($('img').length || 1);
    const productPages = $('a[href*="/product"]').length > 0 || $('a[href*="/shop"]').length > 0;
    const h1Count = $('h1').length;
    const contentLength = $('p').text().split(/\s+/).filter(word => word).length;
    const hasRobots = !!$('meta[name="robots"]').length;
    const internalLinks = $('a[href^="/"]').length;
    const isSecure = targetUrl.startsWith('https');

    // Calculate score based on checks (out of 100)
    const scoreFactors = [
      title.length > 0 && title.length <= 60 ? 10 : 0,
      description.length > 0 && description.length <= 160 ? 10 : 0,
      hasCanonical ? 10 : 0,
      imageAlts >= 0.8 ? 10 : 0,
      productPages ? 10 : 0,
      h1Count === 1 ? 10 : 0,
      contentLength >= 500 ? 10 : 0,
      hasRobots ? 10 : 0,
      internalLinks >= 5 ? 10 : 0,
      isSecure ? 10 : 0,
    ];
    const overallScore = scoreFactors.reduce((sum, val) => sum + val, 0);

    const insights: SEOInsight[] = [
      {
        title: 'Meta Title',
        status: title.length > 0 && title.length <= 60 ? 'Good' : 'Bad',
        description: title.length > 0 ? `Title is ${title.length} characters.` : 'No title tag found.',
        recommendation: title.length > 60 ? 'Shorten to 60 characters.' : title.length === 0 ? 'Add a title with key product terms.' : 'Optimize with top-selling product names.',
        impact: 'Boosts click-through rate by 15%.',
      },
      {
        title: 'Meta Description',
        status: description.length > 0 && description.length <= 160 ? 'Good' : 'Bad',
        description: description.length > 0 ? `Description is ${description.length} characters.` : 'No description found.',
        recommendation: description.length > 160 ? 'Trim to 160 characters with a CTA.' : description.length === 0 ? 'Add a 150-char sales pitch.' : 'Include a strong call-to-action.',
        impact: 'Increases clicks by 10%.',
      },
      {
        title: 'Canonical Tags',
        status: hasCanonical ? 'Good' : 'Warning',
        description: hasCanonical ? 'Canonical tag present.' : 'No canonical tag detected.',
        recommendation: hasCanonical ? 'Verify it points to the correct URL.' : 'Add canonical tags to prevent duplicate content issues.',
        impact: 'Avoids 5-10% ranking loss.',
      },
      {
        title: 'Image Alt Text',
        status: imageAlts >= 0.8 ? 'Good' : 'Bad',
        description: `${(imageAlts * 100).toFixed(0)}% of images have alt text.`,
        recommendation: imageAlts < 0.8 ? 'Add alt text to 80%+ of images with product descriptions.' : 'Enhance with keyword-rich alt text.',
        impact: 'Drives 25% more image search traffic.',
      },
      {
        title: 'Product Page Links',
        status: productPages ? 'Good' : 'Warning',
        description: productPages ? 'Product/shop links found.' : 'No clear product pages detected.',
        recommendation: productPages ? 'Ensure product URLs are SEO-friendly.' : 'Add visible links to product pages from homepage.',
        impact: 'Powers 30% of sales traffic.',
      },
      {
        title: 'H1 Heading Usage',
        status: h1Count === 1 ? 'Good' : h1Count > 1 ? 'Warning' : 'Bad',
        description: h1Count === 1 ? 'One H1 found—perfect!' : h1Count > 1 ? `${h1Count} H1s found.` : 'No H1 found.',
        recommendation: h1Count > 1 ? 'Reduce to one H1 per page.' : h1Count === 0 ? 'Add one H1 with your main product focus.' : 'Keep it unique and descriptive.',
        impact: 'Improves ranking clarity by 10%.',
      },
      {
        title: 'Content Length',
        status: contentLength >= 500 ? 'Good' : 'Warning',
        description: `Content has ${contentLength} words.`,
        recommendation: contentLength < 500 ? 'Add 500+ words of unique product content.' : 'Boost with customer reviews or guides.',
        impact: 'Increases dwell time by 15%.',
      },
      {
        title: 'Robots Meta Tag',
        status: hasRobots ? 'Good' : 'Warning',
        description: hasRobots ? 'Robots tag present.' : 'No robots tag found.',
        recommendation: hasRobots ? 'Ensure it allows indexing.' : 'Add <meta name="robots" content="index, follow">.',
        impact: 'Ensures 100% crawlability.',
      },
      {
        title: 'Internal Linking',
        status: internalLinks >= 5 ? 'Good' : 'Warning',
        description: `${internalLinks} internal links detected.`,
        recommendation: internalLinks < 5 ? 'Add 5+ links to key product pages.' : 'Link to high-margin products for sales lift.',
        impact: 'Distributes page authority by 20%.',
      },
      {
        title: 'SSL Security',
        status: isSecure ? 'Good' : 'Bad',
        description: isSecure ? 'Site uses HTTPS.' : 'Site lacks HTTPS.',
        recommendation: isSecure ? 'Keep SSL certificate updated.' : 'Switch to HTTPS for trust and ranking.',
        impact: 'Builds 10% more user trust.',
      },
    ];

    return { url, overallScore, insights };
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-poppins relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-star-twinkle"></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-12 relative overflow-hidden animate-gradient-x">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white drop-shadow-lg">
            SEO <span className="text-yellow-300">Power Boost</span> <Search className="inline h-8 w-8 animate-pulse" />
          </h1>
          <p className="mt-4 text-lg text-gray-100 text-center max-w-2xl mx-auto">
            Skyrocket your DTC sales with pro-level SEO insights—fix what’s broken, double down on what works!
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/tools-dashboard" className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center text-sm"><BarChart2 className="h-4 w-4 mr-2" /> Sales Dashboard</a>
            <a href="/sales-forecasting" className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center text-sm"><TrendingUp className="h-4 w-4 mr-2" /> Forecasting</a>
            <a href="/seo-analysis" className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-all flex items-center text-sm font-bold"><Search className="h-4 w-4 mr-2" /> SEO Boost</a>
            <a href="/pricing-optimizer" className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center text-sm"><DollarSign className="h-4 w-4 mr-2" /> Pricing</a>
            <a href="/email-campaign" className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center text-sm"><Mail className="h-4 w-4 mr-2" /> Email</a>
          </div>
          <button onClick={handleSignOut} className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all flex items-center text-sm"><LogOut className="h-4 w-4 mr-2" /> Sign Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-5"></div>

          {!result && (
            <div className="text-center relative z-10">
              <Search className="h-12 w-12 text-yellow-300 mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-bold text-white mb-2">Unlock Your SEO Potential</h2>
              <p className="text-gray-300 mb-6">Enter your DTC store URL for 10+ actionable insights.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="https://yourdtcstore.com"
                  value={seoData.url}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm shadow-md"
                />
                <button
                  onClick={handleSEOAnalysis}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-lg font-semibold disabled:bg-gray-500 flex items-center justify-center"
                >
                  {loading ? (
                    <><Loader2 className="h-6 w-6 animate-spin mr-2" /> Analyzing...</>
                  ) : (
                    <>Boost My SEO <Search className="h-5 w-5 ml-2" /></>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-600 p-4 rounded-lg mb-6 text-white text-center shadow-md animate-pulse max-w-md mx-auto">
              {error}
            </div>
          )}

          {result && (
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">SEO Insights for <span className="text-yellow-300">{result.url}</span></h2>
                <div className="mt-4 flex justify-center items-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#444"
                        strokeWidth="4"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="4"
                        strokeDasharray={`${result.overallScore}, 100`}
                        transform="rotate(-90 18 18)"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#f97316' }} />
                          <stop offset="100%" style={{ stopColor: '#eab308' }} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
                      {result.overallScore}/100
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                      insight.status === 'Good' ? 'bg-green-900/50 border-l-4 border-green-500' :
                      insight.status === 'Bad' ? 'bg-red-900/50 border-l-4 border-red-500' :
                      'bg-yellow-900/50 border-l-4 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {insight.status === 'Good' ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : insight.status === 'Bad' ? (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      )}
                      <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{insight.description}</p>
                    <p className="text-gray-200 text-sm mt-1"><span className="font-bold text-yellow-300">Fix:</span> {insight.recommendation}</p>
                    <p className="text-gray-400 text-xs mt-1"><span className="font-bold">Impact:</span> {insight.impact}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setResult(null)}
                className="mt-6 mx-auto block px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm flex items-center"
              >
                Analyze Another Site <Search className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Custom CSS
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .animate-gradient-x { background-size: 200% 200%; animation: gradientShift 10s ease infinite; }
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-bounce { animation: bounce 1s infinite; }
  .animate-star-twinkle { animation: starTwinkle 5s infinite; }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes starTwinkle { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.3; } }
  body { margin: 0; }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);