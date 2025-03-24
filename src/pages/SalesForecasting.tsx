import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, Loader2, Upload, Download, LogOut, BarChart2, LineChart, PieChart, AreaChart, Target, Star, Clock,
  ShoppingCart, MessageCircle, DollarSign, AlertTriangle, TrendingDown, Package, Megaphone, RefreshCw, ArrowRight,
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
  { id: 'historical-trend', title: 'Historical Trend Analysis', icon: <TrendingUp className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Leverage past e-commerce sales data for reliable business forecasts.', highlights: ['Trend-based', 'Reliable', 'Stable'] },
  { id: 'seasonal-boost', title: 'Seasonal Boost Forecasting', icon: <AreaChart className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Optimize pricing and stock for seasonal campaigns and ads.', highlights: ['Seasonal focus', 'Holiday-ready', 'Stock surge'] },
  { id: 'growth-aggressive', title: 'Aggressive Growth Prediction', icon: <LineChart className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Drive leads with digital marketing and advertising strategies.', highlights: ['Rapid growth', 'Ad-driven', 'High potential'] },
  { id: 'product-breakout', title: 'Product Breakout Insights', icon: <PieChart className="h-8 w-8 text-yellow-300 animate-pulse" />, description: 'Highlight top products for Shopify e-commerce success.', highlights: ['Top products', 'Profit focus', 'Niche strength'] },
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
      setUploadMessage('Oops! Please upload your e-commerce sales data!');
      setTimeout(() => setUploadMessage(null), 3000);
      return;
    }
    setUploadMessage('Success! Your sales data is ready for forecasting!');
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
      ['Date', 'Product', 'Forecasted Sales ($)', 'Quantity to Order', 'Estimated Cost ($)', 'SKU', 'Priority'],
      ['Summary', '', forecastResult.totalForecast.toFixed(2), '', '', '', ''],
      ...forecastResult.predictions.map(p => [
        p.date,
        p.product,
        p.sales.toFixed(2),
        p.quantity.toString(),
        p.cost ? (p.quantity * p.cost).toFixed(2) : '',
        p.sku || '',
        getPriorityFlag(p.quantity, forecastResult.predictions.filter(pred => pred.product === p.product && new Date(pred.date) < new Date(p.date)).map(pred => pred.quantity)) || '',
      ]),
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

  const getPriorityFlag = (quantity: number, prevQuantities: number[]) => {
    if (prevQuantities.length < 2) return '';
    const avgPrev = prevQuantities.reduce((a, b) => a + b, 0) / prevQuantities.length;
    return quantity > avgPrev * 1.5 ? 'Urgent' : '';
  };

  const generateForecast = () => {
    if (!forecastData.file || !selectedMethod) {
      setError('Please upload your e-commerce sales data and select a forecasting method!');
      setLoading(false);
      return;
    }
    if (duration <= 0) {
      setError('Duration must be greater than 0 for accurate business forecasting!');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setForecastResult(null);

    try {
      const timeout = setTimeout(() => {
        setLoading(false);
        setError('Timeout! Check your sales data and retry!');
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
            setError(`Missing columns: ${missingColumns.join(', ')}. Download our sample CSV!`);
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
            setError('No valid sales data! Check your CSV format!');
            setLoading(false);
            return;
          }

          try {
            const forecast = calculateForecast(salesData, selectedMethod, range, duration);
            setForecastResult(forecast);
          } catch (err) {
            setError(`Forecast calculation failed: ${err.message}. Retry with valid data!`);
          } finally {
            setLoading(false);
          }
        },
        error: (err) => {
          clearTimeout(timeout);
          setError('CSV parsing error! Ensure correct format!');
          setLoading(false);
        },
      });
    } catch (err) {
      setError('Unexpected error: ' + err.message);
      setLoading(false);
    }
  };

  const calculateForecast = (data: Sale[], method: string, range: string, duration: number): ForecastResult => {
    const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    if (isNaN(lastDate.getTime())) throw new Error('Invalid date in data!');

    const periodDays = range === 'day' ? 1 : range === 'weekly' ? 7 : 30;
    const forecastSteps = Math.ceil(duration / periodDays);
    const forecastDates = Array.from({ length: forecastSteps }, (_, i) => {
      const date = new Date(lastDate);
      date.setDate(lastDate.getDate() + (i + 1) * periodDays);
      return date.toISOString().split('T')[0];
    });

    const products = [...new Set(data.map(d => d.product))];
    if (products.length === 0) throw new Error('No products found in data!');

    let predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[] = [];
    let totalForecast = 0;
    let topPerformers: { product: string; totalSales: number; growthRate: number }[] = [];

    const daysInData = (new Date(sortedData[sortedData.length - 1].date) - new Date(sortedData[0].date)) / (1000 * 60 * 60 * 24) + 1;
    const getProductStats = (productData: Sale[]) => {
      const totalUnits = productData.reduce((sum, d) => sum + d.quantity, 0);
      const totalSales = productData.reduce((sum, d) => sum + d.sales, 0);
      const days = Math.max(1, daysInData);
      const avgUnitsPerDay = totalUnits / days;
      const avgSalesPerDay = totalSales / days;
      const avgCost = productData.some(d => d.cost) ? productData.reduce((sum, d) => sum + (d.cost || 0), 0) / productData.length : undefined;
      const sku = productData[0]?.sku;

      const unitsDayFactors = Array(7).fill(0).map((_, day) => {
        const dayData = productData.filter(d => new Date(d.date).getDay() === day);
        const dayAvgUnits = dayData.length ? dayData.reduce((sum, d) => sum + d.quantity, 0) / dayData.length : avgUnitsPerDay;
        return dayAvgUnits / (avgUnitsPerDay || 1);
      });

      const salesDayFactors = Array(7).fill(0).map((_, day) => {
        const dayData = productData.filter(d => new Date(d.date).getDay() === day);
        const dayAvgSales = dayData.length ? dayData.reduce((sum, d) => sum + d.sales, 0) / dayData.length : avgSalesPerDay;
        return dayAvgSales / (avgSalesPerDay || 1);
      });

      return { avgUnitsPerDay, avgSalesPerDay, avgCost, sku, unitsDayFactors, salesDayFactors };
    };

    const getSeasonalFactor = (date: string) => {
      const d = new Date(date);
      const month = d.getMonth();
      const day = d.getDate();
      if (month === 11 && day >= 23 && day <= 25) return 1.5; // Christmas boost
      if (month === 0 && day === 1) return 0.7; // New Year's Day dip
      return 1.0; // Default
    };

    switch (method) {
      case 'historical-trend': {
        predictions = products.flatMap(product => {
          const productData = data.filter(d => d.product === product);
          const { avgUnitsPerDay, avgSalesPerDay, avgCost, sku, unitsDayFactors, salesDayFactors } = getProductStats(productData);
          return forecastDates.map(date => {
            const dayOfWeek = new Date(date).getDay();
            const seasonalFactor = getSeasonalFactor(date);
            return {
              date,
              product,
              sales: avgSalesPerDay * salesDayFactors[dayOfWeek] * seasonalFactor * periodDays,
              quantity: Math.round(avgUnitsPerDay * unitsDayFactors[dayOfWeek] * seasonalFactor * periodDays),
              cost: avgCost,
              sku,
            };
          });
        });
        break;
      }

      case 'seasonal-boost': {
        predictions = products.flatMap(product => {
          const productData = data.filter(d => d.product === product);
          const { avgUnitsPerDay, avgSalesPerDay, avgCost, sku, unitsDayFactors, salesDayFactors } = getProductStats(productData);
          return forecastDates.map(date => {
            const dayOfWeek = new Date(date).getDay();
            const seasonalFactor = getSeasonalFactor(date);
            const boost = seasonalFactor > 1 ? 1.2 : seasonalFactor < 1 ? 0.9 : 1.0;
            return {
              date,
              product,
              sales: avgSalesPerDay * salesDayFactors[dayOfWeek] * seasonalFactor * boost * periodDays,
              quantity: Math.round(avgUnitsPerDay * unitsDayFactors[dayOfWeek] * seasonalFactor * boost * periodDays),
              cost: avgCost,
              sku,
            };
          });
        });
        break;
      }

      case 'growth-aggressive': {
        predictions = products.flatMap(product => {
          const productData = data.filter(d => d.product === product);
          const { avgUnitsPerDay, avgSalesPerDay, avgCost, sku, unitsDayFactors, salesDayFactors } = getProductStats(productData);
          return forecastDates.map((date, i) => {
            const dayOfWeek = new Date(date).getDay();
            const seasonalFactor = getSeasonalFactor(date);
            const growthFactor = Math.pow(1.01, (i + 1) * periodDays);
            return {
              date,
              product,
              sales: avgSalesPerDay * salesDayFactors[dayOfWeek] * seasonalFactor * growthFactor * periodDays,
              quantity: Math.round(avgUnitsPerDay * unitsDayFactors[dayOfWeek] * seasonalFactor * growthFactor * periodDays),
              cost: avgCost,
              sku,
            };
          });
        });
        break;
      }

      case 'product-breakout': {
        const productTotals = products.map(product => {
          const productData = data.filter(d => d.product === product);
          return { product, totalSales: productData.reduce((sum, d) => sum + d.sales, 0) };
        }).sort((a, b) => b.totalSales - a.totalSales);
        const topProducts = productTotals.slice(0, Math.ceil(products.length * 0.3)).map(p => p.product);

        predictions = products.flatMap(product => {
          const productData = data.filter(d => d.product === product);
          const { avgUnitsPerDay, avgSalesPerDay, avgCost, sku, unitsDayFactors, salesDayFactors } = getProductStats(productData);
          const multiplier = topProducts.includes(product) ? 1.2 : 0.9;
          return forecastDates.map(date => {
            const dayOfWeek = new Date(date).getDay();
            const seasonalFactor = getSeasonalFactor(date);
            return {
              date,
              product,
              sales: avgSalesPerDay * salesDayFactors[dayOfWeek] * seasonalFactor * multiplier * periodDays,
              quantity: Math.round(avgUnitsPerDay * unitsDayFactors[dayOfWeek] * seasonalFactor * multiplier * periodDays),
              cost: avgCost,
              sku,
            };
          });
        });
        break;
      }

      default:
        throw new Error(`Unsupported forecast method: ${method}`);
    }

    totalForecast = predictions.reduce((sum, p) => sum + p.sales, 0);
    topPerformers = products.map(product => {
      const productPredictions = predictions.filter(p => p.product === product);
      const totalSales = productPredictions.reduce((sum, p) => sum + p.sales, 0);
      const historicalSales = data.filter(d => d.product === product).reduce((sum, d) => sum + d.sales, 0);
      const growthRate = historicalSales > 0 ? ((totalSales - historicalSales) / historicalSales) * 100 : 0;
      return { product, totalSales, growthRate };
    }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);

    const actionPlan = generateActionPlan(predictions, forecastDates, range, topPerformers, null);
    const insights = generateInsights(predictions, forecastDates, range, topPerformers);

    return { method, totalForecast, topPerformers, predictions, actionPlan, insights };
  };

  const generateActionPlan = (
    predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[],
    forecastDates: string[],
    range: string,
    topPerformers: { product: string; totalSales: number; growthRate: number }[],
    selectedProduct: string | null
  ) => {
    const plan: string[] = [];
    let productsForAction: string[] = selectedProduct ? [selectedProduct] : topPerformers.map(tp => tp.product);
    const allProducts = Array.from(new Set(predictions.map(p => p.product)));
    for (const prod of allProducts) {
      if (!productsForAction.includes(prod)) {
        productsForAction.push(prod);
      }
      if (productsForAction.length >= 5) break;
    }
    while (productsForAction.length < 5) {
      productsForAction.push(productsForAction[0]);
    }
    productsForAction = productsForAction.slice(0, 5);

    const highGrowthActions = [
      `Boost {product} with YouTube ads and Snapchat ads through our digital marketing agency.`,
      `Launch a lead-generating campaign for {product} with video ads and affiliate marketing programs.`,
      `Optimize {product} pricing with search engine marketing and WhatsApp campaigns.`,
      `Drive {product} sales with a freelance web developer-designed Shopify e-commerce page.`,
      `Increase {product} visibility with backlinks and blog templates from our marketing agency.`,
    ];

    const moderateGrowthActions = [
      `Enhance {product} with SEO and digital ads for small franchise business growth.`,
      `Promote {product} via portfolio sites and advertising campaigns on Snapchat.`,
      `Improve {product} web page design with a freelancer site collaboration.`,
      `Market {product} using video ads and WhatsApp campaigns for lead generation.`,
      `Support {product} with web development services and affiliate marketing.`,
    ];

    const stableActions = [
      `Maintain {product} sales with consistent SEO and YouTube ads.`,
      `Stabilize {product} business with digital marketing agency insights and backlinks.`,
      `Sustain {product} via blog templates and search engine marketing efforts.`,
      `Keep {product} steady with advertising and portfolio sites promotion.`,
      `Ensure {product} longevity with Snapchat ads and web developer tweaks.`,
    ];

    const decliningActions = [
      `Revive {product} with aggressive YouTube ads and Snapchat campaigns.`,
      `Relaunch {product} using a freelance web developer and digital ads.`,
      `Boost {product} with SEO optimization and affiliate marketing programs.`,
      `Turn around {product} with pricing adjustments and WhatsApp campaigns.`,
      `Reenergize {product} via backlinks and video ads from our marketing agency.`,
    ];

    const usedHigh = new Set<number>();
    const usedModerate = new Set<number>();
    const usedStable = new Set<number>();
    const usedDeclining = new Set<number>();

    for (const product of productsForAction) {
      const productForecasts = predictions
        .filter(p => p.product === product)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (productForecasts.length === 0) {
        plan.push(`${product}: No forecast data available!`);
        continue;
      }
      const currentForecast = productForecasts[productForecasts.length - 1];
      const tp = topPerformers.find(tp => tp.product === product);
      const growthRate = tp ? tp.growthRate : 0;

      let candidateList: string[] = [];
      let usedSet: Set<number>;

      if (growthRate > 10) {
        candidateList = highGrowthActions;
        usedSet = usedHigh;
      } else if (growthRate > 0) {
        candidateList = moderateGrowthActions;
        usedSet = usedModerate;
      } else if (growthRate === 0) {
        candidateList = stableActions;
        usedSet = usedStable;
      } else {
        candidateList = decliningActions;
        usedSet = usedDeclining;
      }

      let selectedIndex: number | null = null;
      for (let i = 0; i < candidateList.length; i++) {
        if (!usedSet.has(i)) {
          selectedIndex = i;
          break;
        }
      }
      if (selectedIndex === null) {
        selectedIndex = Math.floor(Math.random() * candidateList.length);
      }
      usedSet.add(selectedIndex);
      const suggestion = candidateList[selectedIndex]
        .replace(/{product}/g, product)
        .replace(/{quantity}/g, currentForecast.quantity.toString());

      plan.push(`${product}: ${suggestion}`);
    }
    return plan;
  };

  const generateInsights = (predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[], forecastDates: string[], range: string, topPerformers: { product: string; totalSales: number; growthRate: number }[]) => {
    const insights: string[] = [];
    const products = [...new Set(predictions.map(p => p.product))];

    insights.push(`Total e-commerce forecast: $<TrendingUp className="inline h-4 w-4 text-green-400" /> ${predictions.reduce((sum, p) => sum + p.sales, 0).toFixed(2)} over ${forecastDates.length} ${range}(s)!`);
    insights.push(`Top business performer: <Star className="inline h-4 w-4 text-yellow-400" /> ${topPerformers[0]?.product} with $${topPerformers[0]?.totalSales.toFixed(2)} and ${topPerformers[0]?.growthRate.toFixed(1)}% growth!`);

    products.forEach(product => {
      const productPreds = predictions.filter(p => p.product === product);
      const totalSales = productPreds.reduce((sum, p) => sum + p.sales, 0);
      const avgSales = totalSales / productPreds.length;
      const growthRate = topPerformers.find(tp => tp.product === product)?.growthRate || 0;
      const peakDate = productPreds.reduce((max, p) => p.sales > max.sales ? p : max, productPreds[0]).date;
      const isSeasonal = productPreds.some(p => p.sales > avgSales * 1.2);
      const lowStockRisk = productPreds.some(p => p.quantity < 10);

      insights.push(`${product}: Forecasted sales $<TrendingUp className="inline h-4 w-4 text-green-400" /> ${totalSales.toFixed(2)}! ${growthRate > 5 ? 'Boost with digital ads!' : growthRate > 0 ? 'Maintain with SEO!' : 'Revive with campaigns!'}`);
      if (peakDate) insights.push(`Peak sales date: <Clock className="inline h-4 w-4 text-red-400" /> ${peakDate}! Optimize pricing now!`);
      if (isSeasonal) insights.push(`Seasonal opportunity: <AreaChart className="inline h-4 w-4 text-blue-400" /> ${product}! Use video ads for 20% more leads!`);
      if (lowStockRisk) insights.push(`Stock alert: <AlertTriangle className="inline h-4 w-4 text-red-500" /> ${product}! Order ${Math.max(...productPreds.map(p => p.quantity)) * 1.5} units!`);
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
              Intelligent <span className="text-yellow-300">Sales Forecasting</span> for E-commerce Entrepreneurs <TrendingUp className="inline h-8 w-8 animate-pulse" />
            </h1>
            <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
              Unlock your DTC business potential with advanced sales insights, SEO optimization, and digital marketing tools!
            </p>
            <div className="mt-4 bg-gray-800 bg-opacity-80 p-4 rounded-xl shadow-lg text-center max-w-2xl mx-auto transform hover:scale-105 transition-all duration-300">
              <p className="text-yellow-300 font-semibold text-lg">
                Empower your Shopify e-commerce with our marketing agency—no data saved, just pure analytics!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full">
                <h2 className="text-lg font-bold text-yellow-300 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Digital Marketing Tools for Entrepreneurs
                </h2>
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
                    <DollarSign className="w-4 h-4 mr-2" /> Pricing Optimizer
                  </a>
                  <a href="/email-campaign" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                    <MessageCircle className="w-4 h-4 mr-2" /> Email Campaigns
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
                Sales Forecasting for Your E-commerce Business <TrendingUp className="inline h-6 w-6 text-yellow-300 ml-2 animate-pulse" />
              </h2>
              <button onClick={() => setIsUploadModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center text-sm">
                <Upload className="h-4 w-4 mr-1 animate-bounce" alt="Upload sales data" /> Load Sales Data
              </button>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-102 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-4">Upload Your E-commerce Sales Data <Upload className="inline h-5 w-5 text-yellow-300" alt="Upload icon" /></h3>
                  <p className="text-gray-400 text-sm mb-4">CSV format: date, product, sales, quantity, cost (optional), sku (optional).</p>
                  <input type="file" accept=".csv" onChange={handleFileChange} className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm mb-4 pointer-events-auto" />
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={downloadSampleCSV} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 flex items-center text-sm">
                      <Download className="h-4 w-4 mr-1" alt="Download sample CSV" /> Sample CSV
                    </button>
                    <div className="flex space-x-2">
                      <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 text-sm">Cancel</button>
                      <button onClick={handleFileUpload} disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center text-sm disabled:bg-orange-300">
                        {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" alt="Loading" /> : <Upload className="h-4 w-4 mr-1" alt="Upload" />}
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

            {/* Forecast Options and Inputs */}
            {!forecastResult && (
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mb-6">Choose a Forecasting Method for Your Business <PieChart className="inline h-5 w-5 text-yellow-300" alt="Pie chart icon" /></h3>
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

                {/* Range and Duration Inputs - Always Rendered When Method and File are Selected */}
                {selectedMethod && forecastData.file && (
                  <div className="mt-8 max-w-md mx-auto space-y-4 relative z-20">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label htmlFor="forecast-range" className="block text-sm md:text-base font-medium text-gray-300 mb-1">Forecast Range</label>
                        <select
                          id="forecast-range"
                          value={range}
                          onChange={(e) => setRange(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm md:text-base cursor-pointer pointer-events-auto"
                          tabIndex={0}
                        >
                          {RANGE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label htmlFor="forecast-duration" className="block text-sm md:text-base font-medium text-gray-300 mb-1">Duration ({range}s)</label>
                        <input
                          id="forecast-duration"
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm md:text-base pointer-events-auto"
                          tabIndex={0}
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
                          <Loader2 className="h-6 w-6 animate-spin mr-2" alt="Loading" /> Loading...
                        </>
                      ) : (
                        <>
                          Generate Forecast Now! <TrendingUp className="inline h-5 w-5 ml-2" alt="Trending up" />
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
                <section>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                    E-commerce Forecast Overview <TrendingUp className="inline h-6 w-6 ml-2 animate-pulse" alt="Trending up icon" />
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">Total Sales Forecast</h4>
                        <p className="text-2xl font-bold text-white drop-shadow-md">${forecastResult.totalForecast.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">Over {duration} {range}(s)</p>
                      </div>
                      <button
                        onClick={downloadForecastCSV}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center text-xl font-bold animate-gradient-x border-2 border-yellow-300 hover:border-yellow-400 whitespace-nowrap"
                      >
                        <Download className="h-6 w-6 mr-2 animate-bounce" alt="Download forecast" /> Get Forecast
                      </button>
                    </div>
                  </div>
                </section>

                {forecastResult.topPerformers && forecastResult.topPerformers.length > 0 ? (
                  <section>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">Top Performing Products <Star className="inline h-6 w-6 ml-2 animate-pulse" alt="Star icon" /></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {forecastResult.topPerformers.map((performer, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt"
                        >
                          <div className="flex items-center mb-2">
                            <Star className="text-yellow-300 mr-2 animate-pulse" alt="Star" />
                            <h4 className="text-lg font-bold text-white">#{index + 1}: {performer.product}</h4>
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

                {forecastResult.actionPlan && forecastResult.actionPlan.length > 0 ? (
                  <section>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">Action Plan for Growth <Target className="inline h-6 w-6 ml-2 animate-pulse" alt="Target icon" /></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {forecastResult.actionPlan.map((action, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt"
                        >
                          <div className="flex items-center mb-2">
                            <Target className="text-green-400 mr-2 animate-pulse" alt="Target" />
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

                {forecastResult.insights && forecastResult.insights.length > 0 ? (
                  <section>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                      Pro Insights for Your Business{' '}
                      <svg className="inline h-6 w-6 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </h3>
                    <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                      <ul className="list-none text-gray-300 text-sm space-y-2">
                        {forecastResult.insights.map((insight, i) => (
                          <li key={i} className="flex items-center">
                            <ArrowRight className="h-4 w-4 text-green-400 mr-2" alt="Arrow right" />
                            <span dangerouslySetInnerHTML={{ __html: insight }} />
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
                  Generate New Forecast <RefreshCw className="inline h-5 w-5 ml-2" alt="Refresh" />
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
        <p className="mt-4 text-gray-300">An unexpected error occurred: {renderError.message}</p>
        <p className="mt-2 text-gray-400">Please refresh or contact support.</p>
      </div>
    );
  }
}

// Updated CSS with explicit pointer-events fix
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .masonry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; padding: 1rem; }
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
  /* Ensure inputs are clickable */
  select, input[type="number"] { pointer-events: auto !important; }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);