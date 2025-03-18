import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart2,
  Upload,
  Loader2,
  Download,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  registerables,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Papa from 'papaparse';

// Register Chart.js components and plugins
ChartJS.register(...registerables, ChartDataLabels);

interface Sale {
  id: number;
  user_id?: string;
  date: string;
  product: string;
  state: string;
  country: string;
  customer: string;
  sales: number;
  quantity: number;
}

interface DateRange {
  start: string;
  end: string;
}

interface InsightItem {
  product?: string;
  customer?: string;
  region?: string;
  sales: number;
  insight: string[];
}

const mockSalesData: Sale[] = [
  { id: 1, date: '2025-01-01', product: 'Eco-Friendly Tumbler', state: 'CA', country: 'USA', customer: 'John Doe', sales: 150, quantity: 3 },
  { id: 2, date: '2025-01-02', product: 'Bamboo Toothbrush', state: 'NY', country: 'USA', customer: 'Jane Smith', sales: 80, quantity: 4 },
  { id: 3, date: '2025-01-03', product: 'Eco-Friendly Tumbler', state: 'TX', country: 'USA', customer: 'Mike Brown', sales: 200, quantity: 5 },
  { id: 4, date: '2025-01-04', product: 'Organic T-Shirt', state: 'ON', country: 'Canada', customer: 'Emily Davis', sales: 120, quantity: 2 },
  { id: 5, date: '2025-01-05', product: 'Bamboo Toothbrush', state: 'BC', country: 'Canada', customer: 'Sarah Wilson', sales: 60, quantity: 3 },
];

