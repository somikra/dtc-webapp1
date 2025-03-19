import React, { useState } from "react";
import { parse } from "papaparse";
import Chart from "chart.js/auto";
import { ArrowRight, Download, RefreshCw, Upload, LogOut, TrendingUp, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const RANGE_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const SalesForecasting = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [salesData, setSalesData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [forecastMethod, setForecastMethod] = useState("Historical Trend");
  const [forecastRange, setForecastRange] = useState("day");
  const [forecastDuration, setForecastDuration] = useState(30);
  const [forecastResult, setForecastResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data.filter((row) => row.date && row.product && row.sales !== undefined && row.quantity !== undefined);
        if (data.length === 0) {
          setError("Invalid CSV format or missing required columns: date, product, sales, quantity");
          return;
        }
        setSalesData(data);
        setError(null);
      },
      error: (err) => setError("Error parsing CSV: " + err.message),
    });
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ["date", "product", "sales", "quantity", "cost", "sku"],
      ["2025-03-01", "Bundle 1-1", "1209650.62", "418", "5.00", "B1-001"],
      ["2025-03-02", "Bundle 4-1", "124322.73", "422.5", "6.00", "B4-001"],
      ["2025-03-01", "Component 2-1", "105526.38", "426", "4.00", "C2-001"],
    ];
    const csvContent = sampleData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-sales-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const products = [...new Set(salesData.map((row) => row.product))];

  function calculateForecast(data, method = "Historical Trend", range = "day", duration) {
    if (!data || data.length === 0) throw new Error("No data available for forecasting");

    const groupedData = data.reduce((acc, row) => {
      if (!acc[row.product]) acc[row.product] = [];
      acc[row.product].push({ date: new Date(row.date), sales: row.sales, quantity: row.quantity });
      return acc;
    }, {});

    const step = range === "day" ? 1 : range === "weekly" ? 7 : 30;
    const forecastSteps = Math.ceil(duration / (range === "day" ? 1 : range === "weekly" ? 7 : 30));
    const forecastDates = [];
    const startDate = new Date("2025-03-18");
    for (let i = 0; i < forecastSteps; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i * step);
      forecastDates.push(date.toISOString().split("T")[0]);
    }

    const predictions = [];
    let totalForecast = 0;
    const insights = [];

    Object.keys(groupedData).forEach((product) => {
      if (selectedProduct && product !== selectedProduct) return;

      const productData = groupedData[product];
      productData.sort((a, b) => a.date - b.date);

      const salesValues = productData.map((d) => d.sales);
      const quantities = productData.map((d) => d.quantity);
      const salesSorted = [...salesValues].sort((a, b) => a - b);
      const q1 = salesSorted[Math.floor(salesSorted.length * 0.25)];
      const q3 = salesSorted[Math.floor(salesSorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      const filteredData = productData.filter((d) => d.sales >= lowerBound && d.sales <= upperBound);
      if (filteredData.length === 0) return;

      const filteredSales = filteredData.map((d) => d.sales);
      const filteredQuantities = filteredData.map((d) => d.quantity);
      const medianSales = median(filteredSales);
      const medianQuantity = median(filteredQuantities);

      const daysSinceFirstSale = (new Date("2025-03-18") - new Date(filteredData[0].date)) / (1000 * 60 * 60 * 24);
      const avgDailySales = filteredSales.reduce((sum, s) => sum + s, 0) / daysSinceFirstSale;
      const avgDailyQuantity = filteredQuantities.reduce((sum, q) => sum + q, 0) / daysSinceFirstSale;

      let forecastQuantities = [];
      let forecastSales = [];

      switch (method) {
        case "Historical Trend": {
          const recentData = filteredData.filter((d) => {
            const daysDiff = (new Date("2025-03-18") - d.date) / (1000 * 60 * 60 * 24);
            return daysDiff <= 90;
          });
          const baseSales = recentData.length > 0 ? median(recentData.map((d) => d.sales)) : medianSales;
          const baseQuantity = recentData.length > 0 ? median(recentData.map((d) => d.quantity)) : medianQuantity;
          const growthRate = 1.02;
          for (let i = 0; i < forecastSteps; i++) {
            const growthFactor = Math.pow(growthRate, i + 1);
            forecastSales.push(baseSales * growthFactor);
            forecastQuantities.push(Math.max(1, Math.round(baseQuantity * growthFactor)));
          }
          insights.push(`<b>${product}</b>: Stable growth trend observed with a 2% increase based on historical median sales.`);
          break;
        }

        case "Seasonal Boost": {
          const baseSales = avgDailySales || medianSales;
          const baseQuantity = avgDailyQuantity || medianQuantity;
          for (let i = 0; i < forecastSteps; i++) {
            const isPeak = (i + 1) % 7 === 0;
            const boost = isPeak ? 1.5 : 1.0;
            forecastSales.push(baseSales * boost);
            forecastQuantities.push(Math.max(1, Math.round(baseQuantity * boost)));
            if (isPeak) insights.push(`<b>${product}</b>: Seasonal peak expected on ${forecastDates[i]}—prepare for a 50% sales increase.`);
          }
          break;
        }

        case "Growth Aggressive": {
          let currentSales = avgDailySales || medianSales;
          let currentQuantity = avgDailyQuantity || medianQuantity;
          const growthRate = 1.10;
          for (let i = 0; i < forecastSteps; i++) {
            currentSales *= growthRate;
            currentQuantity *= growthRate;
            forecastSales.push(currentSales);
            forecastQuantities.push(Math.max(1, Math.round(currentQuantity)));
          }
          insights.push(`<b>${product}</b>: Aggressive growth forecast with a 10% daily increase—monitor inventory closely.`);
          break;
        }

        case "Product Breakout": {
          const allProductsSales = Object.keys(groupedData).map((p) => {
            const pData = groupedData[p].filter((d) => d.sales >= lowerBound && d.sales <= upperBound);
            return { product: p, totalSales: pData.reduce((sum, d) => sum + d.sales, 0) };
          });
          allProductsSales.sort((a, b) => b.totalSales - a.totalSales);
          const top30Percent = allProductsSales.slice(0, Math.ceil(allProductsSales.length * 0.3));
          const isTopProduct = top30Percent.some((p) => p.product === product);

          const baseSales = avgDailySales || medianSales;
          const baseQuantity = avgDailyQuantity || medianQuantity;
          const multiplier = isTopProduct ? 1.8 : 0.5;
          for (let i = 0; i < forecastSteps; i++) {
            forecastSales.push(baseSales * multiplier);
            forecastQuantities.push(Math.max(1, Math.round(baseQuantity * multiplier)));
          }
          insights.push(
            `<b>${product}</b>: ${isTopProduct ? "Top performer—forecast boosted by 80% due to high sales." : "Lower performer—forecast reduced by 50% to optimize inventory."}`
          );
          break;
        }

        default:
          throw new Error("Invalid forecast method");
      }

      forecastQuantities.forEach((quantity, idx) => {
        const sales = forecastSales[idx];
        totalForecast += sales;
        predictions.push({
          date: forecastDates[idx],
          product,
          sales: Math.round(sales * 100) / 100,
          quantity,
        });
      });
    });

    return { predictions, totalForecast, insights };
  }

  function median(arr) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function generateActionPlan(predictions, duration, range) {
    const steps = Math.min(5, duration / (range === "day" ? 1 : range === "weekly" ? 7 : 30));
    const actions = [];

    const predictionsByDate = predictions.reduce((acc, pred) => {
      if (!acc[pred.date]) acc[pred.date] = [];
      acc[pred.date].push(pred);
      return acc;
    }, {});

    const dates = Object.keys(predictionsByDate).sort();
    for (let i = 0; i < steps; i++) {
      const date = dates[i];
      if (!date) continue;

      const productData = predictionsByDate[date];
      const dailySales = productData.reduce((sum, p) => sum + p.sales, 0);
      const dailyQuantity = Math.round(dailySales / 50);

      const avgDailySales = dailySales / productData.length;
      const historicalAvg = salesData
        .filter((row) => new Date(row.date) < new Date("2025-03-18"))
        .reduce((sum, row) => sum + row.sales, 0) / salesData.length;
      const trend = avgDailySales > historicalAvg * 1.2 ? "highGrowth" : "stable";

      const actionSet = {
        stable: {
          text: `Monitor trends for ${productData[0].product}—stock ${Math.round(dailyQuantity / 2)} units!`,
          quantity: Math.round(dailyQuantity / 2),
        },
        highGrowth: {
          text: `High demand for ${productData[0].product}—stock ${dailyQuantity} units to meet growth!`,
          quantity: dailyQuantity,
        },
      };

      actions.push({
        date,
        action: actionSet[trend].text,
        quantity: actionSet[trend].quantity,
      });
    }

    return actions;
  }

  const handleForecast = () => {
    try {
      if (!salesData.length) {
        setError("Please upload sales data first");
        return;
      }
      if (forecastDuration < 1) {
        setError("Forecast duration must be at least 1");
        return;
      }

      const result = calculateForecast(salesData, forecastMethod, forecastRange, forecastDuration);
      const actions = generateActionPlan(result.predictions, forecastDuration, forecastRange);

      setForecastResult({ ...result, actions });
      setError(null);

      const ctx = document.getElementById("forecastChart")?.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: result.predictions.map((p) => p.date),
            datasets: [
              {
                label: "Forecasted Sales",
                data: result.predictions.map((p) => p.sales),
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }
    } catch (err) {
      setError("Error generating forecast: " + err.message);
    }
  };

  const downloadForecastCSV = () => {
    if (!forecastResult) return;

    const csvRows = [
      ["Date", "Product", "Forecasted Sales", "Forecasted Quantity"],
      ...forecastResult.predictions.map((p) => [p.date, p.product, p.sales, p.quantity]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forecast.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/tools");
  };

  try {
    return (
      <div className="bg-gray-900 min-h-screen text-white font-poppins p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Sales Forecasting Dashboard
          </h1>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full">
                <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" /> Navigation
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <a href="/tools-dashboard" className="group px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-green-400">
                    <BarChart2 className="w-4 h-4 mr-2" /> Sales Dashboard
                  </a>
                  <a href="/sales-forecasting" className="group px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-green-400">
                    <TrendingUp className="w-4 h-4 mr-2" /> Sales Forecasting
                  </a>
                </div>
              </div>
              <button onClick={handleSignOut} className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center text-sm font-semibold transform hover:scale-105 flex-shrink-0">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-lg font-semibold">Upload Sales Data (CSV)</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 cursor-pointer"
            />
            <button onClick={downloadSampleCSV} className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 flex items-center text-sm">
              <Download className="h-4 w-4 mr-1" /> Download Sample CSV
            </button>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>

          {salesData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block mb-2 font-semibold">Select Product (Optional)</label>
                <select
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(e.target.value || null)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Products</option>
                  {products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Forecast Method</label>
                <select
                  value={forecastMethod}
                  onChange={(e) => setForecastMethod(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Historical Trend">Historical Trend</option>
                  <option value="Seasonal Boost">Seasonal Boost</option>
                  <option value="Growth Aggressive">Growth Aggressive</option>
                  <option value="Product Breakout">Product Breakout</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Forecast Range</label>
                <select
                  value={forecastRange}
                  onChange={(e) => setForecastRange(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {RANGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <label className="block mt-2 mb-2 font-semibold">Forecast Duration ({forecastRange}s)</label>
                <input
                  type="number"
                  value={forecastDuration}
                  onChange={(e) => setForecastDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleForecast}
            className="w-full max-w-md mx-auto block px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Generate Forecast Now!
          </button>

          {forecastResult && (
            <div className="mt-12 space-y-12">
              <section className="bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                <h2 className="text-2xl font-bold mb-6 text-green-400">Forecast Overview</h2>
                <p className="text-gray-300 mb-4">
                  Total Forecasted Sales: <span className="text-green-400 font-semibold">${Math.round(forecastResult.totalForecast)}</span>
                </p>
                <canvas id="forecastChart" className="mt-6"></canvas>
              </section>

              <section className="masonry-grid">
                {forecastResult.predictions.reduce((acc, pred, idx) => {
                  const dateGroup = acc.find((g) => g.date === pred.date);
                  if (dateGroup) dateGroup.products.push(pred);
                  else acc.push({ date: pred.date, products: [pred] });
                  return acc;
                }, []).map((group, idx) => (
                  <div key={idx} className="bg-gray-700 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt" data-tooltip={`Forecast for ${group.date}`}>
                    <h3 className="text-xl font-semibold text-green-400 mb-4">{group.date}</h3>
                    <ul className="list-none text-gray-300 text-sm space-y-2">
                      {group.products.map((prod, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{prod.product}</span>
                          <span>{prod.quantity} units (${Math.round(prod.sales)})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                <h2 className="text-2xl font-bold mb-6 text-green-400">Action Plan</h2>
                <ul className="list-none text-gray-300 text-sm space-y-2">
                  {forecastResult.actions.map((action, i) => (
                    <li key={i} className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
                      {range} {i + 1} ({action.date}): {action.action}
                    </li>
                  ))}
                </ul>
              </section>

              {forecastResult.insights.length > 0 ? (
                <section className="bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 bg-gradient-to-br from-gray-800 to-gray-900 card-tilt">
                  <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
                    Pro Insights
                    <svg className="ml-2 h-5 w-5 text-green-400 animate-star-twinkle" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
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
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={downloadForecastCSV}
                        className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Download className="h-4 w-4 mr-1 animate-bounce" /> Download Forecast
                      </button>
                    </div>
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
    );
  } catch (renderError) {
    console.error("Rendering Error:", renderError);
    return (
      <div className="bg-gray-900 min-h-screen text-white font-poppins p-8">
        <h1 className="text-3xl font-bold text-red-500">Error Rendering Page</h1>
        <p className="mt-4 text-gray-300">An unexpected error occurred while rendering the page: {renderError.message}</p>
        <p className="mt-2 text-gray-400">Please refresh the page and try again, or contact support if the issue persists.</p>
      </div>
    );
  }
}

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
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default SalesForecasting;