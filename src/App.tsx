import React from 'react';
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
import ServicesPage from './pages/ServicesPage'; // Add this import
import BlogPage from './pages/BlogPage'; // Add this import

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/services" element={<ServicesPage />} /> {/* Add this route */}
            <Route path="/blog" element={<BlogPage />} /> {/* Add this route */}
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