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
  const [selectedReport, setSelectedReport] = useState<string>('total-sales');
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load mock data initially (no database fetch)
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
    console.log('Starting file load:', fileToUpload.name);

    try {
      Papa.parse(fileToUpload, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<any>) => {
          try {
            console.log('CSV headers:', result.meta.fields);
            console.log('Raw parsed data:', result.data);

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

            if (parsedData.length === 0) {
              console.error('No valid data found in CSV');
              alert('No valid data found in the uploaded CSV');
              setUploading(false);
              return;
            }

            console.log('Processed data:', parsedData);

            // Update local state only (no database)
            setSalesData((prevData) => {
              const newData = [...prevData, ...parsedData];
              console.log('Updated salesData:', newData);
              return newData;
            });

            alert('Sales data loaded successfully!');
            setIsUploadModalOpen(false);
            setFileToUpload(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }

            console.log('Data load completed successfully');
          } catch (error) {
            console.error('Error processing parsed data:', error);
            alert('Failed to process data. Check console for details.');
          } finally {
            setUploading(false);
          }
        },
        error: (error: Error) => {
          console.error('Papa Parse error:', error.message);
          alert('Error parsing CSV file. Please check the file format.');
          setUploading(false);
        },
      });
    } catch (error) {
      console.error('Load failed:', error);
      alert('Failed to load sales data. Check console for details.');
      setUploading(false);
    }
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
    try {
      await signOut();
      navigate('/tools');
    } catch (error) {
      console.error('Sign-out error:', (error as Error).message);
    }
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
    .slice(0, 5);

  const topCustomersBySales = [...new Set(filteredData.map(sale => sale.customer))]
    .map(customer => ({
      customer,
      sales: filteredData.filter(sale => sale.customer === customer).reduce((sum, sale) => sum + sale.sales, 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const topRegionsBySales = [...new Set(filteredData.map(sale => `${sale.state}, ${sale.country}`))]
    .map(region => ({
      region,
      sales: filteredData.filter(sale => `${sale.state}, ${sale.country}` === region).reduce((sum, sale) => sum + sale.sales, 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

    const getInsights = () => {
      const customerPurchaseCounts = filteredData.reduce((acc, sale) => {
        acc[sale.customer] = (acc[sale.customer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const repeatCustomerCount = Object.values(customerPurchaseCounts).filter(count => count > 1).length;
      const totalUniqueCustomers = Object.keys(customerPurchaseCounts).length;
      const repeatPurchaseRate = totalUniqueCustomers > 0 ? (repeatCustomerCount / totalUniqueCustomers) * 100 : 0;
    
      // Helper to determine growth/decline for sales growth report
      const dates = [...new Set(filteredData.map(sale => sale.date))].sort();
      const firstSales = dates.length > 0 ? filteredData.filter(sale => sale.date === dates[0]).reduce((sum, sale) => sum + sale.sales, 0) : 0;
      const lastSales = dates.length > 0 ? filteredData.filter(sale => sale.date === dates[dates.length - 1]).reduce((sum, sale) => sum + sale.sales, 0) : 0;
      const growthRate = firstSales > 0 ? ((lastSales - firstSales) / firstSales) * 100 : 0;
      const isGrowth = growthRate > 0;
    
      switch (selectedReport) {
        case 'total-sales':
          return {
            title: 'Total Sales Insights',
            items: [
              {
                sales: totalSales,
                insight: [
                  `Your total sales hit $${totalSales.toFixed(2)}—${totalSales > firstSales ? 'a hot streak worth riding!' : 'a dip to bounce back from!'}`,
                  `- **Top Performers**: Dig into "Sales by Product" to ${totalSales > firstSales ? 'amplify what’s working' : 'revive what’s slipping'}.`,
                  `- **New Markets**: ${totalSales > firstSales ? 'Use this cash to test a new sales channel (e.g., a niche marketplace).' : 'Hold off on expansion—focus on stabilizing core sales first.'}`,
                  `- **Cost Check**: Can you cut costs by 5%? That’s $${(totalSales * 0.05).toFixed(2)} ${totalSales > firstSales ? 'to reinvest in growth' : 'to cushion the decline'}.`,
                ],
              },
              {
                sales: totalOrders,
                insight: [
                  `${totalOrders} orders ${totalOrders > 5 ? 'signal steady action—keep the momentum!' : 'are low—time to spark some buzz!'}`,
                  `- **Repeat Boost**: Launch a "Buy Again" campaign to ${totalOrders > 5 ? 'push for 10% more orders' : 'get back to double digits'}.`,
                  `- **Checkout Flow**: If drop-offs are high, simplify checkout—each lost order costs $${avgOrderValue}.`,
                  `- **Upsell Now**: Add a quick upsell (e.g., "Add this for $5") to ${totalOrders > 5 ? 'boost totals fast' : 'lift order value'}.`,
                ],
              },
            ],
          };
    
        case 'sales-by-product':
          return {
            title: 'Sales by Product Insights',
            items: topProductsBySales.slice(0, 3).map((item, index) => {
              const productSalesPercentage = (item.sales / totalSales) * 100;
              const productSalesHistory = filteredData.filter(sale => sale.product === item.product);
              const earliestSales = productSalesHistory.length > 1 ? productSalesHistory[0].sales : item.sales;
              const isProductGrowth = item.sales > earliestSales;
    
              if (index === 0) {
                return {
                  product: item.product,
                  sales: item.sales,
                  insight: [
                    `"${item.product}" leads with $${item.sales.toFixed(2)} (${productSalesPercentage.toFixed(1)}% of sales)—your ${isProductGrowth ? 'rising star!' : 'steady champ slipping!'}`,
                    `- **Scale It**: ${isProductGrowth ? 'Boost ad spend by 25% to fuel this surge.' : 'Double down on ads to halt the slide.'}`,
                    `- **Feature It**: ${isProductGrowth ? 'Make it the homepage hero to keep the hype alive.' : 'Refresh its spotlight—bring back the buzz.'}`,
                    `- **Stock Up**: Ensure 3x inventory—stockouts could cost $${(item.sales * 0.15).toFixed(2)} in ${isProductGrowth ? 'lost growth' : 'missed recovery'}.`,
                  ],
                };
              } else if (index === 1) {
                return {
                  product: item.product,
                  sales: item.sales,
                  insight: [
                    `"${item.product}" pulls $${item.sales.toFixed(2)}—a ${isProductGrowth ? 'climbing #2!' : 'fading contender!'}`,
                    `- **Bundle Play**: Pair it with the top seller for a 10% off deal to ${isProductGrowth ? 'ride the wave' : 'spark interest'}.`,
                    `- **Niche Ads**: Test targeted ads ${isProductGrowth ? 'to amplify its rise' : 'to rekindle demand'}.`,
                    `- **Price Test**: ${isProductGrowth ? 'Try a 5% hike—growth might hold it.' : 'Drop 5% to see if volume picks up.'}`,
                  ],
                };
              } else {
                return {
                  product: item.product,
                  sales: item.sales,
                  insight: [
                    `"${item.product}" logs $${item.sales.toFixed(2)}—${isProductGrowth ? 'gaining traction!' : 'losing steam!'}`,
                    `- **Cross-Sell**: Promote it with top sellers to ${isProductGrowth ? 'build on the uptick' : 'stop the drop'}.`,
                    `- **Feedback Loop**: Ask buyers what’s up—${isProductGrowth ? 'double down on what they love' : 'fix what’s off'}.`,
                    `- **Promo Push**: Run a flash sale to ${isProductGrowth ? 'push it higher' : 'test if it can rebound'}.`,
                  ],
                };
              }
            }),
          };
    
        case 'sales-by-region':
          return {
            title: 'Sales by Region Insights',
            items: topRegionsBySales.slice(0, 3).map((item, index) => {
              const regionSalesPercentage = (item.sales / totalSales) * 100;
              const regionSalesHistory = filteredData.filter(sale => `${sale.state}, ${sale.country}` === item.region);
              const earliestRegionSales = regionSalesHistory.length > 1 ? regionSalesHistory[0].sales : item.sales;
              const isRegionGrowth = item.sales > earliestRegionSales;
    
              if (index === 0) {
                return {
                  region: item.region,
                  sales: item.sales,
                  insight: [
                    `"${item.region}" dominates with $${item.sales.toFixed(2)} (${regionSalesPercentage.toFixed(1)}% of sales)—your ${isRegionGrowth ? 'booming hub!' : 'top spot cooling off!'}`,
                    `- **Local Ads**: ${isRegionGrowth ? 'Double down with region-specific campaigns to keep it hot.' : 'Revive with fresh local ads to reclaim the lead.'}`,
                    `- **Fast Delivery**: ${isRegionGrowth ? 'Add a local warehouse to lock in this growth.' : 'Speed up shipping—don’t lose loyal buyers.'}`,
                    `- **Event Boost**: Tie promos to local events to ${isRegionGrowth ? 'max out the surge' : 'bring back the energy'}.`,
                  ],
                };
              } else if (index === 1) {
                return {
                  region: item.region,
                  sales: item.sales,
                  insight: [
                    `"${item.region}" brings $${item.sales.toFixed(2)}—a ${isRegionGrowth ? 'rising contender!' : 'solid market slipping!'}`,
                    `- **Geo-Target**: Run ads tailored to ${isRegionGrowth ? 'fuel its climb' : 'halt the decline'}.`,
                    `- **Competitor Watch**: Check rivals here—${isRegionGrowth ? 'steal their edge to grow faster' : 'see what’s pulling sales away'}.`,
                    `- **Loyalty Play**: Offer a region-exclusive deal to ${isRegionGrowth ? 'keep the momentum' : 'win back buyers'}.`,
                  ],
                };
              } else {
                return {
                  region: item.region,
                  sales: item.sales,
                  insight: [
                    `"${item.region}" logs $${item.sales.toFixed(2)}—${isRegionGrowth ? 'picking up steam!' : 'fading fast!'}`,
                    `- **Test Expansion**: ${isRegionGrowth ? 'Try a small ad push to ride the wave.' : 'Cut shipping costs to spark interest.'}`,
                    `- **Local Buzz**: Partner with influencers to ${isRegionGrowth ? 'amplify the uptick' : 'stop the bleed'}.`,
                    `- **Data Dive**: Look at trends—${isRegionGrowth ? 'what’s driving this?' : 'what’s going wrong?'}`,
                  ],
                };
              }
            }),
          };
    
        case 'customer-lifetime-value':
          return {
            title: 'Customer Lifetime Value Insights',
            items: topCustomersBySales.slice(0, 3).map((item, index) => {
              const customerOrders = filteredData.filter(sale => sale.customer === item.customer).length;
              const customerSalesHistory = filteredData.filter(sale => sale.customer === item.customer);
              const earliestCustomerSales = customerSalesHistory.length > 1 ? customerSalesHistory[0].sales : item.sales;
              const isCustomerGrowth = item.sales > earliestCustomerSales;
    
              if (index === 0) {
                return {
                  customer: item.customer,
                  sales: item.sales,
                  insight: [
                    `"${item.customer}" spent $${item.sales.toFixed(2)} over ${customerOrders} orders—your ${isCustomerGrowth ? 'VIP on the rise!' : 'top fan slowing down!'}`,
                    `- **VIP Perks**: ${isCustomerGrowth ? 'Offer early access to keep them hooked.' : 'Re-engage with a special perk.'}`,
                    `- **Personal Note**: Send a thank-you with a 15% off code—${isCustomerGrowth ? 'fuel their loyalty' : 'bring them back'}.`,
                    `- **Referral Ask**: Offer a $10 credit for referrals—${isCustomerGrowth ? 'they’re a growing asset' : 'revive their spark'}.`,
                  ],
                };
              } else if (index === 1) {
                return {
                  customer: item.customer,
                  sales: item.sales,
                  insight: [
                    `"${item.customer}" clocks $${item.sales.toFixed(2)}—${isCustomerGrowth ? 'climbing fast!' : 'loyal but waning!'}`,
                    `- **Upsell Time**: Suggest add-ons to ${isCustomerGrowth ? 'ride their spending spree' : 'boost their next buy'}.`,
                    `- **Re-Engage**: Hit them with a "We Miss You" offer if ${isCustomerGrowth ? 'they keep up' : 'they’ve slowed'}.`,
                    `- **Survey Them**: Ask what’s clicking—${isCustomerGrowth ? 'scale it up' : 'fix the drop-off'}.`,
                  ],
                };
              } else {
                return {
                  customer: item.customer,
                  sales: item.sales,
                  insight: [
                    `"${item.customer}" adds $${item.sales.toFixed(2)}—${isCustomerGrowth ? 'building loyalty!' : 'at risk of fading!'}`,
                    `- **Reward Consistency**: Toss in a freebie to ${isCustomerGrowth ? 'sweeten the deal' : 'keep them around'}.`,
                    `- **Custom Offer**: Tailor a deal to ${isCustomerGrowth ? 'grow their spend' : 'stop the churn'}.`,
                    `- **Check In**: Reach out—${isCustomerGrowth ? 'fan the flame' : 'don’t lose them'}.`,
                  ],
                };
              }
            }),
          };
    
        case 'average-order-value':
          return {
            title: 'Average Order Value Insights',
            items: [
              {
                sales: parseFloat(avgOrderValue),
                insight: [
                  `Your AOV of $${avgOrderValue} is ${parseFloat(avgOrderValue) > 50 ? 'driving profit—nice!' : 'low—let’s lift it!'}`,
                  `- **Upsell Easy**: Add a "Complete the Set" option to ${parseFloat(avgOrderValue) > 50 ? 'push it higher' : 'bump it up 20%'}.`,
                  `- **Free Shipping**: Set a $${(parseFloat(avgOrderValue) * 1.3).toFixed(2)} threshold to ${parseFloat(avgOrderValue) > 50 ? 'keep carts growing' : 'encourage bigger buys'}.`,
                  `- **Low Order Fix**: For orders under $${(parseFloat(avgOrderValue) * 0.7).toFixed(2)}, suggest add-ons to ${parseFloat(avgOrderValue) > 50 ? 'maximize value' : 'get back on track'}.`,
                ],
              },
            ],
          };
    
        case 'repeat-purchase-rate':
          return {
            title: 'Repeat Purchase Rate Insights',
            items: [
              {
                sales: repeatPurchaseRate,
                insight: [
                  `Your repeat rate is ${repeatPurchaseRate.toFixed(1)}% with ${repeatCustomerCount} loyal buyers—${repeatPurchaseRate > 20 ? 'solid loyalty brewing!' : 'room to grow that repeat vibe!'}`,
                  `- **Loyalty Kick**: Start a points program to ${repeatPurchaseRate > 20 ? 'lock in this base' : 'boost repeat buys'}.`,
                  `- **Win Back**: Email one-timers with a 10% off code to ${repeatPurchaseRate > 20 ? 'grow the crew' : 'jumpstart loyalty'}.`,
                  `- **Subscription Pitch**: Offer 15% off recurring orders to ${repeatPurchaseRate > 20 ? 'cement their habit' : 'get them hooked'}.`,
                ],
              },
            ],
          };
    
        case 'sales-growth':
          return {
            title: 'Sales Growth Insights',
            items: [
              {
                sales: totalSales,
                insight: [
                  `Sales hit $${totalSales.toFixed(2)} with a ${growthRate.toFixed(1)}% ${isGrowth ? 'climb—killer trajectory!' : 'dip—time to pivot!'}`,
                  `- **Peak Push**: Find your ${isGrowth ? 'hottest day in the chart and rerun that promo' : 'weak spots and test a fresh promo'}.`,
                  `- **Seasonal Prep**: ${isGrowth ? 'If this ties to a season, stock up 30 days early.' : 'Look for seasonal drags—plan a counter-promo.'}`,
                  `- **Channel Test**: ${isGrowth ? 'Ride this wave with a new sales platform (e.g., a niche marketplace).' : 'Focus on core channels to stabilize first.'}`,
                ],
              },
            ],
          };
    
        case 'product-performance':
          return {
            title: 'Product Performance Insights',
            items: topProductsBySales.slice(0, 3).map((item, index) => {
              const unitsSold = filteredData.filter(sale => sale.product === item.product).reduce((sum, sale) => sum + sale.quantity, 0);
              const productSalesHistory = filteredData.filter(sale => sale.product === item.product);
              const earliestSales = productSalesHistory.length > 1 ? productSalesHistory[0].sales : item.sales;
              const isProductGrowth = item.sales > earliestSales;
    
              if (index === 0) {
                return {
                  product: item.product,
                  sales: item.sales,
                  insight: [
                    `"${item.product}" tops out at $${item.sales.toFixed(2)} and ${unitsSold} units—your ${isProductGrowth ? 'hot streak!' : 'steady earner slipping!'}`,
                    `- **Restock Fast**: Keep 2-3x inventory—demand’s ${isProductGrowth ? 'surging' : 'at risk'}.`,
                    `- **Cross-Promote**: Feature it with related items to ${isProductGrowth ? 'fuel the fire' : 'revive interest'}.`,
                    `- **Price Play**: ${isProductGrowth ? 'Test a 10% hike—growth might hold.' : 'Drop 5% to spark volume.'}`,
                  ],
                };
              } else if (index === 1) {
                return {
                  product: item.product,
                  sales: item.sales,
                  insight: [
                    `"${item.product}" hits $${item.sales.toFixed(2)} and ${unitsSold} units—${isProductGrowth ? 'climbing strong!' : 'losing ground!'}`,
                    `- **Bundle It**: Pair with the top product to ${isProductGrowth ? 'boost both' : 'stop the slide'}.`,
                    `- **Spotlight**: Shout it out on social to ${isProductGrowth ? 'ride the rise' : 'bring it back'}.`,
                    `- **Margin Check**: ${isProductGrowth ? 'Can you source cheaper to grow profit?' : 'Cut costs to offset the dip?'}`,
                  ],
                };
              } else {
                return {
                  product: item.product,
                  sales: item.sales,
                  insight: [
                    `"${item.product}" logs $${item.sales.toFixed(2)} and ${unitsSold} units—${isProductGrowth ? 'on the up!' : 'fading fast!'}`,
                    `- **Promo Test**: Run a 20% off sale to ${isProductGrowth ? 'push it higher' : 'test a rebound'}.`,
                    `- **Review Boost**: Get reviews to ${isProductGrowth ? 'build on trust' : 'restore confidence'}.`,
                    `- **Category Push**: Highlight it in its category to ${isProductGrowth ? 'keep growing' : 'halt the drop'}.`,
                  ],
                };
              }
            }),
          };
    
        case 'customer-acquisition':
          const acquisitionDates = [...new Set(filteredData.map(sale => sale.date))].sort();
          const newCustomersFirstDay = acquisitionDates.length > 0 ? [...new Set(filteredData.filter(sale => sale.date === acquisitionDates[0]).map(sale => sale.customer))].length : 0;
          const newCustomersLastDay = acquisitionDates.length > 0 ? [...new Set(filteredData.filter(sale => sale.date === acquisitionDates[acquisitionDates.length - 1]).map(sale => sale.customer))].length : 0;
          const isAcquisitionGrowth = newCustomersLastDay > newCustomersFirstDay;
    
          return {
            title: 'Customer Acquisition Insights',
            items: [
              {
                sales: totalUniqueCustomers,
                insight: [
                  `You’ve gained ${totalUniqueCustomers} new customers—${isAcquisitionGrowth ? 'a growing crowd!' : 'a slowdown to tackle!'}`,
                  `- **Retarget**: Hit newbies with a 10% off ad to ${isAcquisitionGrowth ? 'seal the deal fast' : 'restart the flow'}.`,
                  `- **Source Hunt**: Find where they’re coming from—${isAcquisitionGrowth ? 'double down there' : 'fix what’s drying up'}.`,
                  `- **Welcome Flow**: Send a 3-email series to ${isAcquisitionGrowth ? 'hook them tight' : 'revive the pipeline'}.`,
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
      case 'total-sales':
        return [
          { title: 'Total Sales', value: `$${totalSales.toFixed(2)}`, description: `Your total sales for the selected period.` },
          { title: 'Total Orders', value: totalOrders.toString(), description: `Total number of orders placed.` },
          { title: 'Unique Customers', value: repeatCustomers.toString(), description: `Number of unique customers who made purchases.` },
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
        const customerPurchaseCounts = filteredData.reduce((acc, sale) => {
          acc[sale.customer] = (acc[sale.customer] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const repeatCustomerCount = Object.values(customerPurchaseCounts).filter(count => count > 1).length;
        const totalUniqueCustomers = Object.keys(customerPurchaseCounts).length;
        const repeatPurchaseRate = totalUniqueCustomers > 0 ? (repeatCustomerCount / totalUniqueCustomers) * 100 : 0;
        return [
          { title: 'Repeat Purchase Rate', value: `${repeatPurchaseRate.toFixed(1)}%`, description: `Percentage of customers who bought more than once.` },
          { title: 'Repeat Customers', value: repeatCustomerCount.toString(), description: `Number of customers with multiple purchases.` },
          { title: 'Total Customers', value: totalUniqueCustomers.toString(), description: `Total unique customers in the filtered data.` },
        ];
      case 'sales-growth':
        const dates = [...new Set(filteredData.map(sale => sale.date))].sort();
        const firstSales = dates.length > 0 ? filteredData.filter(sale => sale.date === dates[0]).reduce((sum, sale) => sum + sale.sales, 0) : 0;
        const lastSales = dates.length > 0 ? filteredData.filter(sale => sale.date === dates[dates.length - 1]).reduce((sum, sale) => sum + sale.sales, 0) : 0;
        const growthRate = firstSales > 0 ? (((lastSales - firstSales) / firstSales) * 100).toFixed(1) : 'N/A';
        return [
          { title: 'Sales Growth Rate', value: `${growthRate}%`, description: `Sales growth from the first to the last date.` },
          { title: 'Total Sales', value: `$${totalSales.toFixed(2)}`, description: `Total sales for the period.` },
          { title: 'Highest Daily Sales', value: `$${Math.max(...dates.map(date => filteredData.filter(sale => sale.date === date).reduce((sum, sale) => sum + sale.sales, 0)), 0).toFixed(2)}`, description: `Highest sales in a single day.` },
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

  const totalSalesChartData: ChartData<'bar'> = {
    labels: ['Total Sales'],
    datasets: [{ label: 'Sales ($)', data: [totalSales], backgroundColor: 'rgba(251, 191, 36, 0.9)', borderColor: 'rgba(251, 146, 60, 1)', borderWidth: 2, barThickness: 60, borderRadius: 10 }],
  };

  const salesByProductChartData: ChartData<'bar'> = {
    labels: [...new Set(filteredData.map(sale => sale.product))],
    datasets: [{ label: 'Sales ($)', data: [...new Set(filteredData.map(sale => sale.product))].map(product => filteredData.filter(sale => sale.product === product).reduce((sum, sale) => sum + sale.sales, 0)), backgroundColor: 'rgba(255, 99, 132, 0.9)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 2, borderRadius: 5 }],
  };

  const salesByRegionChartData: ChartData<'bar'> = {
    labels: [...new Set(filteredData.map(sale => `${sale.state}, ${sale.country}`))],
    datasets: [{ label: 'Sales ($)', data: [...new Set(filteredData.map(sale => `${sale.state}, ${sale.country}`))].map(region => filteredData.filter(sale => `${sale.state}, ${sale.country}` === region).reduce((sum, sale) => sum + sale.sales, 0)), backgroundColor: 'rgba(54, 162, 235, 0.9)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 2, borderRadius: 5 }],
  };

  const clvChartData: ChartData<'bar'> = {
    labels: [...new Set(filteredData.map(sale => sale.customer))],
    datasets: [{ label: 'Lifetime Value ($)', data: [...new Set(filteredData.map(sale => sale.customer))].map(customer => filteredData.filter(sale => sale.customer === customer).reduce((sum, sale) => sum + sale.sales, 0)), backgroundColor: 'rgba(75, 192, 192, 0.9)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2, borderRadius: 5 }],
  };

  const aovChartData: ChartData<'bar'> = {
    labels: ['Average Order Value', 'Baseline'],
    datasets: [{ label: 'AOV ($)', data: [parseFloat(avgOrderValue), 0], backgroundColor: 'rgba(153, 102, 255, 0.9)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 2, barThickness: 60, borderRadius: 10, barPercentage: 0.5 }],
  };

  const repeatPurchaseRateChartData: ChartData<'bar'> = {
    labels: ['Repeat Purchase Rate', 'Baseline'],
    datasets: [{
      label: '% Repeat Customers',
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
    labels: [...new Set(filteredData.map(sale => sale.date))],
    datasets: [{ label: 'Sales ($)', data: [...new Set(filteredData.map(sale => sale.date))].map(date => filteredData.filter(sale => sale.date === date).reduce((sum, sale) => sum + sale.sales, 0)), borderColor: 'rgba(251, 191, 36, 1)', backgroundColor: 'rgba(251, 191, 36, 0.4)', fill: true, tension: 0.4, pointRadius: 6, pointBackgroundColor: '#FBBF24', pointBorderColor: '#F59E0B', pointHoverRadius: 8 }],
  };

  const productPerformanceChartData: ChartData<'bar'> = {
    labels: [...new Set(filteredData.map(sale => sale.product))],
    datasets: [
      { label: 'Units Sold', data: [...new Set(filteredData.map(sale => sale.product))].map(product => filteredData.filter(sale => sale.product === product).reduce((sum, sale) => sum + sale.quantity, 0)), backgroundColor: 'rgba(54, 162, 235, 0.9)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 2, borderRadius: 5 },
      { label: 'Sales ($)', data: [...new Set(filteredData.map(sale => sale.product))].map(product => filteredData.filter(sale => sale.product === product).reduce((sum, sale) => sum + sale.sales, 0)), backgroundColor: 'rgba(255, 99, 132, 0.9)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 2, borderRadius: 5 },
    ],
  };

  const customerAcquisitionChartData: ChartData<'line'> = {
    labels: [...new Set(filteredData.map(sale => sale.date))],
    datasets: [{ label: 'New Customers', data: [...new Set(filteredData.map(sale => sale.date))].map(date => [...new Set(filteredData.filter(sale => sale.date === date).map(sale => sale.customer))].length), borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.4)', fill: true, tension: 0.4, pointRadius: 6, pointBackgroundColor: '#4BC0C0', pointBorderColor: '#6DE7E7', pointHoverRadius: 8 }],
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
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-wrap justify-between items-center gap-4">
          <nav className="flex flex-wrap gap-3">
            <a href="/tools-dashboard" className="px-3 py-1.5 bg-yellow-300 text-gray-900 rounded-full font-semibold text-sm transition-all duration-300">Sales Dashboard</a>
            <a href="/sales-forecasting" className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold text-sm transition-all duration-300">Sales Forecasting</a>
            <a href="/seo-analysis" className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold text-sm transition-all duration-300">SEO Analysis</a>
            <a href="/ad-copy-generator" className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold text-sm transition-all duration-300">AI Ad Copy Generator</a>
            <a href="/customer-sentiment" className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold text-sm transition-all duration-300">AI Customer Sentiment</a>
            <a href="/pricing-optimizer" className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold text-sm transition-all duration-300">AI Pricing Optimizer</a>
            <a href="/trend-spotter" className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold text-sm transition-all duration-300">AI Trend Spotter</a>
            <a href="/email-campaign" className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-yellow-300 rounded-full font-semibold text-sm transition-all duration-300">AI Email Campaign</a>
          </nav>
          <button onClick={handleSignOut} className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full shadow-lg hover:from-orange-600 hover:to-yellow-500 transition-all duration-300 flex items-center text-sm font-semibold whitespace-nowrap">
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </button>
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

          <div className="bg-gray-700 p-6 rounded-lg mb-6 relative z-10">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Filter Your Reports</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="w-full sm:w-1/2 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="w-full sm:w-1/2 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative group" ref={productRef}>
                <label className="block text-sm font-medium text-gray-400 mb-1">Products</label>
                <div onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)} className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white flex items-center justify-between cursor-pointer">
                  <span className="truncate">{selectedProducts.length === 0 ? 'All Products' : selectedProducts.join(', ') || 'Select Products'}</span>
                  {isProductDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                {isProductDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                      <div className="flex justify-between mb-2">
                        <button onClick={selectAllProducts} className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs hover:bg-orange-600 transition-all duration-300">Select All</button>
                        <button onClick={unselectAllProducts} className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs hover:bg-purple-600 transition-all duration-300">Unselect All</button>
                      </div>
                      {allProducts.map((product) => (
                        <label key={product} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                          <input type="checkbox" checked={selectedProducts.includes(product)} onChange={() => handleProductChange(product)} className="h-4 w-4 text-yellow-300 border-gray-600 rounded focus:ring-yellow-300" />
                          <span className="text-white text-sm">{product}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">Select multiple products or choose "All".</span>
              </div>
              <div className="relative group" ref={stateRef}>
                <label className="block text-sm font-medium text-gray-400 mb-1">States</label>
                <div onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)} className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white flex items-center justify-between cursor-pointer">
                  <span className="truncate">{selectedStates.length === 0 ? 'All States' : selectedStates.join(', ') || 'Select States'}</span>
                  {isStateDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                {isStateDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                      <div className="flex justify-between mb-2">
                        <button onClick={selectAllStates} className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs hover:bg-orange-600 transition-all duration-300">Select All</button>
                        <button onClick={unselectAllStates} className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs hover:bg-purple-600 transition-all duration-300">Unselect All</button>
                      </div>
                      {allStates.map((state) => (
                        <label key={state} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                          <input type="checkbox" checked={selectedStates.includes(state)} onChange={() => handleStateChange(state)} className="h-4 w-4 text-yellow-300 border-gray-600 rounded focus:ring-yellow-300" />
                          <span className="text-white text-sm">{state}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">Select multiple states or choose "All".</span>
              </div>
              <div className="relative group" ref={countryRef}>
                <label className="block text-sm font-medium text-gray-400 mb-1">Countries</label>
                <div onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white flex items-center justify-between cursor-pointer">
                  <span className="truncate">{selectedCountries.length === 0 ? 'All Countries' : selectedCountries.join(', ') || 'Select Countries'}</span>
                  {isCountryDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                {isCountryDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                      <div className="flex justify-between mb-2">
                        <button onClick={selectAllCountries} className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs hover:bg-orange-600 transition-all duration-300">Select All</button>
                        <button onClick={unselectAllCountries} className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs hover:bg-purple-600 transition-all duration-300">Unselect All</button>
                      </div>
                      {allCountries.map((country) => (
                        <label key={country} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                          <input type="checkbox" checked={selectedCountries.includes(country)} onChange={() => handleCountryChange(country)} className="h-4 w-4 text-yellow-300 border-gray-600 rounded focus:ring-yellow-300" />
                          <span className="text-white text-sm">{country}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">Select multiple countries or choose "All".</span>
              </div>
              <div className="relative group" ref={customerRef}>
                <label className="block text-sm font-medium text-gray-400 mb-1">Customers</label>
                <div onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)} className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white flex items-center justify-between cursor-pointer">
                  <span className="truncate">{selectedCustomers.length === 0 ? 'All Customers' : selectedCustomers.join(', ') || 'Select Customers'}</span>
                  {isCustomerDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                {isCustomerDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                      <div className="flex justify-between mb-2">
                        <button onClick={selectAllCustomers} className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs hover:bg-orange-600 transition-all duration-300">Select All</button>
                        <button onClick={unselectAllCustomers} className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs hover:bg-purple-600 transition-all duration-300">Unselect All</button>
                      </div>
                      {allCustomers.map((customer) => (
                        <label key={customer} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                          <input type="checkbox" checked={selectedCustomers.includes(customer)} onChange={() => handleCustomerChange(customer)} className="h-4 w-4 text-yellow-300 border-gray-600 rounded focus:ring-yellow-300" />
                          <span className="text-white text-sm">{customer}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">Select multiple customers or choose "All".</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Select Report Type</h3>
            <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)} className="w-full md:w-96 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm">
              <option value="total-sales">Total Sales Report</option>
              <option value="sales-by-product">Sales by Product</option>
              <option value="sales-by-region">Sales by Region</option>
              <option value="customer-lifetime-value">Customer Lifetime Value (CLV)</option>
              <option value="average-order-value">Average Order Value (AOV)</option>
              <option value="repeat-purchase-rate">Repeat Purchase Rate</option>
              <option value="sales-growth">Sales Growth Over Time</option>
              <option value="product-performance">Product Performance</option>
              <option value="customer-acquisition">Customer Acquisition Trends</option>
            </select>
          </div>

          {isUploadModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Load Your Sales Data</h2>
                <p className="text-gray-400 mb-4">Drop your CSV here for instant insights—no data gets saved, it’s all vibes and analytics!</p>
                <label className="block mb-4">
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full px-3 py-1.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
                  />
                </label>
                <button onClick={downloadSampleCSV} className="w-full mb-4 px-4 py-2 bg-yellow-300 text-gray-900 rounded-full hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center text-sm">
                  <Download className="h-4 w-4 mr-1" /> Download Sample CSV
                </button>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-all duration-300 text-sm">Cancel</button>
                  <button
                    onClick={handleFileUpload}
                    className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 text-sm flex items-center"
                    disabled={uploading || !fileToUpload}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
                      </>
                    ) : (
                      'Load Data'
                    )}
                  </button>
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
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-200 mb-4">Summary Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {summaryInsights.map((insight, index) => (
                      <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-md">
                        <h4 className="text-lg font-semibold text-gray-200 mb-2">{insight.title}</h4>
                        <p className="text-xl text-yellow-300">{insight.value}</p>
                        <p className="text-gray-400 mt-2">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReport === 'total-sales' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Total Sales Report</h3>
                    <div className="h-96"><Bar data={totalSalesChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Total Sales Overview' } } }} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="bg-gray-900 p-6 rounded-lg shadow-md"><h4 className="text-lg font-semibold text-gray-200 mb-2">Total Sales</h4><p className="text-3xl font-bold text-yellow-300">${totalSales.toFixed(2)}</p></div>
                      <div className="bg-gray-900 p-6 rounded-lg shadow-md"><h4 className="text-lg font-semibold text-gray-200 mb-2">Total Orders</h4><p className="text-3xl font-bold text-yellow-300">{totalOrders}</p></div>
                      <div className="bg-gray-900 p-6 rounded-lg shadow-md"><h4 className="text-lg font-semibold text-gray-200 mb-2">Average Order Value</h4><p className="text-3xl font-bold text-yellow-300">${avgOrderValue}</p></div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'sales-by-product' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Sales by Product</h3>
                    <div className="h-96"><Bar data={salesByProductChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Sales Distribution by Product' } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <h5 className="text-lg font-semibold text-gray-200">{item.product}</h5>
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'sales-by-region' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Sales by Region</h3>
                    <div className="h-96"><Bar data={salesByRegionChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Sales by Region' } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <h5 className="text-lg font-semibold text-gray-200">{item.region}</h5>
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'customer-lifetime-value' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Customer Lifetime Value (CLV)</h3>
                    <div className="h-96"><Bar data={clvChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Customer Lifetime Value' } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <h5 className="text-lg font-semibold text-gray-200">{item.customer}</h5>
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'average-order-value' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Average Order Value (AOV)</h3>
                    <div className="h-96"><Bar data={aovChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Average Order Value' } }, scales: { ...trendyChartOptions.scales, x: { ...trendyChartOptions.scales.x, ticks: { ...trendyChartOptions.scales.x.ticks, callback: (value) => (value === 1 ? 'AOV' : '') } } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'repeat-purchase-rate' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Repeat Purchase Rate</h3>
                    <div className="h-96"><Bar data={repeatPurchaseRateChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Repeat Purchase Rate' } }, scales: { ...trendyChartOptions.scales, y: { ...trendyChartOptions.scales.y, ticks: { ...trendyChartOptions.scales.y.ticks, callback: (value) => `${value}%` } }, x: { ...trendyChartOptions.scales.x, ticks: { ...trendyChartOptions.scales.x.ticks, callback: (value) => (value === 1 ? 'Repeat Rate' : '') } } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.sales.toFixed(1)}%</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'sales-growth' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Sales Growth Over Time</h3>
                    <div className="h-96"><Line data={salesGrowthChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Sales Growth Trend' } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">${item.sales.toFixed(2)}</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport === 'product-performance' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Product Performance</h3>
                    <div className="h-96"><Bar data={productPerformanceChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Product Performance' } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <h5 className="text-lg font-semibold text-gray-200">{item.product}</h5>
                        <p className="text-xl text-yellow-300">Sales: ${item.sales.toFixed(2)}</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

{selectedReport === 'customer-acquisition' && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-200 mb-4">Customer Acquisition Trends</h3>
                    <div className="h-96"><Line data={customerAcquisitionChartData} options={{ ...trendyChartOptions, plugins: { ...trendyChartOptions.plugins, title: { text: 'Customer Acquisition Trend' } } }} /></div>
                    <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-2">{insightsTitle}</h4>
                    {actionableInsights.map((item, index) => (
                      <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
                        <p className="text-xl text-yellow-300">{item.sales} New Customers</p>
                        <ul className="text-gray-400 mt-2 list-disc list-inside">
                          {item.insight.map((point, idx) => <li key={idx}>{point}</li>)}
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

      <footer className="bg-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 DTC Sales Dashboard. Built for the bold—your data stays yours, always.
          </p>
        </div>
      </footer>
    </div>
  );
}