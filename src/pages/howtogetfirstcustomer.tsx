import React from 'react';
import { ArrowRight, Download, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowToGetFirstCustomer() {
  const playbookUrl = '/assets/DTC-First-Customer-Playbook.pdf'; // Adjust path as needed

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-24 animate-gradient-x relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight mb-6">
            How to Get Your First Customers:
            <br />
            <span className="text-yellow-300">The DTC Survival Guide</span>
          </h1>
          <p className="text-xl text-gray-100 text-center">
            Broke? Clueless? Perfect. This is your down-and-dirty playbook to snag buyers online without a fat wallet or fancy skills. Let’s hustle.
          </p>
          <div className="flex justify-center mt-8">
            <a
              href="#playbook"
              className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get the Goods
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Your First Sale or Bust</h2>
          <p className="text-gray-300 leading-relaxed">
            You’ve got a killer product, but crickets on sales. Sound familiar? Big brands have cash and pros—you’ve got grit and this guide. We’re stripping it down: no jargon, no fluff, just raw moves to turn strangers into buyers. You’re short on bucks and know-how? Good. This is built for you—cheap, scrappy, and lethal. Let’s light this fuse.
          </p>
        </section>

        {/* Playbook Section */}
        <section id="playbook" className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">The First-Customer Playbook: Your Dirt-Cheap Battle Plan</h2>

          {/* Strategy 1: Precision Social Ads */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">1. Precision Social Ads—Cheap Shots, Big Wins</h3>
            <p className="text-gray-300 mb-4">
              Ads sound scary? They’re not. You don’t need thousands—just a few bucks and a phone. Social media’s your hunting ground—Instagram, TikTok, whatever your people scroll. Here’s how to nail it with $20 and zero experience:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick Your Spot</strong>: Where do your buyers waste time? Instagram’s gold for clothes or beauty—think pics of your stuff looking dope. TikTok’s king for weird or fun—show it in a quick clip. Choose one. Don’t spray cash everywhere.</li>
              <li><strong>Find Your Tribe</strong>: Open the app’s ad tool (e.g., “Boost Post” on Instagram). Set who sees it: age (say, 18-30), interests (like “fitness” or “vegan”), location (your city or country). Keep it tight—randoms waste your dough.</li>
              <li><strong>Make ‘Em Drool</strong>: Snap a pic or 5-second video with your phone—product in hand, in use, whatever pops. Add text: “First 25 Orders: Free Shipping + 10% Off.” Deals hook ‘em. No fancy editing needed.</li>
              <li><strong>Drop the Cash</strong>: Start with $10-20 total. Set it to run 2-3 days. Instagram/TikTok’s “Boost” button does this—pick your post, set budget, hit go. Watch clicks roll in.</li>
              <li><strong>Tweak and Win</strong>: Check results in the app (e.g., “View Insights”). Got 10 clicks for $5 but no sales? Change the pic or offer (“20% Off Today Only”). Double down on what works—spend another $10 on the winner.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-yellow-300 font-semibold">Why It Works:</p>
              <p className="text-gray-200">Small, targeted ads beat billboards. Shopify data says $1 on social ads can return $6 if you aim right. You’re not Coca-Cola—be a sniper, not a shotgun.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Tool Tip:</p>
              <p className="text-gray-200">No cash for trackers? Use a free link shortener like Bitly to see who clicks your ad’s “Shop Now” button.</p>
            </div>
            <p className="text-gray-400 mt-4 italic">Who’s This For: Stuff that looks good—clothes, jewelry, gear.</p>
          </div>

          {/* Strategy 2: Lead Magnet Mastery */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">2. Lead Magnet Mastery—Free Stuff, Fat Sales</h3>
            <p className="text-gray-300 mb-4">
              Strangers don’t buy—they browse. Give ‘em something free to trust you first. It’s like a bar handing out free peanuts—you’ll sell beer. Here’s how to do it with no budget and basic skills:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Figure Out Their Problem</strong>: What bugs your customers? Selling protein powder? They want easy gains. Offer a “5-Minute Muscle Boost Plan.” Candles? “3 Tricks for a Cozy Vibe.” Keep it tied to your product.</li>
              <li><strong>Make the Freebie</strong>: Open Google Docs (free). Type a 1-2 page guide—bullet points, not essays. Add a pic of your product in action (phone snap’s fine). Export as PDF. Done.</li>
              <li><strong>Set the Trap</strong>: Need a page? Use Linktree (free) or Carrd ($19/year). Add a title (“Get Your Free Guide”), a box for their email, and a “Download” button. Link it to your PDF (upload to Google Drive, set to “Anyone with link”).</li>
              <li><strong>Blast It Out</strong>: Post it everywhere—your social bio, a quick story (“Free guide, grab it!”), or a text to friends. Hit free spots like “r/FreeStuff” on Reddit or a local Facebook group. No ad spend needed.</li>
              <li><strong>Turn ‘Em Into Buyers</strong>: Got emails? Use Gmail. Day 1: “Here’s your guide!” Day 3: “Loved it? This [product] makes it better.” Day 5: “10% off, 48 hours only—code FIRST10.” Hand-write 10 emails if you must—scale later.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-yellow-300 font-semibold">Why It Works:</p>
              <p className="text-gray-200">Emails beat social posts—40% more sales per lead (industry stat). You’re building a list of fans, not randos.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Tool Tip:</p>
              <p className="text-gray-200">Mailchimp’s free plan handles 500 emails—set up auto-sends if Gmail’s too slow.</p>
            </div>
            <p className="text-gray-400 mt-4 italic">Who’s This For: Problem-solvers—fitness, food, home stuff.</p>
          </div>

          {/* Strategy 3: Referral Rocket */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">3. Referral Rocket—Your Crew’s Your Crew</h3>
            <p className="text-gray-300 mb-4">
              Ads cost money. Friends don’t. People trust their buddies over some slick banner. Turn your circle into a sales squad—here’s the dirt-cheap way:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Create a Bribe</strong>: Tell your shop (Shopify, Etsy, whatever) to make discount codes. Call ‘em “MOM15” or “BFF20”—15-20% off. Takes 5 minutes in the settings.</li>
              <li><strong>Rally the Troops</strong>: Text 10 people you know: “Hey, I launched this—'exceptional—share this code (MOM15) for 20% off. If 5 use it, you get a free [small item].” Keep it casual—no pressure.</li>
              <li><strong>Get ‘Em Talking</strong>: Ask them to drop it in their WhatsApp group, family chat, or a random “Buy Local” Facebook page. One post can spark 2-3 sales.</li>
              <li><strong>Track It</strong>: Your shop dashboard shows code uses. No dashboard? Pen and paper work—write down who shared, who bought.</li>
              <li><strong>Level Up</strong>: Got a sale? Email that buyer: “Loved it? Share this code (FRIEND15) —you both get 15% off next time.” Word spreads like wildfire.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-yellow-300 font-semibold">Why It Works:</p>
              <p className="text-gray-200">Friends drive 30% more buys than ads—people trust people (real data, not BS).</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Tool Tip:</p>
              <p className="text-gray-200">No shop yet? Use PayPal’s “Request Money” with a note about the code—cheap workaround.</p>
            </div>
            <p className="text-gray-400 mt-4 italic">Who’s This For: Personal brands—crafts, local goods, passion projects.</p>
          </div>

          {/* Visual Callout */}
          <div className="bg-orange-500 text-white p-6 rounded-xl text-center shadow-lg">
            <BarChart2 className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xl font-bold">Numbers Don’t Lie</p>
            <p className="mt-2">Our free Sales Dashboard turns your chaos into cash—upload sales, see what’s hot.</p>
            <Link to="/tools-dashboard" className="text-yellow-300 underline hover:text-yellow-200">Try it free →</Link>
          </div>
        </section>

        {/* Niche-Specific Hacks */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">Your Game, Your Hack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Apparel</h3>
              <p className="text-gray-300">Post a “24-Hour Drop” on Instagram—20% off, pic of your best shirt. Use a countdown sticker. Panic buys win.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Supplements</h3>
              <p className="text-gray-300">DM 10 fitness buffs on Instagram: “Free sample, just pay $3 shipping.” Trust turns into cash.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Home Decor</h3>
              <p className="text-gray-300">Pin 5 pics of your stuff on Pinterest—add “Shop Now” links. Free traffic, big clicks.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Tech Gadgets</h3>
              <p className="text-gray-300">Post on X: “Beta testers wanted—25% off my new [gadget]. DM me.” Buzz = buyers.</p>
            </div>
          </div>
        </section>

        {/* CTA Section with Download */}
        <section className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Grab the <span className="text-yellow-300">DTC Playbook</span>—Your Cheat Code
          </h2>
          <p className="text-gray-100 mb-6">
            This ain’t a blog—it’s your lifeline. Download the PDF, stick it on your wall, and start selling.
          </p>
          <a
            href={playbookUrl}
            download="DTC-First-Customer-Playbook.pdf"
            className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Download Now
            <Download className="ml-2 h-5 w-5" />
          </a>
          <p className="text-gray-200 mt-4">
            More juice? <Link to="/tools" className="text-yellow-300 underline hover:text-yellow-200">Hit our free tools</Link>—SEO, forecasts, the works.
          </p>
        </section>
      </div>
    </div>
  );
}