export default function ToolsDashboard() {
  const { user, supabase, signOut } = useAuth();
  const navigate = useNavigate();

  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<string>('sales-growth'); // Default to "sales-growth"
  const [dateRange, setDateRange] = useState<DateRange>({ start: '2025-01-01', end: '2025-12-31' });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState<boolean>(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState<boolean>(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState<boolean>(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [trendType, setTrendType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSalesData(mockSalesData);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
    }
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) {
      alert('Please select a file to load');
      return;
    }

    setUploading(true);
    Papa.parse(fileToUpload, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<any>) => {
        const parsedData = result.data
          .filter(row => row.date && row.product)
          .map((row: any, index: number) => ({
            id: salesData.length + index + 1,
            user_id: user.id,
            date: row.date || '',
            product: row.product || '',
            state: row.state || '',
            country: row.country || '',
            customer: row.customer || '',
            sales: parseFloat(row.sales) || 0,
            quantity: parseInt(row.quantity, 10) || 0,
          }));

        setSalesData((prevData) => [...prevData, ...parsedData]);
        alert('Sales data loaded successfully!');
        setIsUploadModalOpen(false);
        setFileToUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setUploading(false);
      },
      error: () => {
        alert('Error parsing CSV file. Please check the file format.');
        setUploading(false);
      },
    });
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['id', 'date', 'product', 'state', 'country', 'customer', 'sales', 'quantity'],
      ['1', '2025-01-01', 'Eco-Friendly Tumbler', 'CA', 'USA', 'John Doe', '150', '3'],
      ['2', '2025-01-02', 'Bamboo Toothbrush', 'NY', 'USA', 'Jane Smith', '80', '4'],
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/tools');
  };

  const aggregateData = (data: Sale[], trend: 'daily' | 'weekly' | 'monthly') => {
    const groupedData: Record<string, Sale[]> = {};
    data.forEach((sale) => {
      const date = new Date(sale.date);
      let key: string;
      if (trend === 'daily') {
        key = sale.date;
      } else if (trend === 'weekly') {
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        key = `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}-${weekStart.getDate()}`;
      } else {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push(sale);
    });

    return Object.entries(groupedData).map(([key, sales]) => ({
      date: key,
      sales: sales.reduce((sum, s) => sum + s.sales, 0),
      quantity: sales.reduce((sum, s) => sum + s.quantity, 0),
      customers: [...new Set(sales.map(s => s.customer))].length,
    }));
  };

  const filteredData: Sale[] = salesData.filter((sale) => {
    const saleDate = new Date(sale.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const productMatch = selectedProducts.length === 0 || selectedProducts.includes(sale.product);
    const stateMatch = selectedStates.length === 0 || selectedStates.includes(sale.state);
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(sale.country);
    const customerMatch = selectedCustomers.length === 0 || selectedCustomers.includes(sale.customer);
    return saleDate >= startDate && saleDate <= endDate && productMatch && stateMatch && countryMatch && customerMatch;
  });

  const aggregatedData = aggregateData(filteredData, trendType);
  const totalSales = filteredData.reduce((sum, sale) => sum + sale.sales, 0);
  const totalOrders = filteredData.length;
  const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00';
  const totalQuantity = filteredData.reduce((sum, sale) => sum + sale.quantity, 0);
  const repeatCustomers = [...new Set(filteredData.map(sale => sale.customer))].length;

  const topProductsBySales = [...new Set(filteredData.map(sale => sale.product))]
    .map(product => ({
      product,
      sales: filteredData.filter(sale => sale.product === product).reduce((sum, sale) => sum + sale.sales, 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  const topCustomersBySales = [...new Set(filteredData.map(sale => sale.customer))]
    .map(customer => ({
      customer,
      sales: filteredData.filter(sale => sale.customer === customer).reduce((sum, sale) => sum + sale.sales, 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  const topRegionsBySales = [...new Set(filteredData.map(sale => `${sale.state}, ${sale.country}`))]
    .map(region => ({
      region,
      sales: filteredData.filter(sale => `${sale.state}, ${sale.country}` === region).reduce((sum, sale) => sum + sale.sales, 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  const getInsights = () => {
    const customerPurchaseCounts = filteredData.reduce((acc, sale) => {
      acc[sale.customer] = (acc[sale.customer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const repeatCustomerCount = Object.values(customerPurchaseCounts).filter(count => count > 1).length;
    const totalUniqueCustomers = Object.keys(customerPurchaseCounts).length;
    const repeatPurchaseRate = totalUniqueCustomers > 0 ? (repeatCustomerCount / totalUniqueCustomers) * 100 : 0;

    const trendData = aggregatedData;
    const firstValue = trendData.length > 0 ? trendData[0].sales : 0;
    const lastValue = trendData.length > 0 ? trendData[trendData.length - 1].sales : 0;
    const growthRate = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    const isGrowth = growthRate > 0;

    const trendLabel = trendType === 'daily' ? 'day' : trendType === 'weekly' ? 'week' : 'month';

    switch (selectedReport) {
      case 'sales-growth':
        return {
          title: `Sales Growth Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: [
            {
              sales: totalSales,
              insight: [
                `Sales at $${totalSales.toFixed(2)} with ${growthRate.toFixed(1)}% ${isGrowth ? `${trendLabel}ly climb—epic!` : `${trendLabel}ly dip—pivot time!`}`,
                `Your total sales hit $${totalSales.toFixed(2)}—${isGrowth ? `a ${trendLabel}ly climb worth riding!` : `a ${trendLabel}ly dip to tackle!`}`,
                `- **Peak Push**: ${isGrowth ? `Rerun this ${trendLabel}’s best promo.` : `Test a fresh promo this ${trendLabel}.`}`,
                `- **Seasonal Prep**: ${isGrowth ? `Stock up early if this ${trendLabel}’s seasonal.` : `Counter seasonal drags this ${trendLabel}.`}`,
                `- **Channel Test**: ${isGrowth ? `Test a new platform this ${trendLabel}.` : `Stabilize core channels first.`}`,
                `- **Top Performers**: Check "Sales by Product" to ${isGrowth ? 'amplify what’s hot' : 'revive what’s off'}.`,
                `- **New Markets**: ${isGrowth ? `Use this ${trendLabel}’s cash to test a new channel.` : 'Focus on core sales to stabilize.'}`,
                `- **Cost Check**: Cut 5%—that’s $${(totalSales * 0.05).toFixed(2)} to ${isGrowth ? 'reinvest' : 'cushion'}.`,
              ],
            },
            {
              sales: totalOrders,
              insight: [
                `${totalOrders} orders this ${trendLabel}—${totalOrders > 5 ? 'steady vibes!' : 'time to spark some action!'}`,
                `- **Repeat Boost**: Launch a "Buy Again" deal to ${isGrowth ? 'keep it rolling' : 'get back on track'}.`,
                `- **Checkout Flow**: Simplify it—lost orders cost $${avgOrderValue} each.`,
                `- **Upsell Now**: Add a $5 add-on to ${isGrowth ? 'boost the wave' : 'lift the numbers'}.`,
              ],
            },
          ],
        };

      case 'sales-by-product':
        return {
          title: `Sales by Product Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: topProductsBySales.map((item, index) => {
            const productTrend = aggregateData(filteredData.filter(s => s.product === item.product), trendType);
            const firstProductSales = productTrend[0]?.sales || 0;
            const lastProductSales = productTrend[productTrend.length - 1]?.sales || 0;
            const isProductGrowth = lastProductSales > firstProductSales;
            const productSalesPercentage = (item.sales / totalSales) * 100;

            if (index === 0) {
              return {
                product: item.product,
                sales: item.sales,
                insight: [
                  `"${item.product}" leads at $${item.sales.toFixed(2)} (${productSalesPercentage.toFixed(1)}%)—${isProductGrowth ? `${trendLabel}ly fire!` : `slipping this ${trendLabel}!`}`,
                  `- **Scale It**: ${isProductGrowth ? `Boost ads by 25% to ride this ${trendLabel}.` : 'Rev up ads to stop the slide.'}`,
                  `- **Feature It**: ${isProductGrowth ? `Hero it up this ${trendLabel}!` : 'Refresh its spotlight now.'}`,
                  `- **Stock Up**: 3x stock—could lose $${(item.sales * 0.15).toFixed(2)} if ${isProductGrowth ? 'growth stalls' : 'it fades'}.`,
                ],
              };
            } else if (index === 1) {
              return {
                product: item.product,
                sales: item.sales,
                insight: [
                  `"${item.product}" pulls $${item.sales.toFixed(2)}—${isProductGrowth ? `${trendLabel}ly climbing!` : `fading this ${trendLabel}!`}`,
                  `- **Bundle Play**: Pair with #1 for a 10% off deal to ${isProductGrowth ? 'keep it hot' : 'spark it up'}.`,
                  `- **Niche Ads**: Target ads to ${isProductGrowth ? `fuel this ${trendLabel}` : 'reignite demand'}.`,
                  `- **Price Test**: ${isProductGrowth ? 'Hike 5%—it’s trending!' : 'Drop 5% to test volume.'}`,
                ],
              };
            } else {
              return {
                product: item.product,
                sales: item.sales,
                insight: [
                  `"${item.product}" logs $${item.sales.toFixed(2)}—${isProductGrowth ? `${trendLabel}ly rising!` : `down this ${trendLabel}!`}`,
                  `- **Cross-Sell**: Push with top sellers to ${isProductGrowth ? 'build the buzz' : 'halt the drop'}.`,
                  `- **Feedback Loop**: Ask buyers—${isProductGrowth ? 'scale what’s hot' : 'fix what’s off'}.`,
                  `- **Promo Push**: Flash sale to ${isProductGrowth ? `amp this ${trendLabel}` : 'test a rebound'}.`,
                ],
              };
            }
          }),
        };

      case 'sales-by-region':
        return {
          title: `Sales by Region Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: topRegionsBySales.map((item, index) => {
            const regionTrend = aggregateData(filteredData.filter(s => `${s.state}, ${s.country}` === item.region), trendType);
            const firstRegionSales = regionTrend[0]?.sales || 0;
            const lastRegionSales = regionTrend[regionTrend.length - 1]?.sales || 0;
            const isRegionGrowth = lastRegionSales > firstRegionSales;
            const regionSalesPercentage = (item.sales / totalSales) * 100;

            if (index === 0) {
              return {
                region: item.region,
                sales: item.sales,
                insight: [
                  `"${item.region}" dominates at $${item.sales.toFixed(2)} (${regionSalesPercentage.toFixed(1)}%)—${isRegionGrowth ? `${trendLabel}ly killing it!` : `cooling this ${trendLabel}!`}`,
                  `- **Local Ads**: ${isRegionGrowth ? `Double down this ${trendLabel} with local vibes.` : 'Revive with fresh ads.'}`,
                  `- **Fast Delivery**: ${isRegionGrowth ? `Speed it up to lock this ${trendLabel}.` : 'Don’t lose buyers—ship faster.'}`,
                  `- **Event Boost**: Tie promos to events to ${isRegionGrowth ? 'max the surge' : 'bring it back'}.`,
                ],
              };
            } else if (index === 1) {
              return {
                region: item.region,
                sales: item.sales,
                insight: [
                  `"${item.region}" brings $${item.sales.toFixed(2)}—${isRegionGrowth ? `${trendLabel}ly rising!` : `slipping this ${trendLabel}!`}`,
                  `- **Geo-Target**: Ads to ${isRegionGrowth ? `fuel this ${trendLabel}` : 'stop the fade'}.`,
                  `- **Competitor Watch**: ${isRegionGrowth ? 'Steal rival tricks to grow.' : 'See what’s pulling sales away.'}`,
                  `- **Loyalty Play**: Exclusive deal to ${isRegionGrowth ? 'keep it rolling' : 'win them back'}.`,
                ],
              };
            } else {
              return {
                region: item.region,
                sales: item.sales,
                insight: [
                  `"${item.region}" logs $${item.sales.toFixed(2)}—${isRegionGrowth ? `${trendLabel}ly up!` : `down this ${trendLabel}!`}`,
                  `- **Test Expansion**: ${isRegionGrowth ? `Push ads to ride this ${trendLabel}.` : 'Cut shipping to spark interest.'}`,
                  `- **Local Buzz**: Influencers to ${isRegionGrowth ? 'amp the uptick' : 'stop the drop'}.`,
                  `- **Data Dive**: Check trends—${isRegionGrowth ? 'what’s driving it?' : 'what’s off?'}`,
                ],
              };
            }
          }),
        };

      case 'customer-lifetime-value':
        return {
          title: `Customer Lifetime Value Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: topCustomersBySales.map((item, index) => {
            const customerTrend = aggregateData(filteredData.filter(s => s.customer === item.customer), trendType);
            const firstCustomerSales = customerTrend[0]?.sales || 0;
            const lastCustomerSales = customerTrend[customerTrend.length - 1]?.sales || 0;
            const isCustomerGrowth = lastCustomerSales > firstCustomerSales;

            if (index === 0) {
              return {
                customer: item.customer,
                sales: item.sales,
                insight: [
                  `"${item.customer}" spent $${item.sales.toFixed(2)}—${isCustomerGrowth ? `${trendLabel}ly your VIP!` : `slowing this ${trendLabel}!`}`,
                  `- **VIP Perks**: ${isCustomerGrowth ? `Early access to keep this ${trendLabel} hot.` : 'Re-engage with a perk.'}`,
                  `- **Personal Note**: 15% off thank-you to ${isCustomerGrowth ? 'fuel loyalty' : 'bring them back'}.`,
                  `- **Referral Ask**: $10 credit for refs—${isCustomerGrowth ? 'they’re gold' : 'revive their spark'}.`,
                ],
              };
            } else if (index === 1) {
              return {
                customer: item.customer,
                sales: item.sales,
                insight: [
                  `"${item.customer}" at $${item.sales.toFixed(2)}—${isCustomerGrowth ? `${trendLabel}ly climbing!` : `fading this ${trendLabel}!`}`,
                  `- **Upsell Time**: Add-ons to ${isCustomerGrowth ? `ride this ${trendLabel}` : 'boost their next buy'}.`,
                  `- **Re-Engage**: "We Miss You" offer if ${isCustomerGrowth ? 'they keep it up' : 'they’ve slowed'}.`,
                  `- **Survey Them**: Ask what’s up—${isCustomerGrowth ? 'scale it' : 'fix it'}.`,
                ],
              };
            } else {
              return {
                customer: item.customer,
                sales: item.sales,
                insight: [
                  `"${item.customer}" adds $${item.sales.toFixed(2)}—${isCustomerGrowth ? `${trendLabel}ly loyal!` : `at risk this ${trendLabel}!`}`,
                  `- **Reward Consistency**: Freebie to ${isCustomerGrowth ? 'sweeten it' : 'keep them'}.`,
                  `- **Custom Offer**: Deal to ${isCustomerGrowth ? `grow this ${trendLabel}` : 'stop churn'}.`,
                  `- **Check In**: Reach out—${isCustomerGrowth ? 'fan the flame' : 'don’t lose them'}.`,
                ],
              };
            }
          }),
        };

      case 'average-order-value':
        return {
          title: `Average Order Value Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: [
            {
              sales: parseFloat(avgOrderValue),
              insight: [
                `AOV at $${avgOrderValue} this ${trendLabel}—${parseFloat(avgOrderValue) > 50 ? 'profit vibes!' : 'let’s lift it!'}`,
                `- **Upsell Easy**: "Complete the Set" to ${parseFloat(avgOrderValue) > 50 ? `push this ${trendLabel}` : 'bump it 20%'}.`,
                `- **Free Shipping**: $${(parseFloat(avgOrderValue) * 1.3).toFixed(2)} threshold to ${parseFloat(avgOrderValue) > 50 ? 'grow carts' : 'spark bigger buys'}.`,
                `- **Low Order Fix**: Add-ons below $${(parseFloat(avgOrderValue) * 0.7).toFixed(2)} to ${parseFloat(avgOrderValue) > 50 ? 'max value' : 'get on track'}.`,
              ],
            },
          ],
        };

      case 'repeat-purchase-rate':
        return {
          title: `Repeat Purchase Rate Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: [
            {
              sales: repeatPurchaseRate,
              insight: [
                `${repeatPurchaseRate.toFixed(1)}% repeat rate this ${trendLabel}—${repeatPurchaseRate > 20 ? 'loyalty’s hot!' : 'room to grow!'}`,
                `- **Loyalty Kick**: Points program to ${repeatPurchaseRate > 20 ? `lock this ${trendLabel}` : 'boost repeats'}.`,
                `- **Win Back**: 10% off for one-timers to ${repeatPurchaseRate > 20 ? 'grow the crew' : 'start loyalty'}.`,
                `- **Subscription Pitch**: 15% off recurring to ${repeatPurchaseRate > 20 ? 'cement it' : 'hook them'}.`,
              ],
            },
          ],
        };

      case 'product-performance':
        return {
          title: `Product Performance Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: topProductsBySales.map((item, index) => {
            const productTrend = aggregateData(filteredData.filter(s => s.product === item.product), trendType);
            const firstProductSales = productTrend[0]?.sales || 0;
            const lastProductSales = productTrend[productTrend.length - 1]?.sales || 0;
            const isProductGrowth = lastProductSales > firstProductSales;
            const unitsSold = filteredData.filter(sale => sale.product === item.product).reduce((sum, sale) => sum + sale.quantity, 0);

            if (index === 0) {
              return {
                product: item.product,
                sales: item.sales,
                insight: [
                  `"${item.product}" tops $${item.sales.toFixed(2)} (${unitsSold} units)—${isProductGrowth ? `${trendLabel}ly hot!` : `slipping this ${trendLabel}!`}`,
                  `- **Restock Fast**: 2-3x stock—${isProductGrowth ? `${trendLabel}ly demand’s up` : 'don’t lose more'}.`,
                  `- **Cross-Promote**: Pair with others to ${isProductGrowth ? `fuel this ${trendLabel}` : 'revive it'}.`,
                  `- **Price Play**: ${isProductGrowth ? `10% hike—test this ${trendLabel}.` : '5% drop to spark volume.'}`,
                ],
              };
            } else if (index === 1) {
              return {
                product: item.product,
                sales: item.sales,
                insight: [
                  `"${item.product}" hits $${item.sales.toFixed(2)} (${unitsSold} units)—${isProductGrowth ? `${trendLabel}ly strong!` : `fading this ${trendLabel}!`}`,
                  `- **Bundle It**: Combo with #1 to ${isProductGrowth ? `boost this ${trendLabel}` : 'stop the slide'}.`,
                  `- **Spotlight**: Social shout to ${isProductGrowth ? `ride this ${trendLabel}` : 'bring it back'}.`,
                  `- **Margin Check**: ${isProductGrowth ? `Cut costs to grow profit this ${trendLabel}.` : 'Offset the dip.'}`,
                ],
              };
            } else {
              return {
                product: item.product,
                sales: item.sales,
                insight: [
                  `"${item.product}" logs $${item.sales.toFixed(2)} (${unitsSold} units)—${isProductGrowth ? `${trendLabel}ly up!` : `down this ${trendLabel}!`}`,
                  `- **Promo Test**: 20% off sale to ${isProductGrowth ? `push this ${trendLabel}` : 'test a rebound'}.`,
                  `- **Review Boost**: Reviews to ${isProductGrowth ? `build this ${trendLabel}` : 'restore trust'}.`,
                  `- **Category Push**: Highlight to ${isProductGrowth ? `grow this ${trendLabel}` : 'halt the drop'}.`,
                ],
              };
            }
          }),
        };

      case 'customer-acquisition':
        const acquisitionTrend = aggregatedData.map(d => ({ date: d.date, newCustomers: d.customers }));
        const firstNewCustomers = acquisitionTrend[0]?.newCustomers || 0;
        const lastNewCustomers = acquisitionTrend[acquisitionTrend.length - 1]?.newCustomers || 0;
        const isAcquisitionGrowth = lastNewCustomers > firstNewCustomers;

        return {
          title: `Customer Acquisition Insights (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})`,
          items: [
            {
              sales: totalUniqueCustomers,
              insight: [
                `${totalUniqueCustomers} new customers this ${trendLabel}—${isAcquisitionGrowth ? `${trendLabel}ly growing!` : `slowing this ${trendLabel}!`}`,
                `- **Retarget**: 10% off ad to ${isAcquisitionGrowth ? `seal this ${trendLabel}` : 'restart the flow'}.`,
                `- **Source Hunt**: ${isAcquisitionGrowth ? `Double down on what’s hot this ${trendLabel}.` : `Fix what’s drying up.`}`,
                `- **Welcome Flow**: 3-email series to ${isAcquisitionGrowth ? `hook this ${trendLabel}` : 'revive the pipeline'}.`,
              ],
            },
          ],
        };

      default:
        return { title: 'General Insights', items: [] };
    }
  };

  const { title: insightsTitle, items: actionableInsights } = getInsights();

  const allProducts = [...new Set(salesData.map(sale => sale.product))];
  const allStates = [...new Set(salesData.map(sale => sale.state))];
  const allCountries = [...new Set(salesData.map(sale => sale.country))];
  const allCustomers = [...new Set(salesData.map(sale => sale.customer))];

  const selectAllProducts = () => setSelectedProducts([...allProducts]);
  const unselectAllProducts = () => setSelectedProducts([]);
  const selectAllStates = () => setSelectedStates([...allStates]);
  const unselectAllStates = () => setSelectedStates([]);
  const selectAllCountries = () => setSelectedCountries([...allCountries]);
  const unselectAllCountries = () => setSelectedCountries([]);
  const selectAllCustomers = () => setSelectedCustomers([...allCustomers]);
  const unselectAllCustomers = () => setSelectedCustomers([]);

  const handleProductChange = (product: string) => {
    const updated = selectedProducts.includes(product)
      ? selectedProducts.filter(p => p !== product)
      : [...selectedProducts.filter(p => p !== product), product];
    setSelectedProducts(updated.length === allProducts.length ? [] : updated);
  };

  const handleStateChange = (state: string) => {
    const updated = selectedStates.includes(state)
      ? selectedStates.filter(s => s !== state)
      : [...selectedStates.filter(s => s !== state), state];
    setSelectedStates(updated.length === allStates.length ? [] : updated);
  };

  const handleCountryChange = (country: string) => {
    const updated = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries.filter(c => c !== country), country];
    setSelectedCountries(updated.length === allCountries.length ? [] : updated);
  };

  const handleCustomerChange = (customer: string) => {
    const updated = selectedCustomers.includes(customer)
      ? selectedCustomers.filter(c => c !== customer)
      : [...selectedCustomers.filter(c => c !== customer), customer];
    setSelectedCustomers(updated.length === allCustomers.length ? [] : updated);
  };

  const getSummaryInsights = () => {
    switch (selectedReport) {
      case 'sales-growth':
        const firstSales = aggregatedData.length > 0 ? aggregatedData[0].sales : 0;
        const lastSales = aggregatedData.length > 0 ? aggregatedData[aggregatedData.length - 1].sales : 0;
        const growthRate = firstSales > 0 ? (((lastSales - firstSales) / firstSales) * 100).toFixed(1) : 'N/A';
        const highestSales = aggregatedData.length > 0 ? Math.max(...aggregatedData.map(d => d.sales)).toFixed(2) : '0.00';
        const trendLabel = trendType === 'daily' ? 'Day' : trendType === 'weekly' ? 'Week' : 'Month';

        return [
          {
            title: 'Sales Growth Rate',
            value: `${growthRate}%`,
            description: `Sales growth from the first to the last ${trendLabel.toLowerCase()}.`,
          },
          {
            title: 'Total Sales',
            value: `$${totalSales.toFixed(2)}`,
            description: `Total sales for the period.`,
          },
          {
            title: `Highest Sales`,
            value: `$${highestSales}`,
            description: `Highest sales in a single ${trendLabel.toLowerCase()}.`,
          },
        ];

      case 'sales-by-product':
        return [
          { title: 'Top Product', value: topProductsBySales[0]?.product || 'N/A', description: `Top product by sales: $${topProductsBySales[0]?.sales.toFixed(2) || 0}.` },
          { title: 'Total Products Sold', value: [...new Set(filteredData.map(sale => sale.product))].length.toString(), description: `Number of unique products sold.` },
          { title: 'Average Sales per Product', value: `$${([...new Set(filteredData.map(sale => sale.product))].length > 0 ? totalSales / [...new Set(filteredData.map(sale => sale.product))].length : 0).toFixed(2)}`, description: `Average sales per product.` },
        ];

      case 'sales-by-region':
        return [
          { title: 'Top Region', value: topRegionsBySales[0]?.region || 'N/A', description: `Top region by sales: $${topRegionsBySales[0]?.sales.toFixed(2) || 0}.` },
          { title: 'Total Regions', value: [...new Set(filteredData.map(sale => `${sale.state}, ${sale.country}`))].length.toString(), description: `Number of regions with sales.` },
          { title: 'Average Sales per Region', value: `$${([...new Set(filteredData.map(sale => `${sale.state}, ${sale.country}`))].length > 0 ? totalSales / [...new Set(filteredData.map(sale => `${sale.state}, ${sale.country}`))].length : 0).toFixed(2)}`, description: `Average sales per region.` },
        ];

      case 'customer-lifetime-value':
        return [
          { title: 'Top Customer', value: topCustomersBySales[0]?.customer || 'N/A', description: `Top customer by CLV: $${topCustomersBySales[0]?.sales.toFixed(2) || 0}.` },
          { title: 'Average CLV', value: `$${(repeatCustomers > 0 ? totalSales / repeatCustomers : 0).toFixed(2)}`, description: `Average customer lifetime value.` },
          { title: 'Total Customers', value: repeatCustomers.toString(), description: `Total unique customers.` },
        ];

      case 'average-order-value':
        return [
          { title: 'Average Order Value', value: `$${avgOrderValue}`, description: `Average value per order.` },
          { title: 'Total Orders', value: totalOrders.toString(), description: `Total number of orders.` },
          { title: 'Highest Order Value', value: `$${Math.max(...filteredData.map(sale => sale.sales), 0).toFixed(2)}`, description: `Highest single order value.` },
        ];

      case 'repeat-purchase-rate':
        const repeatCustomerCount = Object.values(customerPurchaseCounts).filter(count => count > 1).length;
        const totalUniqueCustomers = Object.keys(customerPurchaseCounts).length;
        const repeatPurchaseRate = totalUniqueCustomers > 0 ? (repeatCustomerCount / totalUniqueCustomers) * 100 : 0;
        return [
          { title: 'Repeat Purchase Rate', value: `${repeatPurchaseRate.toFixed(1)}%`, description: `Percentage of customers who bought more than once.` },
          { title: 'Repeat Customers', value: repeatCustomerCount.toString(), description: `Number of customers with multiple purchases.` },
          { title: 'Total Customers', value: totalUniqueCustomers.toString(), description: `Total unique customers in the filtered data.` },
        ];

      case 'product-performance':
        return [
          { title: 'Top Product by Units', value: topProductsBySales[0]?.product || 'N/A', description: `Top product by units sold: ${filteredData.filter(sale => sale.product === topProductsBySales[0]?.product).reduce((sum, sale) => sum + sale.quantity, 0)} units.` },
          { title: 'Total Units Sold', value: totalQuantity.toString(), description: `Total units sold across all products.` },
          { title: 'Average Units per Product', value: `${([...new Set(filteredData.map(sale => sale.product))].length > 0 ? totalQuantity / [...new Set(filteredData.map(sale => sale.product))].length : 0).toFixed(1)}`, description: `Average units sold per product.` },
        ];

      case 'customer-acquisition':
        const acquisitionDates = [...new Set(filteredData.map(sale => sale.date))].sort();
        const newCustomersFirstDay = acquisitionDates.length > 0 ? [...new Set(filteredData.filter(sale => sale.date === acquisitionDates[0]).map(sale => sale.customer))].length : 0;
        const newCustomersLastDay = acquisitionDates.length > 0 ? [...new Set(filteredData.filter(sale => sale.date === acquisitionDates[acquisitionDates.length - 1]).map(sale => sale.customer))].length : 0;
        return [
          { title: 'New Customers', value: repeatCustomers.toString(), description: `Total new customers acquired.` },
          { title: 'First Day New Customers', value: newCustomersFirstDay.toString(), description: `New customers on the first day.` },
          { title: 'Last Day New Customers', value: newCustomersLastDay.toString(), description: `New customers on the last day.` },
        ];

      default:
        return [];
    }
  };

  const summaryInsights = getSummaryInsights();

  const salesByProductChartData: ChartData<'bar'> = {
    labels: topProductsBySales.map(p => p.product),
    datasets: [{ label: 'Sales', data: topProductsBySales.map(p => p.sales), backgroundColor: 'rgba(255, 99, 132, 0.9)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 2, borderRadius: 5 }],
  };

  const salesByRegionChartData: ChartData<'bar'> = {
    labels: topRegionsBySales.map(r => r.region),
    datasets: [{ label: 'Sales', data: topRegionsBySales.map(r => r.sales), backgroundColor: 'rgba(54, 162, 235, 0.9)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 2, borderRadius: 5 }],
  };

  const clvChartData: ChartData<'bar'> = {
    labels: topCustomersBySales.map(c => c.customer),
    datasets: [{ label: 'Lifetime Value', data: topCustomersBySales.map(c => c.sales), backgroundColor: 'rgba(75, 192, 192, 0.9)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2, borderRadius: 5 }],
  };

  const aovChartData: ChartData<'bar'> = {
    labels: [trendType === 'daily' ? 'Daily AOV' : trendType === 'weekly' ? 'Weekly AOV' : 'Monthly AOV', 'Baseline'],
    datasets: [{ label: 'AOV', data: [parseFloat(avgOrderValue), 0], backgroundColor: 'rgba(153, 102, 255, 0.9)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 2, barThickness: 60, borderRadius: 10, barPercentage: 0.5 }],
  };

  const repeatPurchaseRateChartData: ChartData<'bar'> = {
    labels: [trendType === 'daily' ? 'Daily Repeat Rate' : trendType === 'weekly' ? 'Weekly Repeat Rate' : 'Monthly Repeat Rate', 'Baseline'],
    datasets: [{
      label: 'Repeat Rate (%)',
      data: [Object.keys(filteredData.reduce((acc, sale) => { acc[sale.customer] = (acc[sale.customer] || 0) + 1; return acc; }, {} as Record<string, number>)).filter(customer => filteredData.filter(sale => sale.customer === customer).length > 1).length / [...new Set(filteredData.map(sale => sale.customer))].length * 100 || 0, 0],
      backgroundColor: 'rgba(255, 159, 64, 0.9)',
      borderColor: 'rgba(251, 191, 36, 1)',
      borderWidth: 2,
      barThickness: 60,
      borderRadius: 10,
      barPercentage: 0.5,
    }],
  };

  const salesGrowthChartData: ChartData<'line'> = {
    labels: aggregatedData.map((d) => {
      const startDate = new Date(d.date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (trendType === 'weekly' ? 6 : trendType === 'monthly' ? 29 : 0));
      if (endDate > new Date(dateRange.end)) endDate.setDate(new Date(dateRange.end).getDate());
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }),
    datasets: [
      {
        label: 'Sales',
        data: aggregatedData.map((d) => d.sales),
        borderColor: 'rgba(251, 191, 36, 1)',
        backgroundColor: 'rgba(251, 191, 36, 0.4)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#FBBF24',
        pointBorderColor: '#F59E0B',
        pointHoverRadius: 8,
      },
    ],
  };

  const productPerformanceChartData: ChartData<'bar'> = {
    labels: topProductsBySales.map(p => p.product),
    datasets: [
      { label: 'Units Sold', data: topProductsBySales.map(p => filteredData.filter(sale => sale.product === p.product).reduce((sum, sale) => sum + sale.quantity, 0)), backgroundColor: 'rgba(54, 162, 235, 0.9)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 2, borderRadius: 5 },
      { label: 'Sales', data: topProductsBySales.map(p => p.sales), backgroundColor: 'rgba(255, 99, 132, 0.9)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 2, borderRadius: 5 },
    ],
  };

  const customerAcquisitionChartData: ChartData<'line'> = {
    labels: aggregatedData.map(d => d.date),
    datasets: [{ label: 'New Customers', data: aggregatedData.map(d => d.customers), borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.4)', fill: true, tension: 0.4, pointRadius: 6, pointBackgroundColor: '#4BC0C0', pointBorderColor: '#6DE7E7', pointHoverRadius: 8 }],
  };

  const trendyChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#D1D5DB', font: { size: 14, weight: 'bold' }, boxWidth: 20, boxHeight: 20, usePointStyle: true, pointStyle: 'circle' } },
      title: { display: true, text: '', color: '#FBBF24', font: { size: 20, weight: 'bold', family: 'Arial, sans-serif' } },
      tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#FBBF24', bodyColor: '#D1D5DB', borderColor: '#F59E0B', borderWidth: 1, cornerRadius: 8, padding: 10, caretSize: 6, displayColors: true, callbacks: { label: (context) => `${context.label}: $${context.parsed.y.toFixed(2)}` } },
      datalabels: { color: '#FBBF24', font: { size: 14, weight: 'bold' }, formatter: (value) => `$${value.toFixed(2)}`, anchor: 'end', align: 'top', offset: 4, display: (context) => context.dataset.data.length > 1 || context.dataIndex === 0 },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#D1D5DB', font: { size: 12 }, callback: (value) => `$${value}` }, grid: { color: 'rgba(209, 213, 219, 0.1)', borderDash: [5, 5] }, title: { display: true, text: 'Value ($)', color: '#FBBF24', font: { size: 14 } }, min: 0, suggestedMax: (context) => Math.max(...context.chart.data.datasets[0].data) * 1.2 },
      x: { ticks: { color: '#D1D5DB', font: { size: 12 } }, grid: { color: 'rgba(209, 213, 219, 0.1)', borderDash: [5, 5] }, title: { display: true, text: 'Categories', color: '#FBBF24', font: { size: 14 } } },
    },
  };

  const chartOptionsByReport = {
    'sales-by-product': { ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: `Sales by Product (${trendType})` }, datalabels: { formatter: (value) => `$${value.toFixed(2)}` } }, scales: { y: { ...trendyChartOptions.scales.y, title: { text: 'Sales ($)' } }, x: { ...trendyChartOptions.scales.x, title: { text: 'Products' } } } },
    'sales-by-region': { ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: `Sales by Region (${trendType})` }, datalabels: { formatter: (value) => `$${value.toFixed(2)}` } }, scales: { y: { ...trendyChartOptions.scales.y, title: { text: 'Sales ($)' } }, x: { ...trendyChartOptions.scales.x, title: { text: 'Regions' } } } },
    'customer-lifetime-value': { ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: `Customer Lifetime Value (${trendType})` }, datalabels: { formatter: (value) => `$${value.toFixed(2)}` } }, scales: { y: { ...trendyChartOptions.scales.y, title: { text: 'Lifetime Value ($)' } }, x: { ...trendyChartOptions.scales.x, title: { text: 'Customers' } } } },
    'average-order-value': { ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: `Average Order Value (${trendType})` }, datalabels: { formatter: (value) => value ? `$${value.toFixed(2)}` : '' } }, scales: { y: { ...trendyChartOptions.scales.y, title: { text: 'AOV ($)' } }, x: { ...trendyChartOptions.scales.x, title: { text: 'Period' }, ticks: { callback: (value) => value === 0 ? trendType.charAt(0).toUpperCase() + trendType.slice(1) : '' } } } },
    'repeat-purchase-rate': { ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: `Repeat Purchase Rate (${trendType})` }, datalabels: { formatter: (value) => value ? `${value.toFixed(1)}%` : '' } }, scales: { y: { ...trendyChartOptions.scales.y, title: { text: 'Repeat Rate (%)' }, ticks: { callback: (value) => `${value}%` } }, x: { ...trendyChartOptions.scales.x, title: { text: 'Period' }, ticks: { callback: (value) => value === 0 ? trendType.charAt(0).toUpperCase() + trendType.slice(1) : '' } } } },
    'sales-growth': {
      ...trendyChartOptions,
      plugins: {
        ...trendyChartOptions.plugins,
        title: { text: `Sales Growth (${trendType.charAt(0).toUpperCase() + trendType.slice(1)})` },
        datalabels: { formatter: (value) => `$${value.toFixed(2)}` },
      },
      scales: {
        y: { ...trendyChartOptions.scales.y, title: { text: 'Sales ($)' } },
        x: {
          ...trendyChartOptions.scales.x,
          title: { text: `${trendType.charAt(0).toUpperCase() + trendType.slice(1)} Period` },
        },
      },
    },
    'product-performance': { ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: `Product Performance (${trendType})` }, datalabels: { formatter: (value, context) => context.dataset.label === 'Sales' ? `$${value.toFixed(2)}` : value } }, scales: { y: { ...trendyChartOptions.scales.y, title: { text: 'Value' } }, x: { ...trendyChartOptions.scales.x, title: { text: 'Products' } } } },
    'customer-acquisition': { ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: `Customer Acquisition (${trendType})` }, datalabels: { formatter: (value) => `${value}` } }, scales: { y: { ...trendyChartOptions.scales.y, title: { text: 'New Customers' } }, x: { ...trendyChartOptions.scales.x, title: { text: trendType.charAt(0).toUpperCase() + trendType.slice(1) } } } },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(event.target as Node)) setIsProductDropdownOpen(false);
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) setIsStateDropdownOpen(false);
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) setIsCountryDropdownOpen(false);
      if (customerRef.current && !customerRef.current.contains(event.target as Node)) setIsCustomerDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight">
            Your DTC <span className="text-yellow-300">Sales Dashboard</span>
          </h1>
          <p className="mt-6 text-xl text-gray-100 text-center max-w-3xl mx-auto">
            Analyze your sales data with powerful insights and visualizations.
          </p>
          <div className="mt-4 bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
            <p className="text-yellow-300 font-semibold text-lg">
              🔥 Your Data, Your Control: We don’t save a thing—analyze with total peace of mind! 🔥
            </p>
          </div>
        </div>
      </div>

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
                <a href="/tools-dashboard" className="group relative px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <BarChart2 className="w-4 h-4 mr-2" /> Sales Dashboard
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Hot</span>
                </a>
                <a href="/sales-forecasting" className="group relative px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-yellow-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1012 21a9 9 0 00-9-9" />
                  </svg>
                  Sales Forecasting
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Sales Dashboard</h2>
            <div className="relative group">
              <button onClick={() => setIsUploadModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center text-sm">
                <Upload className="h-4 w-4 mr-1" /> Load Sales Data
              </button>
              <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">
                Load your sales data in CSV format—don’t worry, it stays with you!
              </span>
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-xl mb-6 relative z-10 shadow-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              </svg>
              Filter Your Reports
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="w-full sm:w-1/2 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm transition-all duration-200 hover:bg-gray-700" />
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="w-full sm:w-1/2 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm transition-all duration-200 hover:bg-gray-700" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Products', items: allProducts, selected: selectedProducts, setSelected: setSelectedProducts, ref: productRef, isOpen: isProductDropdownOpen, setIsOpen: setIsProductDropdownOpen },
                { label: 'States', items: allStates, selected: selectedStates, setSelected: setSelectedStates, ref: stateRef, isOpen: isStateDropdownOpen, setIsOpen: setIsStateDropdownOpen },
                { label: 'Countries', items: allCountries, selected: selectedCountries, setSelected: setSelectedCountries, ref: countryRef, isOpen: isCountryDropdownOpen, setIsOpen: setIsCountryDropdownOpen },
                { label: 'Customers', items: allCustomers, selected: selectedCustomers, setSelected: setSelectedCustomers, ref: customerRef, isOpen: isCustomerDropdownOpen, setIsOpen: setIsCustomerDropdownOpen },
              ].map(({ label, items, selected, setSelected, ref, isOpen, setIsOpen }) => {
                const [searchTerm, setSearchTerm] = useState('');
                const filteredItems = items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));

                const toggleItem = (item: string) => {
                  const newSelected = selected.includes(item)
                    ? selected.filter(i => i !== item)
                    : [...selected, item];
                  setSelected(newSelected);
                };

                return (
                  <div key={label} className="relative group" ref={ref}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                    <button 
                      onClick={() => setIsOpen(!isOpen)} 
                      className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-300 rounded-full text-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <span>{selected.length === 0 ? `All ${label}` : `${selected.length} Selected`}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {isOpen && (
                      <div className="absolute z-20 mt-2 w-full bg-gray-800 border border-yellow-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-gray-900">
                          <input
                            type="text"
                            placeholder={`Search ${label}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-gray-400 transition-all duration-200 hover:bg-gray-600"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="p-2">
                          <button onClick={() => setSelected(items)} className="w-full text-left px-2 py-1 text-gray-300 hover:bg-gray-700 rounded text-sm transition-colors duration-200">Select All</button>
                          <button onClick={() => setSelected([])} className="w-full text-left px-2 py-1 text-gray-300 hover:bg-gray-700 rounded text-sm transition-colors duration-200">Clear All</button>
                          {filteredItems.length === 0 ? (
                            <p className="text-gray-500 text-sm px-2 py-1">No matches found</p>
                          ) : (
                            filteredItems.map(item => (
                              <label key={item} className="flex items-center px-2 py-1 text-gray-300 hover:bg-gray-700 rounded text-sm transition-colors duration-200 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selected.includes(item)}
                                  onChange={() => toggleItem(item)}
                                  className="mr-2 rounded text-yellow-300 focus:ring-yellow-300"
                                />
                                {item}
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Select Report Type</h3>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full md:w-96 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
            >
              <option value="sales-growth">Sales Growth Over Time</option>
              <option value="sales-by-product">Sales by Product</option>
              <option value="sales-by-region">Sales by Region</option>
              <option value="customer-lifetime-value">Customer Lifetime Value (CLV)</option>
              <option value="average-order-value">Average Order Value (AOV)</option>
              <option value="repeat-purchase-rate">Repeat Purchase Rate</option>
              <option value="product-performance">Product Performance</option>
              <option value="customer-acquisition">Customer Acquisition Trends</option>
            </select>
            {(selectedReport === 'sales-growth' || selectedReport === 'customer-acquisition') && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Trend View</label>
                <div className="flex space-x-4">
                  {(['daily', 'weekly', 'monthly'] as const).map((trend) => (
                    <button
                      key={trend}
                      onClick={() => setTrendType(trend)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${trendType === trend ? 'bg-yellow-300 text-gray-900 shadow-lg' : 'bg-gray-800 text-gray-200 hover:bg-gray-600 hover:text-yellow-300'}`}
                    >
                      {trend.charAt(0).toUpperCase() + trend.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isUploadModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-white mb-4">Load Your Sales Data</h3>
                <p className="text-gray-400 text-sm mb-4">Upload a CSV with columns: id, date, product, state, country, customer, sales, quantity.</p>
                <input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <button onClick={downloadSampleCSV} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 flex items-center text-sm">
                    <Download className="h-4 w-4 mr-1" /> Sample CSV
                  </button>
                  <div className="flex space-x-2">
                    <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 text-sm">Cancel</button>
                    <button onClick={handleFileUpload} disabled={uploading} className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center text-sm disabled:bg-orange-300">
                      {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                      {uploading ? 'Loading...' : 'Load'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-700 p-8 rounded-lg">
            {filteredData.length === 0 ? (
              <div className="text-center">
                <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">No Data Loaded</h3>
                <p className="text-gray-400 mb-4">Load your sales data to unlock killer analytics—don’t sweat it, we don’t keep it!</p>
                <button onClick={() => setIsUploadModalOpen(true)} className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm">Load CSV</button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {summaryInsights.map((insight, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h4 className="text-sm font-semibold text-gray-400">{insight.title}</h4>
                      <p className="text-2xl font-bold text-yellow-300 mt-1">{insight.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{insight.description}</p>
                    </div>
                  ))}
                </div>

                {selectedReport === 'sales-growth' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Sales Growth Over Time</h3>
                    <div className="h-96"><Line data={salesGrowthChartData} options={chartOptionsByReport['sales-growth']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'sales-by-product' && (
                  <div>
                                        <h3 className="text-2xl font-semibold text-gray-200 mb-4">Sales by Product</h3>
                    <div className="h-96"><Bar data={salesByProductChartData} options={chartOptionsByReport['sales-by-product']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.product}: ${item.sales.toFixed(2)}</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'sales-by-region' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Sales by Region</h3>
                    <div className="h-96"><Bar data={salesByRegionChartData} options={chartOptionsByReport['sales-by-region']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.region}: ${item.sales.toFixed(2)}</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'customer-lifetime-value' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Customer Lifetime Value (CLV)</h3>
                    <div className="h-96"><Bar data={clvChartData} options={chartOptionsByReport['customer-lifetime-value']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.customer}: ${item.sales.toFixed(2)}</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'average-order-value' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Average Order Value (AOV)</h3>
                    <div className="h-96"><Bar data={aovChartData} options={chartOptionsByReport['average-order-value']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'repeat-purchase-rate' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Repeat Purchase Rate</h3>
                    <div className="h-96"><Bar data={repeatPurchaseRateChartData} options={chartOptionsByReport['repeat-purchase-rate']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.sales.toFixed(1)}%</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'product-performance' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Product Performance</h3>
                    <div className="h-96"><Bar data={productPerformanceChartData} options={chartOptionsByReport['product-performance']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.product}: ${item.sales.toFixed(2)}</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'customer-acquisition' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Customer Acquisition Trends</h3>
                    <div className="h-96"><Line data={customerAcquisitionChartData} options={chartOptionsByReport['customer-acquisition']} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.sales} New Customers</p>
                        <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                          {item.insight.map((line, i) => (
                            <li key={i} className="mb-1">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}