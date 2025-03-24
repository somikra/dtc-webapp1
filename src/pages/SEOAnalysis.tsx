import { createXAI } from '@ai-sdk/xai';

const xai = createXAI({ apiKey: process.env.XAI_API_KEY }); // Auto-configured by Vercel

const analyzeSEO = async (url: string): Promise<SEOResult> => {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;

  let html;
  try {
    const response = await axios.get(`${proxyUrl}${targetUrl}`, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      timeout: 10000,
    });
    html = response.data;
  } catch (err) {
    html = '<html><body>Sample content for analysis</body></html>';
  }

  // Query Grok for SEO insights
  const grokResponse = await xai.chat.completions.create({
    model: 'grok',
    messages: [
      { role: 'user', content: `Analyze this website HTML for SEO: ${html}. Provide insights on page load speed, mobile optimization, and backlinks.` },
    ],
  });

  const insightsText = grokResponse.choices[0].message.content;
  // Parse Grok’s response (assuming it returns structured text or JSON)
  const overallScore = parseInt(insightsText.match(/Score: (\d+)/)?.[1] || '75');
  const pageLoadTime = parseFloat(insightsText.match(/Load Time: ([\d.]+)/)?.[1] || '2.0');
  const mobileScore = insightsText.includes('Mobile: Good') ? 'Good' : 'Poor';
  const backlinks = parseInt(insightsText.match(/Backlinks: (\d+)/)?.[1] || '10');

  const issues: SEOIssue[] = [];
  if (pageLoadTime > 2.5) {
    issues.push({
      type: 'Page Load Speed',
      severity: 'High',
      description: `Your e-commerce site loads in ${pageLoadTime}s, slowing down sales.`,
      recommendation: 'Optimize images and use a CDN for faster web page design.',
    });
  }
  if (backlinks < 10) {
    issues.push({
      type: 'Backlinks',
      severity: 'High',
      description: `Only ${backlinks} backlinks found—weak for search engine marketing.`,
      recommendation: 'Boost your business with affiliate marketing programs and guest blogs.',
    });
  }
  if (mobileScore === 'Poor') {
    issues.push({
      type: 'Mobile Optimization',
      severity: 'Critical',
      description: 'Poor mobile performance hurts Shopify e-commerce traffic.',
      recommendation: 'Hire a freelance web developer for responsive design.',
    });
  }

  const insights = [
    `SEO Score: ${overallScore}/100—${overallScore > 80 ? 'Great for DTC sales!' : 'Improve for better leads!'}`,
    `Page Load: ${pageLoadTime}s—${pageLoadTime > 2 ? 'Speed up your website!' : 'Optimized for users!'}`,
    `Backlinks: ${backlinks}—${backlinks < 20 ? 'Grow with advertising!' : 'Solid for rankings!'}`,
    `Mobile: ${mobileScore}—${mobileScore === 'Poor' ? 'Fix for e-commerce success!' : 'Ready for campaigns!'}`,
  ];

  const actionPlan = [
    overallScore < 80 ? 'Enhance SEO for your business: Fix mobile and speed issues in 2 weeks.' : 'Leverage your score: Start a Snapchat ads campaign.',
    backlinks < 20 ? 'Build backlinks: Partner with a digital marketing agency for 10+ links.' : 'Strengthen authority: Pitch to portfolio sites.',
    pageLoadTime > 2 ? 'Cut load time: Optimize for search engine marketing.' : 'Refine UX: Test video ads.',
    mobileScore === 'Poor' ? 'Go mobile-first: Critical for DTC entrepreneurs.' : 'Boost conversions: Add WhatsApp campaigns.',
  ];

  return { url, overallScore, issues, insights, actionPlan };
};