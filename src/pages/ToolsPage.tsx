import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { BarChart2, DollarSign, Mail, TrendingUp, Search } from 'lucide-react';

interface Tool {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  features: string[];
  link: string;
}

export default function ToolsPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [selectedToolLink, setSelectedToolLink] = useState<string | null>(null); // Track the tool to redirect to after auth
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading && selectedToolLink) {
      navigate(selectedToolLink); // Redirect to the selected tool after successful auth
      setSelectedToolLink(null); // Reset after redirection
    }
  }, [user, loading, navigate, selectedToolLink]);

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Sign-in failed:', (error as Error).message);
      throw error;
    }
  };

  const handleToolClick = (link: string) => {
    if (user) {
      navigate(link); // Direct navigation if logged in
    } else {
      setSelectedToolLink(link); // Store the tool link for redirection after auth
      setIsAuthModalOpen(true); // Open auth modal for unauthenticated users
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  const tools: Tool[] = [
    {
      name: 'Unleash Sales Superpowers',
      icon: BarChart2,
      description: 'Track and skyrocket your revenue with a dashboard that’s pure DTC gold.',
      features: [
        'Real-Time Sales Tracker',
        'Profit Hotspots',
        'Customer Buying Trends',
        'Growth Insights That Slap',
      ],
      link: '/tools-dashboard',
    },
    {
      name: 'Forecast Like a Fortune Teller',
      icon: TrendingUp,
      description: 'See the future of your sales with AI that predicts wins for DTC champs.',
      features: [
        'AI-Powered Predictions',
        'Sales Goal Smasher',
        'Trend Spotter',
        'Plan Like a Pro',
      ],
      link: '/sales-forecasting',
    },
    {
      name: 'Crush the SEO Game',
      icon: Search,
      description: 'Dominate search and flood your store with buyers using SEO that kills it.',
      features: [
        'Keyword Goldmine',
        'Traffic Booster',
        'Competitor Crusher',
        'Rankings That Pop',
      ],
      link: '/seo-analysis',
    },
    {
      name: 'Price Like a Profit Ninja',
      icon: DollarSign,
      description: 'Max out your margins with AI pricing that’s smarter than the competition.',
      features: [
        'Market Trend Analyzer',
        'Profit Maximizer',
        'Dynamic Price Magic',
        'Revenue Rocket',
      ],
      link: '/pricing-optimizer',
    },
    {
      name: 'Email Like a Sales Beast',
      icon: Mail,
      description: 'Turn emails into a cash machine with campaigns that hook and convert.',
      features: [
        'Killer Email Flows',
        'Cart Recovery Champs',
        'Personalized Magic',
        'Conversion Kings',
      ],
      link: '/email-campaign',
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 animate-gradient-x">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            Supercharge Your DTC Growth with <span className="text-yellow-300">AI Tools</span>
          </h1>
          <p className="mt-6 text-2xl font-extrabold text-gray-100 text-center max-w-3xl mx-auto tracking-wider">
            From sales insights to email mastery, our AI-powered tools help you dominate your market and grow like a pro.
          </p>
          {/* Modern Trendy Callout */}
          <div className="mt-8 flex justify-center">
            <div className="relative inline-flex items-center px-6 py-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                Free for a Limited Time! No Credit Card Required to Sign Up!
              </span>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                🔥
              </span>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            {user ? (
              <button
                onClick={() => navigate('/tools-dashboard')}
                className="px-8 py-4 bg-yellow-300 text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Access Tools Now
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-4 bg-yellow-300 text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Explore Our AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              onClick={() => handleToolClick(tool.link)}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <tool.icon className="h-8 w-8 text-yellow-300 mr-3" />
                <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
              </div>
              <p className="text-gray-300 mb-4">{tool.description}</p>
              <ul className="space-y-3">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-400">
                    <span className="h-3 w-3 bg-orange-500 rounded-full mr-3 animate-pulse"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setSelectedToolLink(null); // Reset if modal is closed without auth
        }}
        onSignIn={handleSignIn}
        onSignUp={async (email: string, password: string) => {
          try {
            await signUp(email, password);
          } catch (error) {
            console.error('Sign-up failed:', (error as Error).message);
            throw error;
          }
        }}
        noCreditCardRequired={true} // Pass this prop to display in the modal
      />
    </div>
  );
}