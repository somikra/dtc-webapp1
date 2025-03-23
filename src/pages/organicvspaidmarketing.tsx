import React from 'react';
import { ArrowRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrganicVsPaidMarketing() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-24 animate-gradient-x relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight mb-6">
            Organic vs. Paid Marketing:
            <br />
            <span className="text-yellow-300">Your Easy Guide to Getting Customers</span>
          </h1>
          <p className="text-xl text-gray-100 text-center">
            New to selling? Confused about marketing? Don’t worry! This guide explains organic (free) and paid (with money) ways to get people to buy your stuff—simple, clear, and step-by-step, even if English isn’t your first language.
          </p>
          <div className="flex justify-center mt-8">
            <a
              href="#strategies"
              className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Let’s Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">You Can Get Customers—Here’s How</h2>
          <p className="text-gray-300 leading-relaxed">
            Hey there! Maybe you’re 16 and you’ve made something cool—like bracelets, cookies, or drawings—and you want people to buy it online. But how do you tell them about it? That’s what marketing is! There are two big ways: organic, which is free and takes time, and paid, which costs money but is faster. Both can work, but which is right for you? Big companies use both, but you’re just starting, so we’ll make it easy. This guide gives you 10 ways to try—some free, some paid—explained like a friend showing you every step. You don’t need lots of cash or tech skills—just your phone or computer and this plan. Even if English is new to you, you’ll understand and know what to do. Let’s find the best way to get customers for your business!
          </p>
        </section>

        {/* Strategies Section */}
        <section id="strategies" className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">10 Ways to Get Customers: Organic and Paid</h2>

          {/* Strategy 1: Post on Social Media (Organic) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">1. Post on Social Media—Free and Fun</h3>
            <p className="text-gray-300 mb-4">
              Social media is where people hang out—like Instagram or TikTok—and you can tell them about your product for free. This is organic—it takes time but costs nothing. Let’s say you sell cookies. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick a Place</strong>: Choose one app—like Instagram if your cookies look yummy. Download it on your phone if you don’t have it. Sign up with your email—it’s free.</li>
              <li><strong>Take a Picture</strong>: Use your phone to take a photo of your cookies—maybe on a plate with a nice background, like a table. Make it bright—open a window for light.</li>
              <li><strong>Make a Post</strong>: Open Instagram. Tap the plus (+) button at the bottom. Pick your cookie photo. Write something like: “I made these cookies—they’re super tasty! Message me to buy!” Tap “Share” to post it.</li>
              <li><strong>Tell Friends</strong>: Text 5 friends: “Hey, I posted my cookies on Instagram—can you like it or share it?” More people see it when friends help.</li>
              <li><strong>Keep Posting</strong>: Post a new photo every few days—like cookies with milk or a happy customer. If 10 people see it and 1 buys, that’s a start! It grows slow but free.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: You post 5 times, 50 people see it, and 2 buy a $5 cookie pack. That’s $10 for no money spent! Organic is slow but builds fans over time.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">It’s free and fun—people find you naturally, no cash needed!</p>
            </div>
          </div>

          {/* Strategy 2: Run a Small Ad (Paid) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">2. Run a Small Ad—Pay a Little, Get Fast Results</h3>
            <p className="text-gray-300 mb-4">
              Paid marketing means spending money to show your product to more people, fast. Ads on social media work great. Let’s say you sell bracelets. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Choose Where</strong>: Pick Instagram—it’s good for pretty things like bracelets. Open the app on your phone.</li>
              <li><strong>Make Your Ad</strong>: Take a photo of your bracelet—maybe on your wrist. Post it: tap the plus (+) button, add the photo, write “Cool bracelets—$10! First 5 get free shipping,” and hit “Share.”</li>
              <li><strong>Pay to Show It</strong>: After posting, tap “Boost Post” under it. Pick who sees it—like ages 13-20, “jewelry” interest, your country. Set $5 for 2 days—type your card number when it asks. Tap “Boost.”</li>
              <li><strong>Check It</strong>: After 2 days, tap “View Insights” on the post. Maybe 200 saw it, 5 clicked. If 1 buys at $10, you made $5 after spending $5!</li>
              <li><strong>Try Again</strong>: If it works, spend $5 more with a new photo. If not, change the words—like “15% off today!” Paid is fast but costs a little.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: $5 gets 300 views, 3 buy at $10 = $30. You keep $25 after the ad. Paid marketing jumps you ahead quick!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">A little money gets you seen fast—great when you need customers now!</p>
            </div>
          </div>

          {/* Strategy 3: Share Helpful Tips (Organic) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">3. Share Helpful Tips—Teach for Free</h3>
            <p className="text-gray-300 mb-4">
              Give people useful ideas for free—they’ll like you and maybe buy later. This is organic—no cost, just time. Let’s say you sell drawings. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick a Tip</strong>: Think what people like about drawings—like “5 Ways to Decorate Your Room.” It’s free and ties to your art.</li>
              <li><strong>Write It</strong>: Open your phone’s Notes app. Type: “1. Hang a drawing by your bed. 2. Use colors that match your walls.” Add 3 more—keep it short.</li>
              <li><strong>Post It</strong>: Open Facebook or X. Write: “5 Ways to Decorate Your Room—btw, my drawings make #1 awesome! Message me to buy.” Add a drawing photo—tap the camera icon to upload.</li>
              <li><strong>Talk Back</strong>: If someone comments “Cool!” say: “Thanks! Want a drawing for your room? $10!” Be nice—it builds trust.</li>
              <li><strong>Do More</strong>: Post a new tip every week—like “5 Gift Ideas.” If 20 see it and 2 buy at $10, that’s $20 free!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Picture: 30 see your tip, 3 buy drawings at $10 = $30. No cost—just your ideas making friends who buy!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Helping people for free makes them like you—then they might buy, no money spent!</p>
            </div>
          </div>

          {/* Strategy 4: Google Ads (Paid) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">4. Google Ads—Pay to Be Found</h3>
            <p className="text-gray-300 mb-4">
              Paid ads on Google show your product when people search for it. It’s fast but costs money. Let’s say you sell phone cases. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Sign Up</strong>: Go to ads.google.com on your phone or computer. Click “Start Now”—use your email to make an account, it’s free to join.</li>
              <li><strong>Make an Ad</strong>: Click “New Campaign.” Pick “Search.” Write: “Cool Phone Cases - $10” as the title. Add: “Get yours now—fast shipping!” below. Put your PayPal link or “Message me” if no website.</li>
              <li><strong>Pick Words</strong>: Choose words people search—like “phone case,” “cheap phone case,” “cute phone case.” Type them in the “Keywords” box.</li>
              <li><strong>Spend a Little</strong>: Set $5 for 1 day—click “Budget,” type “5,” pick your card, and hit “Save.” Click “Launch” to start.</li>
              <li><strong>Check Results</strong>: After a day, look at “Campaigns” tab. Maybe 50 saw it, 3 clicked, 1 bought at $10. You keep $5—fast win!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: $5 gets 100 views, 5 click, 2 buy at $10 = $20. You keep $15 after the ad. Paid Google ads find buyers quick!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">People searching buy fast—pay a little to get right in front of them!</p>
            </div>
          </div>

          {/* Strategy 5: Join Groups (Organic) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">5. Join Groups—Talk to People for Free</h3>
            <p className="text-gray-300 mb-4">
              Online groups—like on Facebook—are free places to meet people who might buy. This is organic—no cost, just effort. Let’s say you sell soap. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Find Groups</strong>: Open Facebook on your phone. Search “soap lovers” or “buy handmade [your town].” Tap “Groups” to see them. Join 2 or 3 with lots of posts.</li>
              <li><strong>Say Hi</strong>: Click “Write something.” Say: “Hi! I’m [your name]—I make soap. It’s natural and smells great! Anyone interested?” Add a soap photo—tap the camera icon.</li>
              <li><strong>Offer a Deal</strong>: Add: “First 5 buyers get $1 off—message me!” It’s free to post, just be nice.</li>
              <li><strong>Chat</strong>: If someone says “Looks good!” reply: “Thanks! It’s $5—want one?” Answer fast to build trust.</li>
              <li><strong>Keep Going</strong>: Post once a week—like a new soap scent. If 3 buy at $5, that’s $15 free!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: 50 see your post, 4 buy at $5 = $20. No cost—just talking to people who like soap!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Groups are free and full of fans—talk to them and they might buy!</p>
            </div>
          </div>

          {/* Strategy 6: Influencer Shoutout (Paid) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">6. Influencer Shoutout—Pay Someone to Tell Others</h3>
            <p className="text-gray-300 mb-4">
              Pay someone with followers to talk about your product—it’s fast and paid. Let’s say you sell hair clips. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Find Someone</strong>: Open Instagram. Search “hair ideas”—look for accounts with 500-2000 followers. Pick one—like “HairByLily.”</li>
              <li><strong>Ask Them</strong>: Tap “Message.” Say: “Hi Lily! I love your posts. I make hair clips—can I send you one free if you show it to your followers? I’ll pay $10 too.”</li>
              <li><strong>Send It</strong>: If they say yes, mail a clip—maybe $2 cost. Send $10 via PayPal (paypal.com—sign up free, use “Send Money”).</li>
              <li><strong>Watch</strong>: They post: “Love this clip from [you]—get yours!” If 1000 see it and 5 buy at $5, that’s $25.</li>
              <li><strong>Try More</strong>: If it works, pay 3 more people $10 each. 15 sales = $75 for $32 spent!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: $12 spent ($10 + $2), 4 sales at $5 = $20. You keep $8, and it’s fast exposure!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Pay a little, and their fans find you quick—fast sales with help!</p>
            </div>
          </div>

          {/* Strategy 7: Make Videos (Organic) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">7. Make Videos—Show Off for Free</h3>
            <p className="text-gray-300 mb-4">
              Videos on TikTok or YouTube are free and fun—people watch and might buy. This is organic. Let’s say you sell stickers. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick a Place</strong>: Try TikTok—it’s quick. Download it, sign up with your email—free.</li>
              <li><strong>Make a Video</strong>: Tap the plus (+) button. Hold your phone, show your stickers—say: “I made these—they’re $5!” Record 10 seconds, tap the red button to stop.</li>
              <li><strong>Post It</strong>: Add words: “Stickers $5—message me!” Tap “Post.” It’s live for free.</li>
              <li><strong>Share It</strong>: Text friends: “Check my TikTok—tell someone!” If 50 see it, maybe 2 buy.</li>
              <li><strong>Keep Making</strong>: Do a new video weekly—like sticking them on a notebook. 5 videos, 5 sales at $5 = $25 free!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Picture: 100 views, 3 buy at $5 = $15. No cost—just your phone and fun!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Videos are free and exciting—people watch and might buy over time!</p>
            </div>
          </div>

          {/* Strategy 8: Email Ads (Paid) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">8. Email Ads—Pay to Send Messages</h3>
            <p className="text-gray-300 mb-4">
              Pay to send emails to people who might buy—it’s fast and targeted. Let’s say you sell candles. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Sign Up</strong>: Go to mailchimp.com—it’s free to start. Click “Sign Up,” use your email.</li>
              <li><strong>Get a List</strong>: Click “Audience,” then “Add Contacts.” Type 10 emails—friends or family who said okay. Or pay $10 later for a bigger list.</li>
              <li><strong>Make an Email</strong>: Click “Campaigns,” then “Create Email.” Write: “New Candles - $10!” Add: “Cozy up—buy here!” Use your PayPal link.</li>
              <li><strong>Send It</strong>: For 10 emails, it’s free—click “Send.” For more, pay $10 for 500—set it in “Billing,” add your card, hit “Send Now.”</li>
              <li><strong>Check</strong>: See “Reports”—maybe 50 open, 3 buy at $10 = $30. $20 left after $10!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: $10 for 500 emails, 5 buy at $10 = $50. You keep $40—fast and direct!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Pay to reach people’s inbox—quick sales from the right crowd!</p>
            </div>
          </div>

          {/* Strategy 9: Pin on Pinterest (Organic) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">9. Pin on Pinterest—Free Pictures That Sell</h3>
            <p className="text-gray-300 mb-4">
              Pinterest is free and great for showing off products—people look there to buy. This is organic. Let’s say you sell keychains. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Start It</strong>: Go to pinterest.com—sign up free with your email. Click “Create,” then “Create Board.” Name it “Cool Keychains.”</li>
              <li><strong>Add a Photo</strong>: Take a picture of your keychain—maybe on a bag. Click “Create Pin,” pick the photo.</li>
              <li><strong>Write About It</strong>: Title: “Handmade Keychain - $5.” Add: “Perfect for your keys—message me!” No link? Say “DM me!”</li>
              <li><strong>Tag It</strong>: Add words like “keychain,” “handmade,” “gift”—type them in “Tags.” People search these.</li>
              <li><strong>Wait and Win</strong>: Check “Analytics” in a week—maybe 50 views, 2 buy at $5 = $10 free!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: 5 pins, 100 views, 3 sales at $5 = $15. No cost—just photos working for you!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Free pics on Pinterest bring buyers slow and steady—no money needed!</p>
            </div>
          </div>

          {/* Strategy 10: Flyer Ads (Paid) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">10. Flyer Ads—Pay to Hand Out Info</h3>
            <p className="text-gray-300 mb-4">
              Pay to print flyers and give them out—it’s old-school but works fast. Let’s say you sell earrings. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Make a Flyer</strong>: Open Google Docs (docs.google.com—free). Type: “Earrings - $5!” Add: “Handmade—text [your number].” Add an earring photo—click “Insert,” “Image.”</li>
              <li><strong>Print It</strong>: Click “File,” “Print.” Print 50 at home or a shop—maybe $5 total at 10 cents each.</li>
              <li><strong>Give Them Out</strong>: Go to a busy place—like a park or school (ask permission). Hand out 50—say: “Hey, I made these—check it out!”</li>
              <li><strong>Wait for Texts</strong>: Maybe 10 text you, 3 buy at $5 = $15. You keep $10 after $5 cost.</li>
              <li><strong>Try More</strong>: If it works, print 100 next time—$10 cost, 6 sales = $30!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: $5 for 50 flyers, 4 sales at $5 = $20. You keep $15—fast and local!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Pay a little to get seen nearby—quick sales from people you meet!</p>
            </div>
          </div>

          {/* Visual Callout */}
          <div className="bg-orange-500 text-white p-6 rounded-xl text-center shadow-lg">
            <BarChart2 className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xl font-bold">Know What’s Working</p>
            <p className="mt-2">Our free Sales Dashboard shows you what gets sales—add your numbers, see the best way.</p>
            <Link to="/tools-dashboard" className="text-yellow-300 underline hover:text-yellow-200">Try it free →</Link>
          </div>
        </section>

        {/* Niche Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">Quick Marketing Ideas for What You Sell</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Clothes</h3>
              <p className="text-gray-300">Organic: Post “OOTD” pics free. Paid: $5 Instagram ad!</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Food</h3>
              <p className="text-gray-300">Organic: Share recipes free. Paid: $10 Google ad!</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Decor</h3>
              <p className="text-gray-300">Organic: Pin pics on Pinterest free. Paid: $5 flyer drop!</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Toys</h3>
              <p className="text-gray-300">Organic: TikTok video free. Paid: $10 influencer post!</p>
            </div>
          </div>
        </section>

        {/* CTA Section (No PDF) */}
        <section className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Start Marketing Today
          </h2>
          <p className="text-gray-100 mb-6">
            You’ve got 10 ways to get customers—free or paid. Pick one, try it, and see what works for you!
          </p>
          <p className="text-gray-200 mt-4">
            Want more help? <Link to="/tools" className="text-yellow-300 underline hover:text-yellow-200">Check our free tools</Link>—they make selling easier.
          </p>
        </section>
      </div>
    </div>
  );
}