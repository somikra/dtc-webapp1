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
            <span className="text-yellow-300">The DTC Starter’s Bible</span>
          </h1>
          <p className="text-xl text-gray-100 text-center">
            New to selling online? No cash, no skills, no problem. This is your step-by-step guide to winning customers and kicking off your DTC dream—clear, simple, and packed with value.
          </p>
          <div className="flex justify-center mt-8">
            <a
              href="#playbook"
              className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Winning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Your First Sale Is Closer Than You Think</h2>
          <p className="text-gray-300 leading-relaxed">
            You’ve got a product—maybe handmade soap, a cool gadget, or tasty snacks—but no one’s buying yet. That’s normal. Big brands have teams and budgets; you’ve got determination and this guide. We’re here to turn your idea into cash, even if you’re starting with pocket change and zero experience. This isn’t vague advice—it’s a detailed roadmap with 10 proven strategies to get customers knocking down your digital door. Each one’s built for beginners, low on cost, and high on results. Ready to make it happen? Let’s dive in.
          </p>
        </section>

        {/* Playbook Section */}
        <section id="playbook" className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">The 10-Strategy Playbook: Your Customer-Getting Arsenal</h2>

          {/* Strategy 1: Targeted Social Media Ads */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">1. Targeted Social Media Ads</h3>
            <p className="text-gray-300 mb-4">
              Social media isn’t just for selfies—it’s where your customers scroll all day. You don’t need a big budget; a few dollars can get you started. Here’s how to run ads that work, even if you’ve never done it before:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Choose Your Platform</strong>: Pick one place where your buyers hang out. Selling trendy clothes? Use Instagram. Quirky products? Try TikTok. Go to their website or app and sign up—it’s free.</li>
              <li><strong>Find Your People</strong>: In the ad section (look for “Ads Manager” or “Boost Post”), set who sees it. Example: If you sell fitness gear, choose ages 18-35, interests like “workouts” or “gym,” and your country. This keeps your money focused.</li>
              <li><strong>Create the Ad</strong>: Take a photo or 10-second video with your phone—show your product in use (e.g., someone wearing your shirt). Add text: “First 20 Orders Get Free Shipping!” Simple and tempting.</li>
              <li><strong>Spend Smart</strong>: Start with $10. In the ad tool, set your budget to $5/day for 2 days. Hit “Run” or “Boost.” It’ll show how many saw it and clicked.</li>
              <li><strong>Check and Adjust</strong>: After 2 days, look at the results (under “Insights”). If 50 people saw it and 5 clicked, that’s good! If not, tweak the photo or offer (e.g., “15% Off Today”). Spend another $5 on the best version.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">A $10 ad can reach 500-1000 people if targeted right. One sale pays it back—start small, win big.</p>
            </div>
          </div>

          {/* Strategy 2: Lead Magnets */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">2. Lead Magnets</h3>
            <p className="text-gray-300 mb-4">
              People don’t buy from strangers—they need a reason to trust you. A lead magnet is a free gift that gets their email and warms them up. Here’s how to make one with no money:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick a Problem</strong>: What do your customers want? For soap, maybe “Glowy Skin Tips.” For snacks, “Healthy Munchies Guide.” Keep it related to what you sell.</li>
              <li><strong>Make It</strong>: Open Google Docs (free at docs.google.com). Write 5-10 tips—short sentences, like “Use oatmeal for a DIY scrub.” Add a photo of your product. Click File > Download > PDF.</li>
              <li><strong>Set Up a Page</strong>: Use Linktree (free at linktr.ee)—add a link titled “Get My Free Guide,” upload your PDF to Google Drive (free), and share the “Anyone with link” URL.</li>
              <li><strong>Share It</strong>: Put the Linktree in your Instagram bio or post it on Facebook: “Free guide for [problem]—grab it here!” Text 5 friends to share it too.</li>
              <li><strong>Follow Up</strong>: When someone signs up, email them the PDF. Two days later, send: “Liked the guide? My [product] makes it even better—10% off with code FIRST10.” Use Gmail or Mailchimp (free for 500 emails).</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">Emails turn browsers into buyers—start with 10 sign-ups, and you’ve got a mini sales list.</p>
            </div>
          </div>

          {/* Strategy 3: Referral Program */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">3. Referral Program</h3>
            <p className="text-gray-300 mb-4">
              Your friends and family can sell for you—people trust recommendations over ads. Here’s how to get them spreading the word for free:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Make a Deal</strong>: If you use Shopify or Etsy, go to “Discounts” and create a code like “FRIEND15” for 15% off. No shop? Offer it manually via email.</li>
              <li><strong>Ask Your Crew</strong>: Text 10 people: “Hey, I’m selling [product]—share this code (FRIEND15) for 15% off. If 3 use it, you get a free [small item].”</li>
              <li><strong>Spread It</strong>: Tell them to post it in a group chat or on Facebook: “My friend’s new [product] is awesome—use FRIEND15!”</li>
              <li><strong>Track Sales</strong>: Check your shop’s “Orders” tab to see who used the code. No shop? Ask buyers how they heard about you.</li>
              <li><strong>Grow It</strong>: After a sale, email the buyer: “Love it? Share FRIEND15—next order’s 15% off for you too.” Word travels fast.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">One friend’s post can spark 2-5 sales—trust is your secret weapon.</p>
            </div>
          </div>

          {/* Strategy 4: Pinterest Posts */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">4. Pinterest Posts</h3>
            <p className="text-gray-300 mb-4">
              Pinterest is a free goldmine for visual products—people search there to buy. Here’s how to use it without spending a dime:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Set Up</strong>: Sign up at pinterest.com—it’s free. Make a board called “[Your Product] Ideas” (e.g., “Cozy Decor”).</li>
              <li><strong>Take Pics</strong>: Snap 5 photos of your product—different angles or in use (e.g., candle lit on a table). Use your phone, no fancy camera.</li>
              <li><strong>Pin Them</strong>: Upload each pic as a “Pin.” Title it: “Handmade [Product] - Shop Now.” Description: “Perfect for [use], grab it here: [your shop link].”</li>
              <li><strong>Tag It</strong>: Add 5 keywords—e.g., “handmade soap,” “natural skincare,” “gift ideas.” People search these.</li>
              <li><strong>Wait and Win</strong>: Check “Analytics” in a week. If a pin gets 50 views, make more like it. Free traffic = free sales.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">Pinterest drives buyers—10 views can turn into 1 sale if your pics pop.</p>
            </div>
          </div>

          {/* Strategy 5: Local Online Groups */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">5. Local Online Groups</h3>
            <p className="text-gray-300 mb-4">
              Facebook groups or forums near you are full of buyers. Here’s how to tap them without being spammy:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Find Groups</strong>: Search Facebook for “Buy/Sell [Your City]” or “[Your Niche] Lovers.” Join 2-3 active ones.</li>
              <li><strong>Introduce Yourself</strong>: Post: “Hi, I’m [Name]—just started selling [product]. Thought you might like it!” Add a pic.</li>
              <li><strong>Offer a Deal</strong>: Say: “First 5 orders get 10% off—message me!” Keep it friendly, not pushy.</li>
              <li><strong>Answer Questions</strong>: If someone asks about your product, reply fast—build trust.</li>
              <li><strong>Repeat</strong>: Post once a week with a new pic or deal. Steady wins here.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">One group post can net 3-5 sales—local love is real.</p>
            </div>
          </div>

          {/* Strategy 6: Free Samples */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">6. Free Samples</h3>
            <p className="text-gray-300 mb-4">
              Let people try before they buy—it’s a cheap way to prove your worth. Here’s how to do it:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick Your Product</strong>: Choose something small—e.g., a mini soap bar or snack pack. Keep costs under $2 each.</li>
              <li><strong>Find Takers</strong>: Post on Instagram or X: “Free [product] sample—just pay $3 shipping. DM me!”</li>
              <li><strong>Collect Cash</strong>: Use PayPal or Venmo—send them a payment link after they DM. Mail it in a cheap envelope.</li>
              <li><strong>Follow Up</strong>: A week later, email: “How’d you like it? Full size is 15% off with code SAMPLE15.”</li>
              <li><strong>Scale It</strong>: If 5 try and 2 buy, offer it to 10 more. Samples sell themselves.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">One happy sampler can turn into a loyal buyer—worth the $2 risk.</p>
            </div>
          </div>

          {/* Strategy 7: Collaborations */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">7. Collaborations</h3>
            <p className="text-gray-300 mb-4">
              Team up with someone who’s got an audience—it’s free exposure. Here’s how to start:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Find a Partner</strong>: Look for small Instagram accounts (500-2000 followers) in your niche—e.g., a fitness page for supplements.</li>
              <li><strong>Reach Out</strong>: DM them: “Hey, love your page! I sell [product]—want a free one to share with your followers?”</li>
              <li><strong>Make It Easy</strong>: Send the product and a 10% off code for their audience (e.g., “FIT10”).</li>
              <li><strong>Track It</strong>: Ask them to tag you in their post. Watch for sales from the code.</li>
              <li><strong>Keep Going</strong>: If it works, contact 5 more small accounts. Little wins stack up.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">A 1000-follower shoutout can bring 10-20 buyers—free is the best price.</p>
            </div>
          </div>

          {/* Strategy 8: Flash Sales */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">8. Flash Sales</h3>
            <p className="text-gray-300 mb-4">
              A short, sweet deal creates urgency—people hate missing out. Here’s how to pull it off:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Set the Deal</strong>: Pick one product—offer 20% off for 24 hours only.</li>
              <li><strong>Announce It</strong>: Post on Instagram Stories or X: “24-Hour Flash Sale—20% off [product]! Ends midnight—shop here: [link].”</li>
              <li><strong>Add a Timer</strong>: Use a countdown sticker (Instagram) or write “12 hours left!” in updates.</li>
              <li><strong>Push It</strong>: Text 5 friends or post in a group: “Quick sale—grab it!”</li>
              <li><strong>Review</strong>: Count sales after 24 hours. If you get 3, try a 48-hour one next week.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">Urgency flips browsers to buyers—3 sales in a day beats zero all week.</p>
            </div>
          </div>

          {/* Strategy 9: Content Sharing */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">9. Content Sharing</h3>
            <p className="text-gray-300 mb-4">
              Share useful tips to attract buyers—no blog needed. Here’s how to do it free:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick a Topic</strong>: Related to your product—e.g., “5 Ways to Use Spices” for snacks.</li>
              <li><strong>Write It</strong>: Type 5 sentences in Notes or Google Docs—e.g., “Add cumin to popcorn for a kick.”</li>
              <li><strong>Post It</strong>: Share on X or Facebook: “5 Spice Hacks—btw, my [product] makes #3 epic: [link].”</li>
              <li><strong>Engage</strong>: If someone comments, reply: “Glad you liked it—try my [product] for more!”</li>
              <li><strong>Repeat</strong>: Post a new tip weekly. Build fans who buy.</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">One helpful post can pull in 5-10 curious buyers over time.</p>
            </div>
          </div>

          {/* Strategy 10: Pre-Orders */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">10. Pre-Orders</h3>
            <p className="text-gray-300 mb-4">
              Sell before you stock—test demand cheap. Here’s how to start:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Plan It</strong>: Pick one product—say it’s “coming soon” with a 20% pre-order discount.</li>
              <li><strong>Announce</strong>: Post on social: “Pre-order my [product]—20% off, ships in 2 weeks! Link here.” Use PayPal or a “Buy Now” button.</li>
              <li><strong>Collect</strong>: Take payments upfront—use funds to make the product.</li>
              <li><strong>Update</strong>: Email buyers: “Thanks for pre-ordering—ships in 10 days!”</li>
              <li><strong>Deliver</strong>: Ship it, then ask: “Love it? Tell a friend!”</li>
            </ul>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Beginner Boost:</p>
              <p className="text-gray-200">2 pre-orders can fund your first batch—zero risk, all reward.</p>
            </div>
          </div>

          {/* Visual Callout */}
          <div className="bg-orange-500 text-white p-6 rounded-xl text-center shadow-lg">
            <BarChart2 className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xl font-bold">See What Works</p>
            <p className="mt-2">Our free Sales Dashboard tracks your wins—upload data, spot the gold.</p>
            <Link to="/tools-dashboard" className="text-yellow-300 underline hover:text-yellow-200">Get it free →</Link>
          </div>
        </section>

        {/* Niche Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">Quick Wins by Niche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Apparel</h3>
              <p className="text-gray-300">Instagram Story: “24-Hour Sale—20% off tees!” Add a countdown.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Supplements</h3>
              <p className="text-gray-300">DM 10 gym fans: “Free sample, $3 shipping—DM me!”</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Home Decor</h3>
              <p className="text-gray-300">Pin 5 pics on Pinterest—link to your shop.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Tech</h3>
              <p className="text-gray-300">X post: “Pre-order my gadget—20% off!”</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Download the <span className="text-yellow-300">DTC Playbook</span>
          </h2>
          <p className="text-gray-100 mb-6">
            This guide in your pocket—10 strategies, clear steps, instant wins. Grab it now and start selling.
          </p>
          <a
            href={playbookUrl}
            download="DTC-First-Customer-Playbook.pdf"
            className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get the Playbook
            <Download className="ml-2 h-5 w-5" />
          </a>
          <p className="text-gray-200 mt-4">
            Want more? <Link to="/tools" className="text-yellow-300 underline hover:text-yellow-200">Try our free tools</Link>—SEO, sales tracking, and more.
          </p>
        </section>
      </div>
    </div>
  );
}