import React, { useEffect } from 'react'; // Add useEffect import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ToolsPage from './pages/ToolsPage';
import ToolsDashboard from './pages/ToolsDashboard';
import AdCopyGenerator from './pages/AdCopyGenerator';
import SalesForecasting from './pages/SalesForecasting';
import SEOAnalysis from './pages/SEOAnalysis';
import CustomerSentiment from './pages/CustomerSentiment';
import PricingOptimizer from './pages/PricingOptimizer';
import TrendSpotter from './pages/TrendSpotter';
import EmailCampaign from './pages/EmailCampaign';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import HowToGetFirstCustomer from './pages/howtogetfirstcustomer';
import HowToPriceYourProducts from './pages/howtopriceyourproducts';
import OrganicVsPaidMarketing from './pages/organicvspaidmarketing';
import emailjs from '@emailjs/browser'; // Import EmailJS
import { Toaster } from 'react-hot-toast'; // Import Toaster

export default function App() {
  // Initialize EmailJS with your Public Key
  useEffect(() => {
    emailjs.init('tdtBnqm0sor90ji7w'); // Your Public Key from EmailJS
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} /> {/* Add Toaster */}
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/howtogetfirstcustomer" element={<HowToGetFirstCustomer />} />
            <Route path="/howtopriceyourproducts" element={<HowToPriceYourProducts />} />
            <Route path="/organicvspaidmarketing" element={<OrganicVsPaidMarketing />} />
            <Route
              path="/tools-dashboard"
              element={
                <ProtectedRoute>
                  <ToolsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ad-copy-generator"
              element={
                <ProtectedRoute>
                  <AdCopyGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-forecasting"
              element={
                <ProtectedRoute>
                  <SalesForecasting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seo-analysis"
              element={
                <ProtectedRoute>
                  <SEOAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-sentiment"
              element={
                <ProtectedRoute>
                  <CustomerSentiment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pricing-optimizer"
              element={
                <ProtectedRoute>
                  <PricingOptimizer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trend-spotter"
              element={
                <ProtectedRoute>
                  <TrendSpotter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/email-campaign"
              element={
                <ProtectedRoute>
                  <EmailCampaign />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}