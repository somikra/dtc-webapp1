import React from 'react';
import { ArrowRight, Download, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowToGetFirstCustomer() {
  // URL for the downloadable playbook (replace with your actual hosted PDF link)
  const playbookUrl = '/assets/DTC-First-Customer-Playbook.pdf';

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-24 animate-gradient-x relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight mb-6">
            How to Get Your First Customers:
            <br />
            <span className="text-yellow-300">The DTC Domination Blueprint</span>
          </h1>
          <p className="text-xl text-gray-100 text-center">
            No fluff, no hype—just a battle-tested playbook to snag your first buyers and ignite your online empire. Let’s roll.
          </p>
          <div className="flex justify-center mt-8">
            <a
              href="#playbook"
              className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Dive Into the Playbook
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Your First Sale Is Your War Cry</h2>
          <p className="text-gray-300 leading-relaxed">
            Starting a DTC gig? That first “cha-ching” is everything—it’s proof you’re not just dreaming. This ain’t theory; it’s a gritty, step-by-step battle plan to hook customers fast. Whether you’re pushing socks, supplements, or sleek tech, we’ve got the moves to make your cash register sing. Buckle up, rookie—this is your goldmine.
          </p>
        </section>

        {/* Playbook Section */}
        <section id="playbook" className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">The First-Customer Playbook: Step-by-Step Domination</h2>

          {/* Strategy 1: Precision Social Ads */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">1. Precision Social Ads—Strike Where They Scroll</h3>
            <p className="text-gray-300 mb-4">
              Big-budget ads are for suckers. You need sniper shots—small, targeted, and deadly effective. Platforms like Instagram and TikTok are where your buyers live. Here’s how to nail it:
            </p>
            <ul className="text-gray-300 list-disc pl-5 mb-4">
              <li><strong>Step 1: Pick Your Battlefield</strong> - Choose one platform where your audience hangs (e.g., Instagram for fashion, TikTok for quirky gadgets). Focus beats scattershot.</li>
              <li><strong>Step 2: Define Your Target</strong> - Use ad tools to zero in—age, interests, location. Selling eco-friendly gear? Hit “sustainability” lovers, 25-35, in urban spots.</li>
              <li><strong>Step 3: Craft the Bait</strong> - Make a bold offer: “First 50 Orders Get 15% Off + Free Shipping.” Use a killer image or 5-second video—think product in action.</li>
              <li><strong>Step 4: Set the Trap</strong> - Budget $30-50. Run 2-3 ad variants for 3 days. Track clicks with Meta Pixel or TikTok’s tracker.</li>
              <li><strong>Step 5: Double Down</strong> - Kill the losers, scale the winner. Retarget clickers who didn’t buy with a “Last Chance” ad.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Real Talk:</p>
              <p className="text-gray-200">Studies show targeted ads convert 2x better than broad ones (source: HubSpot, 2023). Start small, win big.</p>
            </div>
            <p className="text-gray-400 mt-4 italic">Perfect for: Visual brands (apparel, beauty, home goods).</p>
          </div>

          {/* Strategy 2: Lead Magnet Mastery */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">2. Lead Magnet Mastery—Give to Get</h3>
            <p className="text-gray-300 mb-4">
              Nobody buys cold. Warm ‘em up with a freebie they can’t resist. It’s your Trojan horse to build trust and snag emails. Here’s the drill:
            </p>
            <ul className="text-gray-300 list-disc pl-5 mb-4">
              <li><strong>Step 1: Solve a Pain Point</strong> - Create a free resource tied to your product. Fitness gear? Offer a “10-Minute Home Workout Plan.” Skincare? “5-Step Glow Guide.”</li>
              <li><strong>Step 2: Build the Hook</strong> - Use Canva (free) for a slick PDF. Keep it 2-3 pages—short, punchy, valuable.</li>
              <li><strong>Step 3: Set Up the Trap</strong> - Slap it on a landing page with a sign-up form. Tools like Carrd (cheap) or Mailchimp’s free tier work.</li>
              <li><strong>Step 4: Spread the Word</strong> - Share it on social, pin it on Pinterest, or drop it in niche forums (e.g., “r/Entrepreneur”).</li>
              <li><strong>Step 5: Convert ‘Em</strong> - Email sequence: Day 1 - Deliver the freebie; Day 3 - Share a tip + soft sell; Day 5 - “Exclusive 10% Off for You.”</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Gold Nugget:</p>
              <p className="text-gray-200">Email leads convert 40% better than social traffic (source: OptinMonster, 2024). This is your slow-burn winner.</p>
            </div>
            <p className="text-gray-400 mt-4 italic">Perfect for: Education-driven brands (wellness, food, DIY).</p>
          </div>

          {/* Strategy 3: Referral Rocket */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">3. Referral Rocket—Turn Friends Into Foot Soldiers</h3>
            <p className="text-gray-300 mb-4">
              Your network’s your secret weapon. People trust people, not ads. Turn your crew into a sales army with this:
            </p>
            <ul className="text-gray-300 list-disc pl-5 mb-4">
              <li><strong>Step 1: Arm Your Squad</strong> - Give friends/family a unique 20% off code to share. Make it personal: “JANE20.”</li>
              <li><strong>Step 2: Sweeten the Deal</strong> - Offer a reward: “Refer 5 buyers, get a free product.” Keeps ‘em motivated.</li>
              <li><strong>Step 3: Launch the Assault</strong> - Ask them to post in group chats, WhatsApp, or niche communities (e.g., “Sustainable Living” Slack).</li>
              <li><strong>Step 4: Track the Wins</strong> - Use a spreadsheet or our Sales Dashboard to monitor code usage.</li>
              <li><strong>Step 5: Scale It</strong> - Once it works, expand to customers. “Refer a friend, both get 15% off.”</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Proof:</p>
              <p className="text-gray-200">Referral programs boost acquisition by 30% (source: Nielsen, 2023). Trust is your turbocharger.</p>
            </div>
            <p className="text-gray-400 mt-4 italic">Perfect for: Community-driven brands (crafts, eco-products, niche hobbies).</p>
          </div>

          {/* Visual Callout */}
          <div className="bg-orange-500 text-white p-6 rounded-xl text-center shadow-lg">
            <BarChart2 className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xl font-bold">Measure or Die</p>
            <p className="mt-2">Our free Sales Dashboard crunches your numbers—uploads take 10 seconds, insights last forever.</p>
            <Link to="/tools-dashboard" className="text-yellow-300 underline hover:text-yellow-200">Plug in now →</Link>
          </div>
        </section>

        {/* Niche-Specific Action Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">Your Niche, Your Battle Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Apparel</h3>
              <p className="text-gray-300">Drop a flash sale on Instagram Stories—24 hours, 20% off. Use a countdown sticker to spark FOMO.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Supplements</h3>
              <p className="text-gray-300">Hit Reddit’s fitness subs with a “Free Sample” offer (just cover shipping). Seed trust, reap sales.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Home Decor</h3>
              <p className="text-gray-300">Pin lifestyle shots on Pinterest with direct “Buy Now” links. Cheap clicks, high intent.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Tech Gadgets</h3>
              <p className="text-gray-300">Tease a pre-launch on Product Hunt. Offer beta testers 25% off. Buzz = buyers.</p>
            </div>
          </div>
        </section>

        {/* CTA Section with Downloadable Playbook */}
        <section className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Lock It Down with the <span className="text-yellow-300">DTC Playbook</span>
          </h2>
          <p className="text-gray-100 mb-6">
            Grab this as a PDF—your step-by-step cheat sheet to first-customer glory. Print it, live it, win it.
          </p>
          <a
            href={playbookUrl}
            download="DTC-First-Customer-Playbook.pdf"
            className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Download the Playbook
            <Download className="ml-2 h-5 w-5" />
          </a>
          <p className="text-gray-200 mt-4">
            Hungry for more? <Link to="/tools" className="text-yellow-300 underline hover:text-yellow-200">Tap into our free tools</Link>—SEO audits, forecasting, and beyond.
          </p>
        </section>
      </div>
    </div>
  );
}