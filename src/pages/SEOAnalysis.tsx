import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Loader2, LogOut, BarChart2, TrendingUp, PieChart, DollarSign, Mail,
  AlertTriangle, TrendingDown, Star, ArrowRight, Download,
} from 'lucide-react';

interface SEOData {
  url: string;
}

interface SEOIssue {
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
}

interface SEOResult {
  url: string;
  overallScore: number;
  issues: SEOIssue[];
  insights: string[];
  actionPlan: string[];
  topKeywords: { keyword: string; density: number; competition: number }[];
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
      setError('Failed to analyze SEO. Please check the URL and try again.');
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

  const downloadSEOReport = () => {
    if (!result) return;
    const csvData = [
      ['SEO Analysis Report for', result.url],
      ['Overall Score', `${result.overallScore}/100`],
      [],
      ['Issues'],
      ['Type', 'Severity', 'Description', 'Recommendation'],
      ...result.issues.map(issue => [issue.type, issue.severity, issue.description, issue.recommendation]),
      [],
      ['Top Keywords'],
      ['Keyword', 'Density (%)', 'Competition (0-1)'],
      ...result.topKeywords.map(kw => [kw.keyword, kw.density.toFixed(2), kw.competition.toFixed(2)]),
      [],
      ['Insights'],
      ...result.insights.map(ins => [ins.replace(/<[^>]+>/g, '')]),
      [],
      ['Action Plan'],
      ...result.actionPlan.map(action => [action]),
    ];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${result.url.replace(/https?:\/\//, '').replace(/\//g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const analyzeSEO = async (url: string): Promise<SEOResult> => {
    // Simulate a detailed SEO analysis (replace with real API calls in production)
    return new Promise((resolve) => {
      setTimeout(() => {
        const issues: SEOIssue[] = [];
        const overallScore = Math.floor(Math.random() * 41) + 60; // 60-100 for demo
        const pageLoadTime = (Math.random() * 3 + 1).toFixed(1); // 1-4s
        const keywordDensity = Math.random() * 5 + 1; // 1-6%
        const backlinks = Math.floor(Math.random() * 50); // 0-50
        const mobileScore = Math.random() > 0.3 ? 'Good' : 'Poor';

        // Simulated SEO issues
        if (parseFloat(pageLoadTime) > 2.5) {
          issues.push({
            type: 'Page Load Speed',
            severity: 'High',
            description: `Load time of ${pageLoadTime}s exceeds optimal threshold.`,
            recommendation: 'Optimize images, minify CSS/JS, and leverage browser caching to reduce load time below 2s.',
          });
        }
        if (keywordDensity < 2 || keywordDensity > 4) {
          issues.push({
            type: 'Keyword Density',
            severity: 'Medium',
            description: `Keyword density (${keywordDensity.toFixed(1)}%) is outside optimal range (2-4%).`,
            recommendation: 'Adjust content to target 2-4% density for primary DTC keywords like "buy online" or "shop now".',
          });
        }
        if (backlinks < 10) {
          issues.push({
            type: 'Backlinks',
            severity: 'High',
            description: `Only ${backlinks} backlinks detected—too low for competitive ranking.`,
            recommendation: 'Launch a guest posting campaign and partner with DTC blogs to boost backlinks by 50% in 30 days.',
          });
        }
        if (mobileScore === 'Poor') {
          issues.push({
            type: 'Mobile Optimization',
            severity: 'Critical',
            description: 'Mobile experience is subpar, risking 60%+ of DTC traffic.',
            recommendation: 'Implement responsive design and test on multiple devices—aim for Google’s Mobile-Friendly certification.',
          });
        }

        const topKeywords = [
          { keyword: 'DTC online store', density: keywordDensity, competition: 0.7 },
          { keyword: 'shop direct', density: (keywordDensity * 0.8).toFixed(1), competition: 0.5 },
          { keyword: 'buy now', density: (keywordDensity * 0.6).toFixed(1), competition: 0.9 },
        ];

        const insights = [
          `Overall SEO Score: <Star className="inline h-4 w-4 text-yellow-400" /> ${overallScore}/100—${overallScore > 80 ? 'Solid foundation!' : 'Room to grow—focus on critical fixes!'}`,
          `Page Load: <Clock className="inline h-4 w-4 text-red-400" /> ${pageLoadTime}s—${parseFloat(pageLoadTime) > 2 ? 'Speed up for a 20% conversion boost!' : 'Great job—keep it snappy!'}`,
          `Backlinks: <TrendingUp className="inline h-4 w-4 text-green-400" /> ${backlinks} detected—${backlinks < 20 ? 'Build 10+ more for a ranking surge!' : 'Strong link profile—leverage it!'}`,
          `Mobile: <AlertTriangle className="inline h-4 w-4 text-${mobileScore === 'Poor' ? 'red' : 'green'}-500" /> ${mobileScore}—${mobileScore === 'Poor' ? 'Fix now or lose 60% of DTC buyers!' : 'Mobile-ready—optimize further for UX!'}`,
          `Keywords: <Search className="inline h-4 w-4 text-blue-400" /> Top performer "${topKeywords[0].keyword}" at ${topKeywords[0].density.toFixed(1)}%—${topKeywords[0].density < 2 ? 'Increase density!' : 'Perfect balance—push PPC ads!'}`,
        ];

        const actionPlan = [
          overallScore < 80 ? 'Boost your SEO score above 80: Prioritize critical fixes like mobile optimization and page speed within 2 weeks.' : 'Maintain your edge: Refine keywords and build 5+ high-quality backlinks this month.',
          `Optimize "${topKeywords[0].keyword}": Update meta titles and descriptions across 5 key pages—aim for a 15% traffic lift.`,
          backlinks < 20 ? 'Launch a backlink blitz: Secure 3 guest posts on DTC blogs in 14 days to double your links.' : 'Strengthen authority: Pitch to 2 high-DA sites for featured mentions.',
          parseFloat(pageLoadTime) > 2 ? `Cut load time to under 2s: Compress images and enable CDN—expect a 10% sales bump.` : 'Polish load speed: Test caching tweaks for an extra 5% edge.',
          mobileScore === 'Poor' ? 'Go mobile-first: Redesign for responsiveness in 7 days—60% of DTC traffic depends on it!' : 'Enhance mobile UX: Add sticky CTAs for a 10% conversion boost.',
        ];

        resolve({
          url,
          overallScore,
          issues,
          insights,
          actionPlan,
          topKeywords,
        });
      }, 2000); // Simulate network delay
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-poppins relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-star-twinkle"></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden animate-gradient-x">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight text-white drop-shadow-lg">
            Intelligent <span className="text-yellow-300">SEO Analysis</span> <Search className="inline h-8 w-8 animate-pulse" />
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Dominate search and flood your DTC store with buyers using next-level SEO insights!
          </p>
          <div className="mt-4 bg-gray-800 bg-opacity-80 p-4 rounded-xl shadow-lg text-center max-w-2xl mx-auto transform hover:scale-105 transition-all duration-300">
            <p className="text-yellow-300 font-semibold text-lg">
              Instant analysis—no fluff, pure DTC growth power!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Launch Pad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <a href="/seo-analysis" className="group relative px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <Search className="w-4 h-4 mr-2" /> SEO Analysis
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Hot</span>
                </a>
                <a href="/pricing-optimizer" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <DollarSign className="w-4 h-4 mr-2" /> Pricing Optimizer
                </a>
                <a href="/email-campaign" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <Mail className="w-4 h-4 mr-2" /> Email Campaign
                </a>
              </div>
            </div>
            <button onClick={handleSignOut} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-xl shadow-lg hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 flex items-center text-sm font-semibold transform hover:scale-105 flex-shrink-0">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-5"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md flex items-center">
              SEO Analysis <Search className="inline h-6 w-6 text-yellow-300 ml-2 animate-pulse" />
            </h2>
          </div>

          {/* Input Section */}
          {!result && (
            <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 text-yellow-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-gray-200 mb-2 text-center">
              Analyze Your DTC Website
            </h3>
            <p className="text-gray-400 mb-6 text-center">
              Enter your URL to unlock SEO insights that crush the competition!
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="https://yourdtcstore.com"
                value={seoData.url} // Controlled by state
                onChange={handleInputChange} // Updates state on input
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
              />
              <button
                onClick={handleSEOAnalysis}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg font-semibold disabled:bg-gray-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mr-2" /> Analyzing...
                  </>
                ) : (
                  <>
                    Crush SEO Now! <Search className="inline h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-600 p-4 rounded-xl mb-6 text-white shadow-md animate-pulse">
              <p>{error}</p>
            </div>
          )}

          {/* SEO Results */}
          {result && (
            <div className="space-y-12">
              {/* Overview Section */}
              <section>
                <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                  SEO Overview <PieChart className="inline h-6 w-6 ml-2 animate-pulse" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">Overall Score</h4>
                      <p className="text-2xl font-bold text-white drop-shadow-md">{result.overallScore}/100</p>
                      <p className="text-sm text-gray-400">{result.overallScore > 80 ? 'Killing it!' : 'Let’s boost this!'}</p>
                    </div>
                    <button
                      onClick={downloadSEOReport}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center text-xl font-bold animate-gradient-x border-2 border-yellow-300 hover:border-yellow-400 whitespace-nowrap"
                    >
                      <Download className="h-6 w-6 mr-2 animate-bounce" /> Get Report
                    </button>
                  </div>
                </div>
              </section>

              {/* Issues Section */}
              {result.issues.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                    SEO Issues <AlertTriangle className="inline h-6 w-6 ml-2 animate-pulse" />
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt"
                        data-tooltip={issue.recommendation}
                      >
                        <div className="flex items-center mb-2">
                          <AlertTriangle className={`h-5 w-5 mr-2 text-${issue.severity === 'Critical' ? 'red' : issue.severity === 'High' ? 'orange' : 'yellow'}-500 animate-pulse`} />
                          <h4 className="text-lg font-bold text-white">{issue.type}</h4>
                        </div>
                        <p className="text-gray-300 text-sm">Severity: {issue.severity}</p>
                        <p className="text-gray-300 text-sm">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Top Keywords Section */}
              {result.topKeywords.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                    Top Keywords <Star className="inline h-6 w-6 ml-2 animate-pulse" />
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.topKeywords.map((kw, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt"
                      >
                        <div className="flex items-center mb-2">
                          <Star className="text-yellow-300 mr-2 animate-pulse" />
                          <h4 className="text-lg font-bold text-white">{kw.keyword}</h4>
                        </div>
                        <p className="text-gray-300 text-sm">Density: {kw.density.toFixed(1)}%</p>
                        <p className="text-gray-300 text-sm">Competition: {kw.competition.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Action Plan Section */}
              {result.actionPlan.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                    Action Plan <TrendingUp className="inline h-6 w-6 ml-2 animate-pulse" />
                  </h3>
                  <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                    <ul className="list-none text-gray-300 text-sm space-y-2">
                      {result.actionPlan.map((action, i) => (
                        <li key={i} className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Insights Section */}
              {result.insights.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                    Pro Insights <svg className="inline h-6 w-6 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                  </h3>
                  <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                    <ul className="list-none text-gray-300 text-sm space-y-2">
                      {result.insights.map((insight, i) => (
                        <li key={i} className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
                          <span dangerouslySetInnerHTML={{ __html: insight }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              <button
                onClick={() => setResult(null)}
                className="w-full max-w-md mx-auto px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm"
              >
                Analyze Another URL <Search className="inline h-5 w-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add custom CSS (consistent with SalesForecasting)
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .card-tilt { transition: transform 0.3s, box-shadow 0.3s; position: relative; }
  .card-tilt:hover { transform: perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.02); box-shadow: 0 10px 20px rgba(0, 255, 0, 0.3); }
  .card-tilt[data-tooltip]:hover:after {
    content: attr(data-tooltip); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8); color: white; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.875rem;
    white-space: nowrap; z-index: 10; margin-bottom: 0.5rem; opacity: 0; transition: opacity 0.2s;
  }
  .card-tilt:hover[data-tooltip]:after { opacity: 1; }
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