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
    console.log('Starting generateForecast...');
    if (!forecastData.file || !selectedMethod) {
      console.log('Validation failed: Missing file or method');
      setError('Please upload a file and select a method!');
      setLoading(false);
      return;
    }
    if (duration <= 0) {
      console.log('Validation failed: Invalid duration');
      setError('Duration must be greater than 0!');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setForecastResult(null);
    console.log('Set initial state: loading=true, error=null, forecastResult=null');

    try {
      const timeout = setTimeout(() => {
        console.log('Timeout triggered');
        setLoading(false);
        setError('Timeout! Please check your file and retry!');
      }, 10000);

      console.log('Starting Papa.parse...');
      Papa.parse(forecastData.file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<any>) => {
          clearTimeout(timeout);
          console.log('Papa.parse completed. Parsed CSV Data:', result.data);

          const requiredColumns = ['date', 'product', 'sales', 'quantity'];
          const headers = result.meta.fields || [];
          console.log('Headers found:', headers);
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          if (missingColumns.length > 0) {
            console.log('Missing columns:', missingColumns);
            setError(`Missing columns: ${missingColumns.join(', ')}. Use sample CSV!`);
            setLoading(false);
            return;
          }

          const salesData: Sale[] = result.data
            .map((row: any) => {
              console.log('Processing row:', row);
              return {
                date: row.date?.trim() || '',
                product: row.product?.trim() || '',
                sales: parseFloat(row.sales),
                quantity: parseInt(row.quantity, 10),
                cost: parseFloat(row.cost) || undefined,
                sku: row.sku?.trim() || undefined,
              };
            })
            .filter(row => {
              const isValid = row.date && row.product && !isNaN(row.sales) && row.sales >= 0 && !isNaN(row.quantity);
              console.log('Row validation:', row, 'isValid:', isValid);
              return isValid;
            });

          console.log('Filtered Sales Data:', salesData);

          if (salesData.length === 0) {
            console.log('No valid data after filtering');
            setError('No valid data! Please check your CSV!');
            setLoading(false);
            return;
          }

          try {
            console.log('Calling calculateForecast...');
            const forecast = calculateForecast(salesData, selectedMethod, range, duration);
            console.log('Generated Forecast:', forecast);
            setForecastResult(forecast);
          } catch (err) {
            console.error('Forecast Calculation Error:', err);
            setError(`Forecast calculation failed: ${err.message}. Please retry!`);
          } finally {
            setLoading(false);
            console.log('Set loading=false');
          }
        },
        error: (err) => {
          clearTimeout(timeout);
          console.error('Papa.parse Error:', err);
          setError('CSV parsing error! Please check format and retry!');
          setLoading(false);
        },
      });
    } catch (err) {
      console.error('Generate Forecast Error:', err);
      setError('Unexpected error during forecast generation: ' + err.message);
      setLoading(false);
    }
  };

  const calculateForecast = (data: Sale[], method: string, range: string, duration: number): ForecastResult => {
    console.log('Starting calculateForecast with data:', data);
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
    console.log('Forecast dates:', forecastDates);
  
    const products = [...new Set(data.map(d => d.product))];
    if (products.length === 0) throw new Error('No products found in data!');
  
    let predictions: { date: string; product: string; sales: number; quantity: number; cost?: number; sku?: string }[] = [];
    let totalForecast = 0;
    let topPerformers: { product: string; totalSales: number; growthRate: number }[] = [];
  
    // Calculate historical daily averages and day-of-week patterns.
    const daysInData = (new Date(sortedData[sortedData.length - 1].date) - new Date(sortedData[0].date)) / (1000 * 60 * 60 * 24) + 1;
    const getProductStats = (productData: Sale[]) => {
      const totalUnits = productData.reduce((sum, d) => sum + d.quantity, 0);
      const totalSales = productData.reduce((sum, d) => sum + d.sales, 0);
      const days = Math.max(1, daysInData);
      const avgUnitsPerDay = totalUnits / days;
      const avgSalesPerDay = totalSales / days;
      const avgCost = productData.some(d => d.cost) ? productData.reduce((sum, d) => sum + (d.cost || 0), 0) / productData.length : undefined;
      const sku = productData[0]?.sku;
  
      // Units-based day factors.
      const unitsDayFactors = Array(7).fill(0).map((_, day) => {
        const dayData = productData.filter(d => new Date(d.date).getDay() === day);
        const dayAvgUnits = dayData.length ? dayData.reduce((sum, d) => sum + d.quantity, 0) / dayData.length : avgUnitsPerDay;
        return dayAvgUnits / (avgUnitsPerDay || 1);
      });
  
      // Sales-based day factors.
      const salesDayFactors = Array(7).fill(0).map((_, day) => {
        const dayData = productData.filter(d => new Date(d.date).getDay() === day);
        const dayAvgSales = dayData.length ? dayData.reduce((sum, d) => sum + d.sales, 0) / dayData.length : avgSalesPerDay;
        return dayAvgSales / (avgSalesPerDay || 1);
      });
  
      return { avgUnitsPerDay, avgSalesPerDay, avgCost, sku, unitsDayFactors, salesDayFactors };
    };
  
    // Seasonal adjustments (e.g., December holidays)
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
            // Compound growth: applying a 1% daily growth rate compounded over (i+1)*periodDays days
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
    console.log('Total forecast:', totalForecast);
  
    topPerformers = products.map(product => {
      const productPredictions = predictions.filter(p => p.product === product);
      const totalSales = productPredictions.reduce((sum, p) => sum + p.sales, 0);
      const historicalSales = data.filter(d => d.product === product).reduce((sum, d) => sum + d.sales, 0);
      const growthRate = historicalSales > 0 ? ((totalSales - historicalSales) / historicalSales) * 100 : 0;
      return { product, totalSales, growthRate };
    }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 3);
    console.log('Top performers:', topPerformers);
  
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
    // If a product is selected, use only that one; otherwise, pick up to 5 distinct products.
    let productsForAction: string[] = [];
    if (selectedProduct) {
      productsForAction = [selectedProduct];
    } else {
      productsForAction = topPerformers.map(tp => tp.product);
      const allProducts = Array.from(new Set(predictions.map(p => p.product)));
      for (const prod of allProducts) {
        if (!productsForAction.includes(prod)) {
          productsForAction.push(prod);
        }
        if (productsForAction.length >= 5) break;
      }
    }
    while (productsForAction.length < 5) {
      productsForAction.push(productsForAction[0]);
    }
    productsForAction = productsForAction.slice(0, 5);
  
    // Define 20 unique suggestions per category.
    const highGrowthActions = [
      `Exploit the explosive momentum for {product} by launching a multi-channel PPC blitz and securing exclusive influencer endorsements.`,
      `Accelerate growth for {product} with a limited-edition bundle and a high-intensity flash sale to capture market buzz.`,
      `Double down on success: invest in premium ad placements and retargeting campaigns for {product} to maximize ROI.`,
      `Transform {product} into a market leader by hosting exclusive webinars and product demos that drive high engagement.`,
      `Scale up fast—allocate extra budget to social media ads and influencer collaborations for {product}.`,
      `Capitalize on the surge by launching a loyalty program for {product} that rewards repeat purchases with exclusive perks.`,
      `Drive conversions for {product} with personalized retargeting strategies and dynamic ad creatives.`,
      `Supercharge {product} with a data-driven digital strategy, leveraging customer insights to refine targeting.`,
      `Unleash a viral marketing campaign for {product} featuring user-generated content and social proof.`,
      `Boost your market share for {product} by combining aggressive ad spend with strategic content marketing.`,
      `Leverage cutting-edge analytics to optimize campaigns for {product} and capture every growth opportunity.`,
      `Elevate {product} with exclusive online events and limited-time offers that energize your audience.`,
      `Invest in high-impact video ads and interactive content to create buzz around {product}.`,
      `Maximize ROI for {product} by integrating advanced remarketing techniques into your ad strategy.`,
      `Harness the power of influencer partnerships to expand {product}’s reach and drive exponential growth.`,
      `Reallocate resources to innovative digital strategies for {product} that tap into emerging trends.`,
      `Ignite interest in {product} with a robust omni-channel campaign that blends social media and search ads.`,
      `Capitalize on high demand by offering exclusive pre-order benefits for {product}.`,
      `Strategically boost {product}’s visibility with performance-based ad spend and creative retargeting.`,
      `Position {product} as a must-have by combining targeted promotions with engaging content campaigns.`
    ];
  
    const moderateGrowthActions = [
      `Elevate {product} by launching a viral social media challenge that sparks community engagement.`,
      `Boost {product}’s visibility with a creative email marketing series and targeted ad campaigns.`,
      `Refine your product pages for {product} and use A/B testing to convert casual visitors into buyers.`,
      `Drive demand for {product} by collaborating with niche influencers and leveraging user testimonials.`,
      `Launch a seasonal promotion for {product} that aligns with current market trends and customer interests.`,
      `Optimize {product}’s landing pages for better SEO and conversion rate, drawing in more organic traffic.`,
      `Implement a referral program for {product} that rewards customers for bringing in new buyers.`,
      `Strengthen {product}’s brand by curating engaging content that highlights its unique value proposition.`,
      `Invest in retargeting campaigns for {product} to re-engage potential customers who showed interest.`,
      `Deploy interactive content such as polls or quizzes around {product} to boost engagement and awareness.`,
      `Experiment with dynamic pricing for {product} to optimize sales during peak periods.`,
      `Enhance customer support and follow-up for {product} to improve satisfaction and drive repeat sales.`,
      `Leverage influencer takeovers to refresh {product}’s image and reach new audiences.`,
      `Introduce limited-time offers for {product} to stimulate urgency and boost conversions.`,
      `Combine targeted social ads with organic content for {product} to create a cohesive brand story.`,
      `Use data insights to fine-tune your marketing channels for {product} and maximize efficiency.`,
      `Host online live events to demonstrate {product}’s benefits and answer customer questions in real time.`,
      `Create engaging video content that showcases {product} in action, building excitement and trust.`,
      `Offer bundled deals for {product} alongside complementary items to increase average order value.`,
      `Revamp {product}’s digital presence with fresh, innovative creative assets and a targeted campaign.`
    ];
  
    const stableActions = [
      `Transform {product}’s steady performance into breakthrough growth by optimizing your landing pages for conversion.`,
      `Enhance {product}’s customer journey with A/B testing and iterative design improvements that capture more leads.`,
      `Leverage deep-dive analytics to identify new opportunities for {product} and refine your digital strategy.`,
      `Experiment with interactive product demos for {product} that turn interest into measurable sales.`,
      `Strengthen {product}’s online presence with targeted SEO strategies and optimized content marketing.`,
      `Use customer feedback to iterate on {product}’s presentation, ensuring that every detail drives conversion.`,
      `Invest in subtle, high-quality ad creatives for {product} that build trust and encourage sustained interest.`,
      `Focus on retention strategies for {product} by introducing loyalty rewards and personalized offers.`,
      `Develop a content calendar for {product} that positions it as a market staple and builds organic reach.`,
      `Enhance user experience around {product} by streamlining your checkout process and improving page load times.`,
      `Tap into market research to uncover untapped niches for {product} and tailor your marketing accordingly.`,
      `Launch periodic promotions for {product} that maintain customer interest without oversaturating the market.`,
      `Introduce customer testimonial videos for {product} to build credibility and drive steady sales.`,
      `Optimize your ad spend for {product} by balancing between awareness campaigns and direct-response initiatives.`,
      `Refine targeting for {product} with lookalike audiences and data segmentation to improve campaign performance.`,
      `Deploy chatbots and live support on {product}’s pages to guide users toward conversion.`,
      `Create a series of how-to guides or tutorials for {product} that empower customers and drive engagement.`,
      `Integrate social proof and user reviews more prominently for {product} to boost confidence and sales.`,
      `Refresh {product}’s visual branding periodically to maintain relevance and appeal in a competitive market.`,
      `Utilize remarketing campaigns for {product} to re-engage visitors and drive them back to your site.`
    ];
  
    const decliningActions = [
      `{product} needs a turnaround! Consider a complete rebrand with a bold new messaging strategy to win back customers.`,
      `Revitalize {product} by launching an aggressive promotion—think flash sales and limited-time offers to spark interest.`,
      `Reassess your marketing channels for {product} and pivot to innovative platforms that may offer better traction.`,
      `Implement a customer feedback loop for {product} to identify and fix pain points, then relaunch with improved features.`,
      `Inject new life into {product} by bundling it with best-sellers and offering exclusive cross-promotions.`,
      `Shift your strategy for {product} by reallocating budget towards emerging digital channels and creative campaigns.`,
      `Develop a targeted outreach program for {product} aimed at reactivating dormant customers with personalized offers.`,
      `Reignite interest in {product} by collaborating with niche influencers who can authentically endorse its benefits.`,
      `Revamp {product}’s online presence with a modern design overhaul and an emphasis on storytelling.`,
      `Launch a targeted remarketing campaign for {product} to recapture the attention of previous visitors.`,
      `Focus on a limited-time re-launch event for {product} that creates buzz and resets customer perceptions.`,
      `Test innovative pricing strategies for {product} to make it more competitive and appealing in the market.`,
      `Offer a trial or sample campaign for {product} to lower the barrier to entry and attract new customers.`,
      `Integrate customer testimonials and success stories for {product} to rebuild trust and stimulate sales.`,
      `Rethink {product}’s value proposition and reposition it to better match current market demands.`,
      `Launch a comprehensive digital audit for {product} to identify underperforming areas and address them head-on.`,
      `Create urgency around {product} with a countdown-driven promotion that emphasizes scarcity and exclusivity.`,
      `Consider partnerships or collaborations that can bring fresh energy and exposure to {product}.`,
      `Implement a loyalty reactivation program for {product} that rewards past customers for coming back.`,
      `Explore innovative content strategies for {product} that shift focus from price to the unique value it offers.`
    ];
  
    // Track used suggestion indices per category.
    const usedHigh = new Set<number>();
    const usedModerate = new Set<number>();
    const usedStable = new Set<number>();
    const usedDeclining = new Set<number>();
  
    // Generate one recommendation per selected product.
    for (const product of productsForAction) {
      // Get forecasts for the product sorted chronologically.
      const productForecasts = predictions
        .filter(p => p.product === product)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (productForecasts.length === 0) {
        plan.push(`${product}: No forecast data available for action planning!`);
        continue;
      }
      // Use the latest forecast as the current state.
      const currentForecast = productForecasts[productForecasts.length - 1];
      // Determine growth rate for the product from topPerformers if available.
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
  
      // Select the most relevant suggestion that hasn't been used for similar performance.
      let selectedIndex: number | null = null;
      for (let i = 0; i < candidateList.length; i++) {
        if (!usedSet.has(i)) {
          selectedIndex = i;
          break;
        }
      }
      // If all suggestions are used, pick a random index.
      if (selectedIndex === null) {
        selectedIndex = Math.floor(Math.random() * candidateList.length);
      }
      usedSet.add(selectedIndex);
      // Replace placeholder {product} with the actual product name and {quantity} with the forecast quantity.
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

    insights.push(`Total forecast: $<TrendingUp className="inline h-4 w-4 text-green-400" /> ${predictions.reduce((sum, p) => sum + p.sales, 0).toFixed(2)} over ${forecastDates.length} ${range}(s)!`);
    insights.push(`Top performer: <Star className="inline h-4 w-4 text-yellow-400" /> ${topPerformers[0]?.product} with $${topPerformers[0]?.totalSales.toFixed(2)} and ${topPerformers[0]?.growthRate.toFixed(1)}% growth!`);

    products.forEach(product => {
      const productPreds = predictions.filter(p => p.product === product);
      const totalSales = productPreds.reduce((sum, p) => sum + p.sales, 0);
      const avgSales = totalSales / productPreds.length;
      const growthRate = topPerformers.find(tp => tp.product === product)?.growthRate || 0;
      const peakDate = productPreds.reduce((max, p) => p.sales > max.sales ? p : max, productPreds[0]).date;
      const isSeasonal = productPreds.some(p => p.sales > avgSales * 1.2);
      const lowStockRisk = productPreds.some(p => p.quantity < 10);

      insights.push(`${product}: Forecasted $<TrendingUp className="inline h-4 w-4 text-green-400" /> ${totalSales.toFixed(2)}! ${growthRate > 5 ? 'Strong growth—push marketing efforts!' : growthRate > 0 ? 'Steady progress—maintain momentum!' : 'Sales are declining—consider promotional strategies!'}`);
      if (peakDate) insights.push(`Peak date: <Clock className="inline h-4 w-4 text-red-400" /> ${peakDate}! Stock 2x and launch a sale!`);
      if (isSeasonal) insights.push(`Seasonal trend: <AreaChart className="inline h-4 w-4 text-blue-400" /> ${product}! Align with holidays for a 20% boost!`);
      if (lowStockRisk) insights.push(`Low stock risk: <AlertTriangle className="inline h-4 w-4 text-red-500" /> ${product}! Order ${Math.max(...productPreds.map(p => p.quantity)) * 1.5} units now!`);
      if (growthRate > 10) insights.push(`High growth: <TrendingUp className="inline h-4 w-4 text-green-400" /> ${product}! Invest in PPC ads for 3x ROI!`);
      if (growthRate < 0) insights.push(`Declining: <TrendingDown className="inline h-4 w-4 text-red-500" /> ${product}! Bundle with ${topPerformers[0]?.product || 'top seller'} or offer discounts!`);
    });

    return insights.slice(0, 10);
  };

  const handleSignOut = async () => {
    console.log('Sign out triggered');
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
              Intelligent <span className="text-yellow-300">Sales Forecasting</span> <TrendingUp className="inline h-8 w-8 animate-pulse" />
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
                  <h3 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                    Forecast Overview <TrendingUp className="inline h-6 w-6 ml-2 animate-pulse" />
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt flex-1">
                        <h4 className="text-lg font-bold text-white mb-2">Total Forecast</h4>
                        <p className="text-2xl font-bold text-white drop-shadow-md">${forecastResult.totalForecast.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">Over {duration} {range}(s)</p>
                      </div>
                      <button
  onClick={downloadForecastCSV}
  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center text-xl font-bold animate-gradient-x border-2 border-yellow-300 hover:border-yellow-400 whitespace-nowrap"
>
  <Download className="h-6 w-6 mr-2 animate-bounce" /> Get Forecast
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
                          data-tooltip={getPriorityFlag(forecastResult.predictions.find(p => p.date === action.split('(')[1]?.split(')')[0])?.quantity || 0, []) || 'Normal'}
                        >
                          <div className="flex items-center mb-2">
                            <Target className="text-green-400 mr-2 animate-pulse" />
                            <h4 className="text-lg font-bold text-white">Action #{index + 1}</h4>
                          </div>
                          <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: action.replace('<Megaphone />', '<svg class="inline h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h5m4-15h3l3 3v11a2 2 0 01-2 2h-4m-2-14v14"></path></svg>').replace('<Package />', '<svg class="inline h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4-8-4m8 4v10"></path></svg>').replace('<ShoppingCart />', '<svg class="inline h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>').replace('<MessageCircle />', '<svg class="inline h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>').replace('<Clock />', '<svg class="inline h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>').replace('<RefreshCw />', '<svg class="inline h-4 w-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H4m0 11v-5h-.582m0 0A8.001 8.001 0 0119.418 15H20"></path></svg>').replace('<TrendingDown />', '<svg class="inline h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>') }}></p>
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
                      <svg
                        className="inline h-6 w-6 ml-2 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        ></path>
                      </svg>
                    </h3>
                    <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                      <ul className="list-none text-gray-300 text-sm space-y-2">
                        {forecastResult.insights.map((insight, i) => (
                          <li key={i} className="flex items-center">
                            <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
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

// Add custom CSS (unchanged)
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
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);