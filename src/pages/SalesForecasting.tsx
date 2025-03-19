import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Loader2,
  Upload,
  Download,
  LogOut,
  BarChart2,
  LineChart,
  PieChart,
  AreaChart,
  Target,
  Star,
  Clock,
  ShoppingCart,
  MessageCircle,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  Package,
  Megaphone,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import Papa from 'papaparse';

interface Sale {
  date: string;
  product: string;
  sales: number;
  quantity: number;
  cost?: number;
  sku?: string;
}

interface ForecastData {
  file: File | null;
}

interface ForecastResult {
  method: string;
  totalForecast: number;
  topPerformers: { product: string; totalSales: number; growthRate: number }[];
  predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[];
  actionPlan: string[];
  insights: string[];
}

const FORECAST_OPTIONS = [
  { id: 'historical-trend', title: 'Historical Trend', icon: <TrendingUp className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Leverage past performance for steady predictions.', highlights: ['Trend-based', 'Reliable', 'Stable'] },
  { id: 'seasonal-boost', title: 'Seasonal Boost', icon: <AreaChart className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Capitalize on seasonal sales patterns.', highlights: ['Seasonal focus', 'Holiday-ready', 'Stock surge'] },
  { id: 'growth-aggressive', title: 'Growth Aggressive', icon: <LineChart className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Aggressively predict and drive growth.', highlights: ['Rapid growth', 'Ad-driven', 'High potential'] },
  { id: 'product-breakout', title: 'Product Breakout', icon: <PieChart className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Highlight top-performing products.', highlights: ['Top products', 'Profit focus', 'Niche strength'] },
];

const RANGE_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function SalesForecasting() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [forecastData, setForecastData] = useState<ForecastData>({ file: null });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<string>('day');
  const [duration, setDuration] = useState<number>(30);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForecastData({ file });
    setError(null);
  };

  const handleFileUpload = () => {
    if (!forecastData.file) {
      setUploadMessage('Oops! Please upload a file to proceed!');
      setTimeout(() => setUploadMessage(null), 3000);
      return;
    }
    setUploadMessage('Success! Data uploaded—let’s proceed!');
    setTimeout(() => setUploadMessage(null), 3000);
    setIsUploadModalOpen(false);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['date', 'product', 'sales', 'quantity', 'cost', 'sku'],
      ['2025-03-01', 'Bundle 1-1', '1209650.62', '418', '5.00', 'B1-001'],
      ['2025-03-02', 'Bundle 4-1', '124322.73', '422.5', '6.00', 'B4-001'],
      ['2025-03-01', 'Component 2-1', '105526.38', '426', '4.00', 'C2-001'],
    ];
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-sales-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadForecastCSV = () => {
    if (!forecastResult) return;
    const csvData = [
      ['Date', 'Product', 'Forecasted Sales ($)', 'Quantity to Order', 'Estimated Cost ($)', 'SKU'],
      ...forecastResult.predictions.map(p => [
        p.date,
        p.product,
        p.sales.toFixed(2),
        p.quantity.toString(),
        p.cost ? (p.quantity * p.cost).toFixed(2) : '',
        p.sku || '',
      ]),
      ['Total', '', forecastResult.totalForecast.toFixed(2), '', '', ''],
    ];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-${selectedMethod}-${range}-${duration}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateForecast = () => {
    if (!forecastData.file || !selectedMethod) {
      setError('Please upload a file and select a method!');
      setLoading(false);
      return;
    }
    if (duration <= 0) {
      setError('Duration must be greater than 0!');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setForecastResult(null);

    try {
      const timeout = setTimeout(() => {
        setLoading(false);
        setError('Timeout! Please check your file and retry!');
      }, 10000);

      Papa.parse(forecastData.file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<any>) => {
          clearTimeout(timeout);
          const requiredColumns = ['date', 'product', 'sales', 'quantity'];
          const headers = result.meta.fields || [];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          if (missingColumns.length > 0) {
            setError(`Missing columns: ${missingColumns.join(', ')}. Use sample CSV!`);
            setLoading(false);
            return;
          }

          const salesData: Sale[] = result.data
            .map((row: any) => ({
              date: row.date?.trim() || '',
              product: row.product?.trim() || '',
              sales: parseFloat(row.sales),
              quantity: parseInt(row.quantity, 10),
              cost: parseFloat(row.cost) || undefined,
              sku: row.sku?.trim() || undefined,
            }))
            .filter(row => row.date && row.product && !isNaN(row.sales) && row.sales >= 0 && !isNaN(row.quantity));

          if (salesData.length === 0) {
            setError('No valid data! Please check your CSV!');
            setLoading(false);
            return;
          }

          try {
            const forecast = calculateForecast(salesData, selectedMethod, range, duration);
            setForecastResult(forecast);
          } catch (err) {
            setError(`Forecast calculation failed: ${err.message}. Please retry!`);
          } finally {
            setLoading(false);
          }
        },
        error: (err) => {
          clearTimeout(timeout);
          setError('CSV parsing error! Please check format and retry!');
          setLoading(false);
        },
      });
    } catch (err) {
      setError('Unexpected error during forecast generation: ' + err.message);
      setLoading(false);
    }
  };

  const calculateForecast = (data: Sale[], method: string, range: string, duration: number): ForecastResult => {
    const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastDate = new Date(sortedData[sortedData.length - 1]?.date);
    if (isNaN(lastDate.getTime())) {
      throw new Error('Invalid date in data! Please check your CSV.');
    }

    const step = range === 'day' ? 1 : range === 'weekly' ? 7 : 30;
    const forecastSteps = Math.ceil(duration / (range === 'day' ? 1 : range === 'weekly' ? 7 : 30));
    const forecastDates = Array.from({ length: forecastSteps }, (_, i) => {
      const date = new Date(lastDate);
      date.setDate(lastDate.getDate() + (i + 1) * step);
      return date.toISOString().split('T')[0];
    });

    const products = [...new Set(data.map(d => d.product))];
    if (products.length === 0) {
      throw new Error('No products found in data!');
    }

    let predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[] = [];
    let totalForecast = 0;
    let topPerformers: { product: string; totalSales: number; growthRate: number }[] = [];
    let actionPlan: string[] = [];
    let insights: string[] = [];

    const getTrend = (productData: Sale[]) => {
      const n = productData.length;
      if (n < 2) return { slope: 0, intercept: productData[0]?.sales || 0 };
      const x = productData.map((_, i) => i);
      const y = productData.map(d => d.sales);
      const xMean = x.reduce((a, b) => a + b, 0) / n;
      const yMean = y.reduce((a, b) => a + b, 0) / n;
      const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0);
      const denominator = x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0);
      const slope = denominator === 0 ? 0 : numerator / denominator;
      const intercept = yMean - slope * xMean;
      return { slope, intercept };
    };

    let trends: { product: string; slope: number; intercept: number; avgQuantity: number; avgCost?: number; sku?: string }[] = [];

    switch (method) {
      case 'historical-trend': {
        trends = products.map(product => {
          const productData = data.filter(d => d.product === product);
          const { slope, intercept } = getTrend(productData);
          const avgQuantity = productData.reduce((sum, d) => sum + d.quantity, 0) / productData.length || 1;
          const avgCost = productData.reduce((sum, d) => sum + (d.cost || 0), 0) / productData.length || undefined;
          const sku = productData[0]?.sku;
          return { product, slope, intercept, avgQuantity, avgCost, sku };
        });

        predictions = forecastDates.flatMap((date, i) =>
          trends.map(({ product, slope, intercept, avgQuantity, avgCost, sku }) => ({
            date,
            product,
            sales: Math.max(0, intercept + slope * (i + trends.length)),
            quantity: Math.round(avgQuantity * (1 + slope * i / 100)),
            cost: avgCost,
            sku,
          }))
        );
        break;
      }
      case 'seasonal-boost': {
        trends = products.map(product => {
          const productData = data.filter(d => d.product === product);
          const { slope, intercept } = getTrend(productData);
          const avgQuantity = productData.reduce((sum, d) => sum + d.quantity, 0) / productData.length || 1;
          const avgCost = productData.reduce((sum, d) => sum + (d.cost || 0), 0) / productData.length || undefined;
          const sku = productData[0]?.sku;
          return { product, slope, intercept, avgQuantity, avgCost, sku };
        });

        predictions = forecastDates.flatMap((date, i) => {
          const dayIndex = i + 1;
          const isSeasonalPeak = range === 'day' ? dayIndex % 7 === 0 : range === 'weekly' ? dayIndex % 4 === 0 : dayIndex % 2 === 0;
          const seasonalMultiplier = isSeasonalPeak ? 1.5 : 1.0;

          return trends.map(({ product, slope, intercept, avgQuantity, avgCost, sku }) => ({
            date,
            product,
            sales: Math.max(0, (intercept + slope * (i + trends.length)) * seasonalMultiplier),
            quantity: Math.round(avgQuantity * (1 + slope * i / 100) * seasonalMultiplier),
            cost: avgCost,
            sku,
          }));
        });
        break;
      }
      case 'growth-aggressive': {
        trends = products.map(product => {
          const productData = data.filter(d => d.product === product);
          const { slope, intercept } = getTrend(productData);
          const avgQuantity = productData.reduce((sum, d) => sum + d.quantity, 0) / productData.length || 1;
          const avgCost = productData.reduce((sum, d) => sum + (d.cost || 0), 0) / productData.length || undefined;
          const sku = productData[0]?.sku;
          return { product, slope, intercept, avgQuantity, avgCost, sku };
        });

        predictions = forecastDates.flatMap((date, i) =>
          trends.map(({ product, slope, intercept, avgQuantity, avgCost, sku }) => {
            const growthMultiplier = 1 + (i * 0.1);
            return {
              date,
              product,
              sales: Math.max(0, (intercept + slope * (i + trends.length)) * growthMultiplier),
              quantity: Math.round(avgQuantity * (1 + slope * i / 100) * growthMultiplier),
              cost: avgCost,
              sku,
            };
          })
        );
        break;
      }
      case 'product-breakout': {
        const productSales = products.map(product => {
          const productData = data.filter(d => d.product === product);
          const totalSales = productData.reduce((sum, d) => sum + d.sales, 0);
          return { product, totalSales };
        }).sort((a, b) => b.totalSales - a.totalSales);

        const topProducts = productSales.slice(0, Math.ceil(products.length * 0.3));
        const topProductNames = topProducts.map(p => p.product);

        trends = products.map(product => {
          const productData = data.filter(d => d.product === product);
          const { slope, intercept } = getTrend(productData);
          const avgQuantity = productData.reduce((sum, d) => sum + d.quantity, 0) / productData.length || 1;
          const avgCost = productData.reduce((sum, d) => sum + (d.cost || 0), 0) / productData.length || undefined;
          const sku = productData[0]?.sku;
          return { product, slope, intercept, avgQuantity, avgCost, sku };
        });

        predictions = forecastDates.flatMap((date, i) =>
          trends.map(({ product, slope, intercept, avgQuantity, avgCost, sku }) => {
            const isTopProduct = topProductNames.includes(product);
            const breakoutMultiplier = isTopProduct ? 1.8 : 0.5;
            return {
              date,
              product,
              sales: Math.max(0, (intercept + slope * (i + trends.length)) * breakoutMultiplier),
              quantity: Math.round(avgQuantity * (1 + slope * i / 100) * breakoutMultiplier),
              cost: avgCost,
              sku,
            };
          })
        );
        break;
      }
      default: {
        throw new Error(`Unsupported forecast method: ${method}`);
      }
    }

    totalForecast = predictions.reduce((sum, p) => sum + p.sales, 0);

    topPerformers = products.map(product => {
      const productPredictions = predictions.filter(p => p.product === product);
      const totalSales = productPredictions.reduce((sum, p) => sum + p.sales, 0);
      const firstSales = productPredictions[0]?.sales || 0;
      const lastSales = productPredictions[productPredictions.length - 1]?.sales || 0;
      const growthRate = firstSales !== 0 ? ((lastSales - firstSales) / firstSales) * 100 : 0;
      return { product, totalSales, growthRate };
    }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);

    actionPlan = generateActionPlan(predictions, forecastDates, range, topPerformers, selectedProduct);
    insights = generateInsights(predictions, forecastDates, range, topPerformers);

    return { method, totalForecast, topPerformers, predictions, actionPlan, insights };
  };

  const generateActionPlan = (predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[], forecastDates: string[], range: string, topPerformers: { product: string; totalSales: number; growthRate: number }[], selectedProduct: string | null) => {
    const plan: string[] = [];
    const steps = Math.min(5, forecastDates.length);

    for (let i = 0; i < steps; i++) {
      const date = forecastDates[i];
      const productData = selectedProduct
        ? predictions.filter(p => p.product === selectedProduct && p.date === date)
        : predictions.filter(p => p.date === date);

      if (productData.length === 0) {
        plan.push(`${range} ${i + 1} (${date}): No data for action planning!`);
        continue;
      }

      const dailySales = productData.reduce((sum, p) => sum + p.sales, 0);
      const dailyQuantity = productData.reduce((sum, p) => sum + p.quantity, 0);
      const targetProduct = selectedProduct || topPerformers[0]?.product || products[0];
      const growthRate = topPerformers.find(tp => tp.product === targetProduct)?.growthRate || 0;

      const actionEngine = {
        highGrowth: (product: string, quantity: number) => `Boost ${product} with a 20% ad campaign—stock ${quantity} units!`,
        moderateGrowth: (product: string, quantity: number) => `Offer a 10% discount on ${product}—prepare ${quantity} units!`,
        stable: (product: string, quantity: number) => `Maintain ${product} stock at ${quantity} units—monitor trends!`,
        declining: (product: string, quantity: number) => `Clear ${product} with a 15% discount—stock ${quantity} units!`,
      };

      const action = growthRate > 10 ? actionEngine.highGrowth : growthRate > 0 ? actionEngine.moderateGrowth : growthRate === 0 ? actionEngine.stable : actionEngine.declining;
      plan.push(`${range} ${i + 1} (${date}): ${action(targetProduct, dailyQuantity)}`);
    }

    return plan;
  };

  const generateInsights = (predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[], forecastDates: string[], range: string, topPerformers: { product: string; totalSales: number; growthRate: number }[]) => {
    const insights: string[] = [];
    const totalForecast = predictions.reduce((sum, p) => sum + p.sales, 0);
    insights.push(`Total forecast: $${totalForecast.toFixed(2)} over ${forecastDates.length} ${range}(s)!`);
    insights.push(`Top performer: ${topPerformers[0]?.product} with $${topPerformers[0]?.totalSales.toFixed(2)} and ${topPerformers[0]?.growthRate.toFixed(1)}% growth!`);

    const products = [...new Set(predictions.map(p => p.product))];
    products.forEach(product => {
      const productPreds = predictions.filter(p => p.product === product);
      const totalSales = productPreds.reduce((sum, p) => sum + p.sales, 0);
      const avgSales = totalSales / productPreds.length;
      const growthRate = topPerformers.find(tp => tp.product === product)?.growthRate || 0;
      const peakPred = productPreds.reduce((max, p) => p.sales > max.sales ? p : max, productPreds[0]);

      insights.push(`${product}: Forecasted $${totalSales.toFixed(2)}—${growthRate > 5 ? 'Push marketing!' : 'Maintain or adjust!'}`);
      if (peakPred) insights.push(`${product} peaks on ${peakPred.date} at $${peakPred.sales.toFixed(2)}—stock ${peakPred.quantity * 2} units!`);
    });

    return insights.slice(0, 10);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/tools');
  };

  try {
    return (
      <div className="bg-gray-900 min-h-screen text-white font-poppins relative overflow-hidden">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-star-twinkle"></div>
        {uploadMessage && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className={`p-4 rounded-xl shadow-lg ${uploadMessage.includes('Error') ? 'bg-red-600' : 'bg-green-600'} text-white flex items-center transition-all duration-300 hover:shadow-xl`}>
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {uploadMessage.includes('Error') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                )}
              </svg>
              <span className="text-sm font-semibold">{uploadMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden animate-gradient-x">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight text-white drop-shadow-lg">
              AI-Powered <span className="text-yellow-300">Sales Forecasting</span> <TrendingUp className="inline h-8 w-8 animate-pulse" />
            </h1>
            <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
              Unleash your sales potential with cutting-edge insights!
            </p>
            <div className="mt-4 bg-gray-800 bg-opacity-80 p-4 rounded-xl shadow-lg text-center max-w-2xl mx-auto transform hover:scale-105 transition-all duration-300">
              <p className="text-yellow-300 font-semibold text-lg">
                Your data, your control—no saving, pure analytics power!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
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
                  <a href="/sales-forecasting" className="group relative px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                    <TrendingUp className="w-4 h-4 mr-2" /> Sales Forecasting
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Hot</span>
                  </a>
                  <a href="/seo-analysis" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4 2-2.9 2-4z" />
                    </svg>
                    SEO Analysis
                  </a>
                  <a href="/pricing-optimizer" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-9c-1.657 0-3-.895-3-2s1.343-2 3-2 3.001.895 3.001 2-1.343 2-3.001 2z" />
                    </svg>
                    Pricing Optimizer
                  </a>
                  <a href="/email-campaign" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Campaign
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
                Sales Forecasting <TrendingUp className="inline h-6 w-6 text-yellow-300 ml-2 animate-pulse" />
              </h2>
              <button onClick={() => setIsUploadModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center text-sm">
                <Upload className="h-4 w-4 mr-1 animate-bounce" /> Load Sales Data
              </button>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-102 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-4">Load Your Sales Data <Upload className="inline h-5 w-5 text-yellow-300" /></h3>
                  <p className="text-gray-400 text-sm mb-4">Upload CSV: date, product, sales, quantity, cost (opt), sku (opt).</p>
                  <input type="file" accept=".csv" onChange={handleFileChange} className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm mb-4" />
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={downloadSampleCSV} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 flex items-center text-sm">
                      <Download className="h-4 w-4 mr-1" /> Sample CSV
                    </button>
                    <div className="flex space-x-2">
                      <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 text-sm">Cancel</button>
                      <button onClick={handleFileUpload} disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center text-sm disabled:bg-orange-300">
                        {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                        {loading ? 'Loading...' : 'Load'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-600 p-4 rounded-xl mb-6 text-white shadow-md animate-pulse">
                <p>{error}</p>
              </div>
            )}

            {/* Forecast Options */}
            {!forecastResult && (
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mb-6">Select Your Forecasting Method <PieChart className="inline h-5 w-5 text-yellow-300" /></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FORECAST_OPTIONS.map(option => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedMethod(option.id)}
                      className={`bg-gray-700 p-6 rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 ${selectedMethod === option.id ? 'border-yellow-300' : 'border-transparent hover:border-yellow-300'} hover:bg-gradient-to-br hover:from-gray-600 hover:to-gray-800`}
                    >
                      <div className="flex items-center justify-center mb-4">{option.icon}</div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2 text-center">{option.title}</h4>
                      <p className="text-gray-300 text-sm md:text-base text-center mb-4">{option.description}</p>
                      <ul className="text-gray-400 text-xs md:text-sm space-y-1">
                        {option.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-300 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Range and Duration Selection */}
                {selectedMethod && forecastData.file && (
                  <div className="mt-8 max-w-md mx-auto space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm md:text-base font-medium text-gray-300 mb-1">Forecast Range</label>
                        <select
                          value={range}
                          onChange={(e) => setRange(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm md:text-base"
                        >
                          {RANGE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm md:text-base font-medium text-gray-300 mb-1">Duration ({range}s)</label>
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm md:text-base"
                        />
                      </div>
                    </div>
                    <button
                      onClick={generateForecast}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg md:text-xl font-semibold disabled:bg-gray-500"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...
                        </>
                      ) : (
                        <>
                          Generate Forecast Now! <TrendingUp className="inline h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Forecast Results */}
            {forecastResult && (
              <div className="space-y-12">
                {/* Forecast Section */}
                <section>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">Forecast Overview <TrendingUp className="inline h-6 w-6 ml-2 animate-pulse" /></h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                      <h4 className="text-lg font-bold text-white mb-2">Total Forecast</h4>
                      <p className="text-2xl font-bold text-white drop-shadow-md">${forecastResult.totalForecast.toFixed(2)}</p>
                      <p className="text-sm text-gray-400">Over {duration} {range}(s)</p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt flex items-center justify-center">
                      <button
                        onClick={downloadForecastCSV}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full shadow-lg hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 flex items-center text-lg font-semibold transform hover:scale-105 animate-pulse"
                      >
                        <Download className="h-5 w-5 mr-2 animate-bounce" /> Download Forecast
                      </button>
                    </div>
                  </div>
                </section>

                {/* Rockstar Products Section */}
                {forecastResult.topPerformers && forecastResult.topPerformers.length > 0 ? (
                  <section>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">Top Performers <Star className="inline h-6 w-6 ml-2 animate-pulse" /></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {forecastResult.topPerformers.map((performer, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt"
                          data-tooltip={`Est. ROI: ${(performer.totalSales / (forecastResult.predictions.find(p => p.product === performer.product)?.cost || 1) * 100).toFixed(1)}%`}
                        >
                          <div className="flex items-center mb-2">
                            <Star className="text-yellow-300 mr-2 animate-pulse" />
                            <h4 className="text-lg font-bold text-white">Performer #{index + 1}: {performer.product}</h4>
                          </div>
                          <p className="text-gray-300 text-sm">Sales: ${performer.totalSales.toFixed(2)}</p>
                          <p className="text-gray-300 text-sm">Growth: {performer.growthRate.toFixed(1)}%</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <div className="text-gray-400">No top performers available.</div>
                )}

                {/* Action Plan Section */}
                {forecastResult.actionPlan && forecastResult.actionPlan.length > 0 ? (
                  <section>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">Action Plan <Target className="inline h-6 w-6 ml-2 animate-pulse" /></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {forecastResult.actionPlan.map((action, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt"
                        >
                          <div className="flex items-center mb-2">
                            <Target className="text-green-400 mr-2 animate-pulse" />
                            <h4 className="text-lg font-bold text-white">Action #{index + 1}</h4>
                          </div>
                          <p className="text-gray-300 text-sm">{action}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <div className="text-gray-400">No action plan available.</div>
                )}

                {/* Pro Insights Section */}
                {forecastResult.insights && forecastResult.insights.length > 0 ? (
                  <section>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                      Pro Insights{' '}
                      <svg className="inline h-6 w-6 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </h3>
                    <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                      <ul className="list-none text-gray-300 text-sm space-y-2">
                        {forecastResult.insights.map((insight, i) => (
                          <li key={i} className="flex items-center">
                            <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ) : (
                  <div className="text-gray-400">No insights available.</div>
                )}

                <button
                  onClick={() => {
                    setForecastResult(null);
                    setError(null);
                    setSelectedProduct(null);
                  }}
                  className="w-full max-w-md mx-auto px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm"
                >
                  Generate New Forecast <RefreshCw className="inline h-5 w-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (renderError) {
    console.error('Rendering Error:', renderError);
    return (
      <div className="bg-gray-900 min-h-screen text-white font-poppins p-8">
        <h1 className="text-3xl font-bold text-red-500">Error Rendering Page</h1>
        <p className="mt-4 text-gray-300">An unexpected error occurred while rendering the page: {renderError.message}</p>
        <p className="mt-2 text-gray-400">Please refresh the page and try again, or contact support if the issue persists.</p>
      </div>
    );
  }
}

// Add custom CSS for masonry, tilt, animations, and tooltips
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
  .masonry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }
  .card-tilt {
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
  }
  .card-tilt:hover {
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 255, 0, 0.3);
  }
  .card-tilt[data-tooltip]:hover:after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: 10;
    margin-bottom: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .card-tilt:hover[data-tooltip]:after {
    opacity: 1;
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradientShift 10s ease infinite;
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .animate-bounce {
    animation: bounce 1s infinite;
  }
  .animate-star-twinkle {
    animation: starTwinkle 5s infinite;
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }
  body { margin: 0; }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);