import React, { useState } from 'react';
import Papa from 'papaparse';

const ForecastingTool = () => {
  const [fileData, setFileData] = useState(null);
  const [forecastMethod, setForecastMethod] = useState('historical-trend');
  const [range, setRange] = useState('Day');
  const [duration, setDuration] = useState(30);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const requiredFields = ['date', 'product', 'sales', 'quantity'];
        const hasRequiredFields = requiredFields.every(field => result.meta.fields.includes(field));
        if (!hasRequiredFields) {
          setError('CSV must contain date, product, sales, and quantity columns');
          setLoading(false);
          return;
        }
        setFileData(result.data);
        setError('');
        setLoading(false);
      },
      error: () => {
        setError('Failed to parse CSV');
        setLoading(false);
      },
    });
  };

  // Forecast functions
  const historicalTrend = (data, startDate, duration, range) => {
    const totalUnits = data.reduce((sum, row) => sum + parseInt(row.quantity), 0);
    const totalSales = data.reduce((sum, row) => sum + parseFloat(row.sales), 0);
    const start = new Date(data[0].date);
    const end = new Date(data[data.length - 1].date);
    const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
    const dailyAvgUnits = totalUnits / days;
    const dailyAvgSales = totalSales / days;
    return generateForecast(dailyAvgUnits, dailyAvgSales, startDate, duration, range, data);
  };

  const seasonalBoost = (data, startDate, duration, range) => {
    const totalUnits = data.reduce((sum, row) => sum + parseInt(row.quantity), 0);
    const totalSales = data.reduce((sum, row) => sum + parseFloat(row.sales), 0);
    const days = (new Date(data[data.length - 1].date) - new Date(data[0].date)) / (1000 * 60 * 60 * 24) + 1;
    const dailyAvgUnits = totalUnits / days;
    const dailyAvgSales = totalSales / days;
    const boostFactor = 1.2; // 20% boost for seasonal peaks
    return generateForecast(dailyAvgUnits, dailyAvgSales, startDate, duration, range, data, (date) => {
      const month = new Date(date).getMonth();
      const monthData = data.filter(row => new Date(row.date).getMonth() === month);
      const monthUnits = monthData.reduce((sum, row) => sum + parseInt(row.quantity), 0);
      return monthUnits > totalUnits / 12 ? boostFactor : 1; // Boost if above average monthly units
    });
  };

  const growthAggressive = (data, startDate, duration, range) => {
    const totalUnits = data.reduce((sum, row) => sum + parseInt(row.quantity), 0);
    const totalSales = data.reduce((sum, row) => sum + parseFloat(row.sales), 0);
    const days = (new Date(data[data.length - 1].date) - new Date(data[0].date)) / (1000 * 60 * 60 * 24) + 1;
    const dailyAvgUnits = totalUnits / days;
    const dailyAvgSales = totalSales / days;
    const growthFactor = 2; // 2x growth from historical average
    return generateForecast(dailyAvgUnits * growthFactor, dailyAvgSales * growthFactor, startDate, duration, range, data);
  };

  const productBreakout = (data, startDate, duration, range) => {
    const products = [...new Set(data.map(row => row.product))];
    const forecasts = products.map(product => {
      const productData = data.filter(row => row.product === product);
      const totalUnits = productData.reduce((sum, row) => sum + parseInt(row.quantity), 0);
      const totalSales = productData.reduce((sum, row) => sum + parseFloat(row.sales), 0);
      const days = (new Date(productData[productData.length - 1].date) - new Date(productData[0].date)) / (1000 * 60 * 60 * 24) + 1;
      const dailyAvgUnits = totalUnits / days;
      const dailyAvgSales = totalSales / days;
      return generateForecast(dailyAvgUnits, dailyAvgSales, startDate, duration, range, productData);
    });
    return forecasts.flat();
  };

  const generateForecast = (dailyAvgUnits, dailyAvgSales, startDate, duration, range, data, boostFn = () => 1) => {
    const forecast = [];
    let currentDate = new Date(startDate);
    const increment = range === 'Day' ? 1 : range === 'Weekly' ? 7 : 30;
    const periodDays = range === 'Day' ? 1 : range === 'Weekly' ? 7 : 30;

    for (let i = 0; i < duration; i++) {
      const boost = boostFn(currentDate);
      const periodUnits = Math.round(dailyAvgUnits * periodDays * boost);
      const periodSales = dailyAvgSales * periodDays * boost;
      const product = data[0].product; // For simplicity; adjust for product-breakout
      forecast.push({
        date: currentDate.toISOString().split('T')[0],
        product,
        quantity: periodUnits,
        sales: periodSales.toFixed(2),
      });
      currentDate.setDate(currentDate.getDate() + increment);
    }
    return forecast;
  };

  // Generate forecast
  const handleGenerateForecast = () => {
    if (!fileData) {
      setError('Please upload a CSV file first');
      return;
    }
    setLoading(true);
    const startDate = new Date('2025-03-18'); // Example; adjust to user input or latest date + 1
    const methodMap = {
      'historical-trend': historicalTrend,
      'seasonal-boost': seasonalBoost,
      'growth-aggressive': growthAggressive,
      'product-breakout': productBreakout,
    };
    const forecastFn = methodMap[forecastMethod];
    const allPredictions = forecastMethod === 'product-breakout'
      ? forecastFn(fileData, startDate, duration, range)
      : [...new Set(fileData.map(row => row.product))].map(product =>
          forecastFn(fileData.filter(row => row.product === product), startDate, duration, range)
        ).flat();
    setPredictions(allPredictions);
    setLoading(false);
  };

  // Generate CSV
  const generateCSV = () => {
    const headers = ['date', 'product', 'sales', 'quantity'];
    const rows = predictions.map(row => [row.date, row.product, row.sales, row.quantity]);
    const totalSales = predictions.reduce((sum, row) => sum + parseFloat(row.sales), 0).toFixed(2);
    const totalUnits = predictions.reduce((sum, row) => sum + row.quantity, 0);
    rows.push(['Total', '', totalSales, totalUnits]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forecast.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate Insights
  const generateInsights = () => {
    const totalUnits = predictions.reduce((sum, row) => sum + row.quantity, 0);
    const totalSales = predictions.reduce((sum, row) => sum + parseFloat(row.sales), 0).toFixed(2);
    const topPerformers = [...new Set(fileData.map(row => row.product))]
      .map(product => ({
        product,
        totalSales: predictions.filter(p => p.product === product).reduce((sum, p) => sum + parseFloat(p.sales), 0),
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 3);
    const actionPlan = totalUnits === 0
      ? ['Monitor demand before restocking']
      : ['Restock based on forecast', 'Plan promotions for top performers'];
    const proInsights = [
      `Total forecast: ${totalUnits} units, $${totalSales}`,
      ...topPerformers.map(p => `${p.product} contributes $${p.totalSales.toFixed(2)}`),
      totalUnits === 0 ? 'Low demand detected; review historical sales' : 'Stable demand trend',
    ];
    return { totalForecast: totalSales, topPerformers, actionPlan, proInsights };
  };

  const insights = predictions.length > 0 ? generateInsights() : null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sales Forecasting Tool</h1>

      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:bg-blue-500 file:text-white"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Input Section */}
      {fileData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1">Forecast Method</label>
            <select
              value={forecastMethod}
              onChange={(e) => setForecastMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="historical-trend">Historical Trend</option>
              <option value="seasonal-boost">Seasonal Boost</option>
              <option value="growth-aggressive">Growth Aggressive</option>
              <option value="product-breakout">Product Breakout</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Range</label>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Day">Day</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Duration</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value)))}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
        </div>
      )}

      {/* Generate Button */}
      {fileData && (
        <button
          onClick={handleGenerateForecast}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Forecast'}
        </button>
      )}

      {/* Results Section */}
      {predictions.length > 0 && (
        <div className="mt-6">
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h2 className="text-xl font-semibold">Forecast Overview</h2>
            <p>Total Sales: ${insights.totalForecast}</p>
            <p>Total Units: {predictions.reduce((sum, p) => sum + p.quantity, 0)}</p>
            <button
              onClick={generateCSV}
              className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
            >
              Download Forecast
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded mb-4">
            <h2 className="text-xl font-semibold">Top Performers</h2>
            <ul>
              {insights.topPerformers.map((p, i) => (
                <li key={i}>{p.product}: ${p.totalSales.toFixed(2)}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded mb-4">
            <h2 className="text-xl font-semibold">Action Plan</h2>
            <ul>
              {insights.actionPlan.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold">Pro Insights</h2>
            <ul>
              {insights.proInsights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setPredictions([])}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Generate New Forecast
          </button>
        </div>
      )}
    </div>
  );
};

export default ForecastingTool;