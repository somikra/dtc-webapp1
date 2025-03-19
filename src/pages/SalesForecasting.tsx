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
} from 'lucide-react';
import Papa from 'papaparse';

interface Sale {
  date: string;
  product: string;
  sales: number;
  quantity: number;
}

interface ForecastData {
  file: File | null;
}

interface ForecastResult {
  method: string;
  totalForecast: number;
  topPerformers: { product: string; totalSales: number; growthRate: number }[];
  actionPlan: string[];
  insights: string[];
}

const FORECAST_OPTIONS = [
  { id: 'historical-trend', title: 'Historical Trend', icon: <TrendingUp className="h-8 w-8 text-yellow-300" />, description: 'Predicts based on past sales trends.', highlights: ['Trend-based', 'Steady growth', 'Reliable'] },
  { id: 'seasonal-boost', title: 'Seasonal Boost', icon: <AreaChart className="h-8 w-8 text-yellow-300" />, description: 'Adjusts for seasonal patterns.', highlights: ['Seasonal focus', 'Holiday-ready', 'Inventory boost'] },
  { id: 'growth-aggressive', title: 'Growth Aggressive', icon: <LineChart className="h-8 w-8 text-yellow-300" />, description: 'Forecasts bold growth trajectories.', highlights: ['Rapid scaling', 'Campaign-driven', 'High reward'] },
  { id: 'product-breakout', title: 'Product Breakout', icon: <PieChart className="h-8 w-8 text-yellow-300" />, description: 'Boosts top-performing products.', highlights: ['Top sellers', 'Profit-focused', 'Niche power'] },
];

