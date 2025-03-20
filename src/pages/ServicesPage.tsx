import React, { useState } from 'react';
import { Search, Share2, BarChart, Mail, PenTool, Target, X, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const toggleServicePopup = (service) => {
    setSelectedService(service);
    setIsServicePopupOpen(!isServicePopupOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks! We’ll reach out soon to kickstart your DTC journey.');
    setIsPopupOpen(false);
  };

  const services = [
    {
      icon: Search,
      title: "Crush the Search Game",
      description: "Dominate Google and snag organic traffic with SEO that’s built for DTC warriors.",
      features: [
        "Killer Keyword Playbook",
        "On-Page SEO Magic",
        "Tech SEO Deep Dive",
        "Content That Ranks"
      ],
      details: "Want to outrank your competitors and get found by customers who are ready to buy? Our SEO pros dive deep into your niche, uncover high-impact keywords, and optimize your site to climb the ranks. From technical fixes to content that hooks, we’ll turn your store into a search engine magnet.",
      cta: "Rank Like a Boss"
    },
    {
      icon: Share2,
      title: "Rule Social Media",
      description: "Turn likes into sales with a social strategy that screams your brand loud and proud.",
      features: [
        "Epic Content Calendar",
        "Community Hype Squad",
        "Influencer Power Moves",
        "Social Stats That Slap"
      ],
      details: "Social media isn’t just posting—it’s a battlefield. We craft scroll-stopping content, rally your fans, and team up with influencers who vibe with your brand. Plus, we track every like and share to make sure your social game drives real sales.",
      cta: "Own the Feed"
    },
    {
      icon: BarChart,
      title: "PPC That Pays Off",
      description: "Flood your store with buyers using ads that hit hard and don’t waste a dime.",
      features: [
        "Laser-Focused Campaigns",
        "Ad Copy That Converts",
        "Budget Ninja Skills",
        "Results You Can Track"
      ],
      details: "Sick of burning cash on ads that flop? Our PPC wizards design campaigns that target the right people, with ads that grab attention and budgets that stretch further. Watch your ROI soar as we tweak and track every click.",
      cta: "Ads That Cash In"
    },
    {
      icon: PenTool,
      title: "Content That Converts",
      description: "Hook customers and build cred with stories and posts that sell without selling out.",
      features: [
        "Blogs That Pop",
        "Emails That Hook",
        "Product Words That Wow",
        "Your Brand, Unfiltered"
      ],
      details: "Content is your secret weapon. We write blogs that pull readers in, emails that spark action, and product descriptions that sell themselves. It’s all about telling your brand’s story in a way that sticks—and converts.",
      cta: "Words That Sell"
    },
    {
      icon: Mail,
      title: "Email Cash Machine",
      description: "Turn inboxes into goldmines with automated emails that nurture and close.",
      features: [
        "Killer Welcome Flows",
        "Cart Rescue Missions",
        "Segmented Money Makers",
        "A/B Tests That Win"
      ],
      details: "Email’s where the money hides. We set up welcome sequences that wow, recover abandoned carts like champs, and segment your list for max impact. With A/B testing, we’ll keep refining until every send is a cash machine.",
      cta: "Inboxes to Income"
    },
    {
      icon: Target,
      title: "Conversion Overdrive",
      description: "Turn clicks into cash with a site that’s optimized to sell like crazy.",
      features: [
        "UX That Feels Right",
        "A/B Tests That Prove It",
        "Landing Pages That Land",
        "Checkout Flow Fixes"
      ],
      details: "Visitors bouncing? Not anymore. We analyze your site’s UX, run A/B tests to find what works, and craft landing pages that seal the deal. From smoother checkouts to higher conversions, we’ll make your site a selling machine.",
      cta: "Clicks to Cash"
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 animate-gradient-x">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            Supercharge Your <span className="text-yellow-300">DTC Hustle</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            From SEO domination to ad campaigns that kill it, we’ve got the firepower to grow your brand fast.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-yellow-300 text-gray-900 mb-6">
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              <ul className="space-y-4">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-400">
                    <span className="h-3 w-3 bg-orange-500 rounded-full mr-3 animate-pulse"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => toggleServicePopup(service)}
                className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {service.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-500 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Dominate?
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Book a free consult with our DTC crew and start crushing it today.
          </p>
          <button
            onClick={togglePopup}
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-400 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Let’s Talk Growth
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Service Detail Popup */}
      {isServicePopupOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            <button
              onClick={() => toggleServicePopup(null)}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-300 text-gray-900 mb-6 mx-auto">
              <selectedService.icon className="h-10 w-10" />
            </div>
            <h3 className="text-3xl font-extrabold text-yellow-300 mb-4 text-center">{selectedService.title}</h3>
            <p className="text-gray-300 mb-6">{selectedService.details}</p>
            <button
              onClick={togglePopup}
              className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Book a Free Consult
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}