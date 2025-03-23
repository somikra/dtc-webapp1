import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Add this if using React Router

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = [
    "Getting Started",
    "Marketing",
    "Sales Strategy",
    "Customer Experience",
    "Growth"
  ];

  const blogPosts = [
    {
      title: "How to Get Your First Customers?",
      category: "Getting Started",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      excerpt: "Learn proven strategies to acquire your first customers and build a solid foundation for your DTC brand.",
      readTime: "5 min read",
      date: "Mar 15, 2025",
      fullPreview: "Struggling to land your first sale? We’ve got you. This guide breaks down ninja tactics to hook your initial customers—think targeted social campaigns, irresistible lead magnets, and word-of-mouth hacks. Stop waiting and start selling.",
      link: "/howtogetfirstcustomer" // Add link property
    },
    // Other posts remain unchanged
    {
      title: "How to Price Your Products Without a Race to the Bottom?",
      category: "Sales Strategy",
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      excerpt: "Discover effective pricing strategies that maintain your margins while staying competitive in the market.",
      readTime: "7 min read",
      date: "Mar 12, 2025",
      fullPreview: "Pricing’s a minefield—too low, you’re broke; too high, you’re ghosted. We’ll show you how to set prices that scream value, protect your profits, and keep customers coming back. No more race-to-the-bottom nonsense.",
      link: "/howtopriceyourproducts" // Add link property
    },
    {
      title: "Organic vs. Paid Marketing – What's Right for Your Business?",
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80",
      excerpt: "Compare different marketing approaches and learn which strategy best suits your DTC brand's goals.",
      readTime: "6 min read",
      date: "Mar 10, 2025",
      fullPreview: "Organic or paid? It’s the DTC dilemma. We pit SEO and social against PPC and ads, breaking down costs, speed, and ROI. Find out which move—or combo—will turbocharge your brand without wasting time or cash.",
      link: "/howtopriceyourproducts" // Add link property
    }
  ];

  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  const openPreview = (post) => {
    setSelectedPost(post);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 animate-gradient-x">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            Your DTC <span className="text-yellow-300">War Room</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Free intel, hacks, and strategies to dominate the DTC game—straight from the trenches.
          </p>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search the arsenal..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-yellow-300 text-gray-900'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-yellow-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <article
              key={index}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover transform hover:scale-105 transition-all duration-500"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-yellow-300 font-semibold">{post.category}</span>
                  <span className="text-sm text-gray-400">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{post.readTime}</span>
                  <button
                    onClick={() => openPreview(post)}
                    className="text-orange-500 font-semibold hover:text-orange-400 transition-colors"
                  >
                    Dig In →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Get the <span className="text-yellow-300">DTC Edge</span> in Your Inbox
          </h2>
          <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
            Join the rebellion. Get exclusive strategies, insider tips, and DTC gold delivered weekly—no fluff, just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Drop your email, rebel"
              className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button className="px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Join Now
            </button>
          </div>
        </div>
      </div>

      {/* Blog Post Preview Popup */}
      {isPreviewOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-40 object-cover rounded-lg mb-6"
            />
            <h3 className="text-2xl font-extrabold text-yellow-300 mb-4">{selectedPost.title}</h3>
            <p className="text-gray-300 mb-6">{selectedPost.fullPreview}</p>
            <Link
              to={selectedPost.link || "#"} // Use the link property if it exists
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Read Full Post
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}