const RANGE_OPTIONS = [
  { value: 'daily', label: 'Daily' },
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
  const [range, setRange] = useState<string>('daily');
  const [duration, setDuration] = useState<number>(30);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForecastData({ file });
    setError(null);
  };

  const handleFileUpload = () => {
    if (!forecastData.file) {
      setUploadMessage('Please select a file to load');
      setTimeout(() => setUploadMessage(null), 3000);
      return;
    }
    setUploadMessage('Sales data loaded successfully!');
    setTimeout(() => setUploadMessage(null), 3000);
    setIsUploadModalOpen(false);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['date', 'product', 'sales', 'quantity'],
      ['2025-01-01', 'Eco-Friendly Tumbler', '150', '3'],
      ['2025-01-02', 'Eco-Friendly Tumbler', '160', '4'],
      ['2025-01-01', 'Bamboo Toothbrush', '80', '2'],
      ['2025-01-02', 'Bamboo Toothbrush', '90', '3'],
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
      ['Date', 'Product', 'Forecasted Sales', 'Forecasted Quantity'],
      ['Total Forecast', '', forecastResult.totalForecast.toFixed(2), ''],
      ...forecastResult.topPerformers.flatMap(performer =>
        [['', performer.product, performer.totalSales.toFixed(2), '']]
      ),
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
      setError('Please upload a file and select a forecast method.');
      return;
    }
    if (duration <= 0) {
      setError('Please enter a valid duration greater than 0.');
      return;
    }

    setLoading(true);
    setError(null);
    setForecastResult(null);

    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Forecast generation timed out. Please check your file and try again.');
    }, 10000);

    Papa.parse(forecastData.file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<any>) => {
        clearTimeout(timeout);
        console.log('Parsed CSV Data:', result.data);

        const requiredColumns = ['date', 'product', 'sales', 'quantity'];
        const headers = result.meta.fields || [];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}. Please use the sample CSV format.`);
          setLoading(false);
          return;
        }

        const salesData: Sale[] = result.data
          .map((row: any) => ({
            date: row.date?.trim() || '',
            product: row.product?.trim() || '',
            sales: parseFloat(row.sales),
            quantity: parseInt(row.quantity, 10),
          }))
          .filter(row => 
            row.date && 
            row.product && 
            !isNaN(row.sales) && 
            row.sales >= 0 && 
            !isNaN(row.quantity)
          );

        console.log('Filtered Sales Data:', salesData);

        if (salesData.length === 0) {
          setError('No valid sales data found. Ensure your CSV has valid date, product, sales (>=0), and quantity values.');
          setLoading(false);
          return;
        }

        try {
          const forecast = calculateForecast(salesData, selectedMethod, range, duration);
          console.log('Generated Forecast:', forecast);
          setForecastResult(forecast);
        } catch (err) {
          console.error('Forecast Calculation Error:', err);
          setError(`Error calculating forecast: ${err.message}. Please check your data and try again.`);
        }
        setLoading(false);
      },
      error: (err) => {
        clearTimeout(timeout);
        console.error('Papa Parse Error:', err);
        setError('Error parsing your CSV. Check the format (date, product, sales, quantity) and try again.');
        setLoading(false);
      },
    });
  };

  const calculateForecast = (data: Sale[], method: string, range: string, duration: number): ForecastResult => {
    const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    if (isNaN(lastDate.getTime())) throw new Error('Invalid last date in data');

    const step = range === 'daily' ? 1 : range === 'weekly' ? 7 : 30;
    const forecastSteps = Math.ceil(duration / (range === 'daily' ? 1 : range === 'weekly' ? 7 : 30));
    const forecastDates = Array.from({ length: forecastSteps }, (_, i) => {
      const date = new Date(lastDate);
      date.setDate(lastDate.getDate() + (i + 1) * step);
      return date.toISOString().split('T')[0];
    });

    const products = [...new Set(data.map(d => d.product))];
    let predictions: { date: string; product: string; sales: number; quantity: number }[] = [];
    let totalForecast = 0;
    let topPerformers: { product: string; totalSales: number; growthRate: number }[] = [];
    let actionPlan: string[] = [];
    let insights: string[] = [];

    const getTrend = (productData: Sale[]) => {
      const n = productData.length;
      if (n < 2) {
        const avgSales = productData[0]?.sales || 0;
        return { slope: 0, intercept: avgSales };
      }
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

    switch (method) {
      case 'historical-trend': {
        const trends = products.map(product => {
          const productData = data.filter(d => d.product === product);
          const { slope, intercept } = getTrend(productData);
          const avgQuantity = productData.reduce((sum, d) => sum + d.quantity, 0) / productData.length || 1;
          return { product, slope, intercept, avgQuantity };
        });

        predictions = forecastDates.flatMap((date, i) =>
          trends.map(({ product, slope, intercept, avgQuantity }) => ({
            date,
            product,
            sales: Math.max(0, intercept + slope * (i + trends.length)),
            quantity: Math.round(avgQuantity * (1 + slope * i / 100)),
          }))
        );

        totalForecast = predictions.reduce((sum, p) => sum + p.sales, 0);
        topPerformers = products.map(product => {
          const productPredictions = predictions.filter(p => p.product === product);
          const totalSales = productPredictions.reduce((sum, p) => sum + p.sales, 0);
          const growthRate = trends.find(t => t.product === product)!.slope / trends.find(t => t.product === product)!.intercept * 100 || 0;
          return { product, totalSales, growthRate };
        }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);

        actionPlan = generateActionPlan(predictions, forecastDates, range, topPerformers);
        insights = [
          `Total forecast: $${totalForecast.toFixed(2)} over ${duration} ${range}(s).`,
          'Adjust inventory based on growth trends.',
          'Target top performers with focused promotions.',
        ];
        break;
      }
      case 'seasonal-boost': {
        const monthlyTrends = products.map(product => {
          const productData = data.filter(d => d.product === product);
          return Array.from({ length: 12 }, (_, month) => {
            const monthData = productData.filter(d => new Date(d.date).getMonth() === month);
            const totalSales = monthData.reduce((sum, d) => sum + d.sales, 0);
            const totalQuantity = monthData.reduce((sum, d) => sum + d.quantity, 0);
            const days = monthData.length || 1;
            return { month, avgSales: totalSales / days || 0, avgQuantity: totalQuantity / days || 1 };
          });
        });

        predictions = forecastDates.flatMap(date => {
          const month = new Date(date).getMonth();
          return products.map((product, i) => {
            const { avgSales, avgQuantity } = monthlyTrends[i][month];
            const baseSales = avgSales * 1.2;
            return { date, product, sales: baseSales, quantity: Math.round(avgQuantity * 1.2) };
          });
        });

        totalForecast = predictions.reduce((sum, p) => sum + p.sales, 0);
        topPerformers = products.map(product => {
          const productPredictions = predictions.filter(p => p.product === product);
          const totalSales = productPredictions.reduce((sum, p) => sum + p.sales, 0);
          const growthRate = 20; // Seasonal boost percentage
          return { product, totalSales, growthRate };
        }).sort((a, b) => b.totalForecast - a.totalSales).slice(0, 3);

        actionPlan = generateActionPlan(predictions, forecastDates, range, topPerformers);
        insights = [
          `Seasonal forecast: $${totalForecast.toFixed(2)} over ${duration} ${range}(s).`,
          'Prepare for seasonal peaks with extra stock.',
          'Align promotions with high-demand months.',
        ];
        break;
      }
      case 'growth-aggressive': {
        const growthRate = 0.01;
        const lastSales = products.map(product => {
          const productData = data.filter(d => d.product === product);
          const lastSale = productData[productData.length - 1];
          return { product, lastSales: lastSale.sales, lastQuantity: lastSale.quantity };
        });

        predictions = forecastDates.flatMap((date, i) =>
          lastSales.map(({ product, lastSales, lastQuantity }) => ({
            date,
            product,
            sales: lastSales * Math.pow(1 + growthRate, i * step),
            quantity: Math.round(lastQuantity * Math.pow(1 + growthRate, i * step)),
          }))
        );

        totalForecast = predictions.reduce((sum, p) => sum + p.sales, 0);
        topPerformers = products.map(product => {
          const productPredictions = predictions.filter(p => p.product === product);
          const totalSales = productPredictions.reduce((sum, p) => sum + p.sales, 0);
          const growthRatePercent = (Math.pow(1 + growthRate, forecastSteps * step) - 1) * 100;
          return { product, totalSales, growthRate: growthRatePercent };
        }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);

        actionPlan = generateActionPlan(predictions, forecastDates, range, topPerformers);
        insights = [
          `Aggressive forecast: $${totalForecast.toFixed(2)} over ${duration} ${range}(s).`,
          'Scale ad spend to match growth projections.',
          'Increase stock proactively for high-growth periods.',
        ];
        break;
      }
      case 'product-breakout': {
        const topProducts = products.map(product => {
          const productData = data.filter(d => d.product === product);
          return { product, totalSales: productData.reduce((sum, d) => sum + d.sales, 0) };
        }).sort((a, b) => b.totalSales - a.totalSales).slice(0, Math.ceil(products.length / 2));

        const trends = topProducts.map(({ product }) => {
          const productData = data.filter(d => d.product === product);
          const { slope, intercept } = getTrend(productData);
          const avgQuantity = productData.reduce((sum, d) => sum + d.quantity, 0) / productData.length || 1;
          return { product, slope: slope * 1.5, intercept, avgQuantity };
        });

        predictions = forecastDates.flatMap((date, i) =>
          trends.map(({ product, slope, intercept, avgQuantity }) => ({
            date,
            product,
            sales: Math.max(0, intercept + slope * (i + trends.length)),
            quantity: Math.round(avgQuantity * (1 + slope * i / 100)),
          }))
        );

        totalForecast = predictions.reduce((sum, p) => sum + p.sales, 0);
        topPerformers = trends.map(({ product }) => {
          const productPredictions = predictions.filter(p => p.product === product);
          const totalSales = productPredictions.reduce((sum, p) => sum + p.sales, 0);
          const growthRate = trends.find(t => t.product === product)!.slope / trends.find(t => t.product === product)!.intercept * 100 * 1.5 || 0;
          return { product, totalSales, growthRate };
        }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);

        actionPlan = generateActionPlan(predictions, forecastDates, range, topPerformers);
        insights = [
          `Top products forecast: $${totalForecast.toFixed(2)} over ${duration} ${range}(s).`,
          'Focus marketing on top-performing products.',
          'Consider bundling high-growth items.',
        ];
        break;
      }
    }

    return { method, totalForecast, topPerformers, actionPlan, insights };
  };

  const generateActionPlan = (predictions: { date: string; product: string; sales: number; quantity: number }[], forecastDates: string[], range: string, topPerformers: { product: string; totalSales: number; growthRate: number }[]) => {
    const plan: string[] = [];
    const steps = Math.min(5, forecastDates.length); // Limit to 5 steps or fewer

    for (let i = 0; i < steps; i++) {
      const date = forecastDates[i];
      const dailySales = predictions.filter(p => p.date === date).reduce((sum, p) => sum + p.sales, 0);
      const dailyQuantity = Math.round(dailySales / 50); // Rough units based on sales
      const topProduct = topPerformers[0]?.product || 'top products';
      const growthTrend = topPerformers[0]?.growthRate || 0;

      let action = `${range} ${i + 1} (${date}): `;
      if (growthTrend > 5) {
        action += `Stock ${dailyQuantity} units of ${topProduct}, increase ad spend by 10% to capitalize on growth.`;
      } else if (growthTrend > 0) {
        action += `Stock ${dailyQuantity} units of ${topProduct}, consider a 5% off promo to boost sales.`;
      } else if (growthTrend <= 0) {
        action += `Stock ${dailyQuantity / 2} units of ${topProduct}, clear inventory with a 10% discount if sales stagnate.`;
      }
      plan.push(action);
    }

    return plan;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/tools');
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {uploadMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`p-4 rounded-lg shadow-lg ${uploadMessage.includes('Error') ? 'bg-red-600' : 'bg-green-600'} text-white flex items-center`}>
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
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            AI-Powered <span className="text-yellow-300">Sales Forecasting</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Crush uncertainty with forecasts that fuel your DTC growth!
          </p>
          <div className="mt-4 bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
            <p className="text-yellow-300 font-semibold text-lg">
              🔥 Your Data, Your Control: We don’t save a thing—forecast with total peace of mind! 🔥
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
                <a href="/tools-dashboard" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <BarChart2 className="w-4 h-4 mr-2" /> Sales Dashboard
                </a>
                <a href="/sales-forecasting" className="group relative px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <TrendingUp className="w-4 h-4 mr-2" /> Sales Forecasting
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Hot</span>
                </a>
                <a href="/seo-analysis" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4 2-2.9 2-4z" />
                  </svg>
                  SEO Analysis
                </a>
                <a href="/pricing-optimizer" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-9c-1.657 0-3-.895-3-2s1.343-2 3-2 3.001.895 3.001 2-1.343 2-3.001 2z" />
                  </svg>
                  Pricing Optimizer
                </a>
                <a href="/email-campaign" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Campaign
                </a>
              </div>
            </div>
            <button onClick={handleSignOut} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 flex items-center text-sm font-semibold transform hover:scale-105 flex-shrink-0">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Sales Forecasting</h2>
            <button onClick={() => setIsUploadModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center text-sm">
              <Upload className="h-4 w-4 mr-1" /> Load Sales Data
            </button>
          </div>

          {/* Upload Modal */}
          {isUploadModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-white mb-4">Load Your Sales Data</h3>
                <p className="text-gray-400 text-sm mb-4">Upload a CSV with columns: date, product, sales, quantity.</p>
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
            <div className="bg-red-600 p-4 rounded-lg mb-6 text-white">
              <p>{error}</p>
            </div>
          )}

          {/* Forecast Options */}
          {!forecastResult && (
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Choose Your Forecast Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FORECAST_OPTIONS.map(option => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedMethod(option.id)}
                    className={`bg-gray-700 p-6 rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 ${selectedMethod === option.id ? 'border-yellow-300' : 'border-transparent hover:border-yellow-300'}`}
                  >
                    <div className="flex items-center justify-center mb-4">{option.icon}</div>
                    <h4 className="text-lg font-bold text-white mb-2 text-center">{option.title}</h4>
                    <p className="text-gray-300 text-sm text-center mb-4">{option.description}</p>
                    <ul className="text-gray-400 text-xs space-y-1">
                      {option.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-300 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">Forecast Range</label>
                      <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      >
                        {RANGE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Duration ({range}s)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                    </div>
                  </div>
                  <button
                    onClick={generateForecast}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full hover:from-orange-600 hover:to-yellow-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg font-semibold disabled:bg-gray-500"
                  >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : 'Generate Forecast Now'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Forecast Results */}
          {forecastResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Forecast Tile */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Total Forecast</h3>
                <p className="text-2xl font-bold text-white">${forecastResult.totalForecast.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Over {duration} {range}(s)</p>
              </div>

              {/* Top Performers Tile */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Top Performers</h3>
                {forecastResult.topPerformers.length > 0 ? (
                  <ul className="space-y-2">
                    {forecastResult.topPerformers.map((performer, i) => (
                      <li key={i} className="text-gray-300">
                        <span className="font-bold">{performer.product}</span><br />
                        Sales: ${performer.totalSales.toFixed(2)}<br />
                        Growth: {performer.growthRate.toFixed(1)}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No top performers identified.</p>
                )}
              </div>

              {/* Action Plan Tile */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Action Plan</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                  {forecastResult.actionPlan.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              {/* Insights Tile */}
              <div className="md:col-span-2 lg:col-span-3 bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Insights</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                  {forecastResult.insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <button onClick={downloadForecastCSV} className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center text-sm shadow-lg hover:shadow-xl transition-all duration-300">
                    <Download className="h-4 w-4 mr-1" /> Download Forecast
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setForecastResult(null);
                  setError(null);
                }}
                className="md:col-span-2 lg:col-span-3 w-full max-w-md mx-auto px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm"
              >
                Try Another Forecast
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}