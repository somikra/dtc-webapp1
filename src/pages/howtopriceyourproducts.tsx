import React from 'react';
import { ArrowRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowToPriceYourProducts() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 py-24 animate-gradient-x relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight mb-6">
            How to Price Your Products:
            <br />
            <span className="text-yellow-300">Your Easy Guide to Winning Without Going Too Cheap</span>
          </h1>
          <p className="text-xl text-gray-100 text-center">
            New to selling? Don’t worry! This guide shows you how to pick prices for your stuff that make money—not lose it—even if you’re just starting and English isn’t your first language. Let’s do this step by step!
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
          <h2 className="text-3xl font-bold text-white mb-4">You Can Price Smart—Here’s How</h2>
          <p className="text-gray-300 leading-relaxed">
            Hi! Maybe you’re 16 and you just made something awesome—like bracelets, cookies, or drawings—and you want to sell it online. But picking a price is tricky. If it’s too low, you don’t make money. If it’s too high, no one buys. Big stores can sell cheap because they make tons of stuff, but you’re special—you make things yourself or in small amounts. This guide is here to help you choose prices that feel good for you and your customers, without making it a contest to be the cheapest. We’ve got 10 ways to do it, explained super clearly, like a friend walking you through it. You don’t need fancy math or lots of experience—just a phone or paper and this plan. Each way is a step-by-step idea you can try right now. Even if English is new to you, you’ll get it and know what to do. Let’s make your prices work so you can keep doing what you love!
          </p>
        </section>

        {/* Strategies Section */}
        <section id="strategies" className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">10 Ways to Price Your Products Smart</h2>

          {/* Strategy 1: Know Your Costs */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">1. Know Your Costs—Figure Out What You Spend</h3>
            <p className="text-gray-300 mb-4">
              Before you pick a price, you need to know how much it costs you to make your product. If you don’t, you might charge too little and lose money. Let’s say you make bracelets. Here’s how to find your costs, super easy:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Write Down What You Use</strong>: Grab a piece of paper or open your phone’s Notes app. Think about one bracelet. What do you buy to make it? Maybe beads, string, and a clasp. Write those down. For example: “Beads—10 cents each, I use 5, so 50 cents. String—20 cents. Clasp—30 cents.”</li>
              <li><strong>Add It Up</strong>: Look at your list. Add all the costs together. For the bracelet: 50 cents (beads) + 20 cents (string) + 30 cents (clasp) = 1 dollar total. That’s how much you spend on stuff for one bracelet.</li>
              <li><strong>Think About Time</strong>: How long does it take you to make it? Maybe 15 minutes. Your time is worth something! Decide how much—like 50 cents for 15 minutes. Add that to your cost: 1 dollar (stuff) + 50 cents (time) = 1 dollar and 50 cents.</li>
              <li><strong>Include Sending It</strong>: If you mail it to someone, that costs money too. Check at your post office—maybe an envelope and stamp is 60 cents. Add that: 1 dollar 50 cents + 60 cents = 2 dollars and 10 cents. That’s your total cost for one bracelet.</li>
              <li><strong>Set a Price Above It</strong>: You can’t sell for 2 dollars and 10 cents—you’d make nothing! Add extra to keep some money. Try doubling it: 2 dollars 10 cents x 2 = 4 dollars 20 cents. Or add a bit more, like 5 dollars. Test it—sell one and see if people buy!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Let’s say your bracelet costs 2 dollars and 10 cents to make and send. You sell it for 5 dollars. Someone buys it—you keep 2 dollars and 90 cents after costs. That’s money for you! Knowing your costs stops you from going too cheap.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">If you know what you spend, you won’t lose money. It’s the first step to a smart price!</p>
            </div>
          </div>

          {/* Strategy 2: Look at Others */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">2. Look at Others—See What People Charge</h3>
            <p className="text-gray-300 mb-4">
              Check what other sellers charge for stuff like yours—it helps you pick a price that fits. Let’s say you sell cookies. Here’s how to look and learn:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Find Similar Things</strong>: Open your phone or computer. Go to a place like Etsy.com—it’s where people sell homemade stuff. Type “homemade cookies” in the search bar at the top and press enter.</li>
              <li><strong>Write Down Prices</strong>: Look at the cookies that pop up. See how much they cost. Maybe one says “6 cookies for $8,” another is “10 cookies for $12.” Write those on paper—like “$8 for 6” and “$12 for 10.”</li>
              <li><strong>Compare to Yours</strong>: Think about your cookies. How many do you sell at once? Let’s say 8 cookies. Look at the list—$8 for 6 is about 1 dollar 33 cents each cookie. $12 for 10 is 1 dollar 20 cents each. Your 8 cookies should be close to that—not way lower.</li>
              <li><strong>Pick a Middle Price</strong>: Take the prices you found and find something in between. For 8 cookies: 8 x 1 dollar 20 cents = $9.60. 8 x 1 dollar 33 cents = $10.64. Try $10—it’s not the cheapest, but not too high either.</li>
              <li><strong>Test and Ask</strong>: Sell one pack for $10. Ask the buyer: “Was that a good price?” Or post on Instagram: “Cookies $10—too much or just right?” If people say it’s fair, keep it. If not, try $9 or $11 next time.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: You see cookies at $8 and $12, so you pick $10 for 8. You sell 5 packs—that’s $50. If you went too low at $6, you’d only get $30. Looking at others keeps your price strong!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Seeing other prices shows what people will pay—you stay fair without going too low!</p>
            </div>
          </div>

          {/* Strategy 3: Add Special Value */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">3. Add Special Value—Make Your Product Worth More</h3>
            <p className="text-gray-300 mb-4">
              If your product has something extra special, you can charge more—not less. Let’s say you draw pictures. Here’s how to add value:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Find What’s Special</strong>: Think about your drawings. Are they different? Maybe you draw animals really well, or you use bright colors. Write down: “My drawings are special because they’re super colorful.”</li>
              <li><strong>Tell People</strong>: When you sell, say why it’s worth more. Post on Instagram: “My drawings are $15 each—they’re extra colorful and one-of-a-kind!” Or tell a buyer: “This took me 2 hours—it’s special!”</li>
              <li><strong>Add a Little Extra</strong>: Give something small with it—like a note saying “Thanks!” in fun writing, or pack it in a pretty envelope. It doesn’t cost much—maybe 20 cents—but feels nice.</li>
              <li><strong>Try a Higher Price</strong>: If plain drawings sell for $10, try $15 because yours are special. Sell one and see—did they like it? Ask: “Was $15 okay for this?” If yes, keep it high.</li>
              <li><strong>Show It Off</strong>: Take a photo of your drawing next to a plain one—post it: “See the difference? Worth $15!” People pay more when they see why it’s better.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Picture this: You sell a colorful drawing for $15 instead of $10. You make 5 sales—that’s $75, not $50. The extra special stuff means you don’t have to be cheapest!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Special things can cost more—people pay for what’s different, not just cheap!</p>
            </div>
          </div>

          {/* Strategy 4: Start High and Lower Later */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">4. Start High and Lower Later—Test the Top Price</h3>
            <p className="text-gray-300 mb-4">
              Begin with a higher price to see what people will pay—then lower it if needed. Let’s say you sell phone cases. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick a High Price</strong>: Think what your phone case could be worth—maybe $20 because it’s cool. Write it down: “Start at $20.”</li>
              <li><strong>Sell One</strong>: Post on Instagram: “New phone case—$20! Message me to buy.” Or tell a friend: “It’s $20—want it?” See if they say yes or no.</li>
              <li><strong>Ask Why</strong>: If they buy, great! Ask: “Was $20 good?” If they say no, ask: “What’s too much?” Maybe they say $15 feels better.</li>
              <li><strong>Lower a Little</strong>: If no one buys at $20 after 5 tries, drop to $18. Post again: “Phone case now $18!” Try selling 2 more. Keep going—$16, then $14—until people buy.</li>
              <li><strong>Stop When It Works</strong>: If 3 people buy at $16, stay there. You started high and found a good spot—not the bottom!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: You start at $20, no sales. Drop to $16, sell 4—that’s $64. If you started at $10, you’d only get $40. High first means more money before you go low!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Starting high finds the most people will pay—you don’t guess too cheap right away!</p>
            </div>
          </div>

          {/* Strategy 5: Bundle Products */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">5. Bundle Products—Sell More Together</h3>
            <p className="text-gray-300 mb-4">
              Put a few things together and charge more—it’s worth it for them and you. Let’s say you make soap. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick a Bundle</strong>: Think of 3 soaps—like lavender, lemon, and mint. Alone, each is $5. Together, they could be more special.</li>
              <li><strong>Set a Bundle Price</strong>: Add the costs—3 soaps at $5 is $15. But don’t stop there. Try $18 for all 3—it’s a little more, but feels like a deal compared to $15 separate.</li>
              <li><strong>Tell People</strong>: Post: “Get 3 soaps for $18—lavender, lemon, mint! Usually $5 each.” Or text friends: “3 soaps, $18—better than one!”</li>
              <li><strong>Try It Out</strong>: Sell one bundle. If they buy, ask: “Was $18 good for 3?” If yes, keep it. If no, try $16 next time.</li>
              <li><strong>Keep Bundling</strong>: If 5 people buy at $18, that’s $90—not $75 for 15 single soaps. Add new bundles—like soap and a note for $20!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: 4 bundles at $18 = $72. Selling 12 soaps alone at $5 = $60. Bundles make more money without being the cheapest!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Bundles feel like a treat—people pay more for more, not less!</p>
            </div>
          </div>

          {/* Strategy 6: Use Small Discounts */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">6. Use Small Discounts—Lower a Little, Not a Lot</h3>
            <p className="text-gray-300 mb-4">
              Give a tiny price cut sometimes—not a huge one—so you still make money. Let’s say you sell stickers. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Set Your Normal Price</strong>: Decide your sticker pack is $6—it covers costs ($2) and gives you $4.</li>
              <li><strong>Pick a Small Cut</strong>: Instead of $3, try $5—about 15% off. It’s less, but still exciting.</li>
              <li><strong>Make It Short</strong>: Post on Instagram: “Stickers $5 this week only—usually $6! Message me!” Tell friends too.</li>
              <li><strong>Sell and Check</strong>: Sell 3 packs at $5—that’s $15, you keep $9 after $6 costs. At $6, it’d be $18 and $12 profit. Ask: “Was $5 fun?” If they love it, do it again.</li>
              <li><strong>Keep It Rare</strong>: Don’t always discount—maybe once a month. Normal $6 keeps you strong, $5 is a treat!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Picture: 5 sales at $5 = $25, you keep $15. At $3, it’s $15 and only $5 left. Small cuts beat big drops!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">A little discount gets buyers without losing all your money—smart and safe!</p>
            </div>
          </div>

          {/* Strategy 7: Charge for Time */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">7. Charge for Time—Value Your Work</h3>
            <p className="text-gray-300 mb-4">
              If it takes you time to make something, add that to your price—it’s fair! Let’s say you knit scarves. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Count Your Time</strong>: Time how long one scarf takes—maybe 3 hours. Write it: “3 hours for 1 scarf.”</li>
              <li><strong>Give Time a Price</strong>: Decide what your hour is worth—like $5. So 3 hours = $15. That’s for your work!</li>
              <li><strong>Add Material Costs</strong>: Yarn and needles might be $5. Total cost: $15 (time) + $5 (stuff) = $20.</li>
              <li><strong>Set a Full Price</strong>: Add extra—try $25. Post: “Handmade scarf—$25, took me 3 hours!” Tell buyers why.</li>
              <li><strong>Try and Ask</strong>: Sell one at $25. Ask: “Was it worth $25 for 3 hours?” If yes, keep it. If no, try $22.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: 3 scarves at $25 = $75, you keep $60 after $15 costs. At $10, it’s $30 and $15—way less! Time matters.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Your time is valuable—charging for it keeps your price up and fair!</p>
            </div>
          </div>

          {/* Strategy 8: Offer Options */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">8. Offer Options—Give Choices, Not Just Cheap</h3>
            <p className="text-gray-300 mb-4">
              Sell different versions—some cost more—so people pick what fits. Let’s say you make candles. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Make Two Kinds</strong>: Try a small candle ($5 cost) and a big one ($10 cost). Small takes 1 hour, big takes 2.</li>
              <li><strong>Price Them</strong>: Small: $5 (cost) + $5 (time) + $5 (extra) = $15. Big: $10 + $10 + $5 = $25.</li>
              <li><strong>Show Both</strong>: Post: “Candles! Small $15, Big $25—pick your size!” Tell friends too.</li>
              <li><strong>Sell and See</strong>: Sell 2 small ($30) and 1 big ($25)—that’s $55. Ask: “Which did you like?”</li>
              <li><strong>Keep Options</strong>: If more buy big, make more $25 ones. Options mean not everyone picks cheap!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: 3 small at $15 = $45, 2 big at $25 = $50. Total $95—not $45 if all were $15! Choices win.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Options let people pay more for more—not just the lowest price!</p>
            </div>
          </div>

          {/* Strategy 9: Talk to Buyers */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">9. Talk to Buyers—Ask What They’ll Pay</h3>
            <p className="text-gray-300 mb-4">
              Ask people what they think is fair—it helps you price right. Let’s say you sell keychains. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Guess a Price</strong>: Think your keychain costs $2 to make—try $5 to start.</li>
              <li><strong>Ask Friends</strong>: Text 5 friends: “I made a keychain—$5. Too much, too little, or good?” Write what they say.</li>
              <li><strong>Post It</strong>: On Instagram: “Keychains $5—tell me if that’s fair!” Look at comments—maybe “$4” or “$6.”</li>
              <li><strong>Pick From Answers</strong>: If 3 say $5, 2 say $4—try $5 first. Sell 2 and ask buyers: “Was $5 okay?”</li>
              <li><strong>Change if Needed</strong>: If most say $4, switch to $4.50. Sell 5 at $4.50—that’s $22.50, not $20 at $4!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think: 4 sales at $5 = $20. At $3, it’s $12. Asking keeps you higher than the bottom!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Buyers tell you what works—you don’t guess too low and lose out!</p>
            </div>
          </div>

          {/* Strategy 10: Sell Less, Charge More */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">10. Sell Less, Charge More—Make Fewer, Better Things</h3>
            <p className="text-gray-300 mb-4">
              Make fewer products but charge more for them—it’s less work and more money. Let’s say you make earrings. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Make Special Ones</strong>: Instead of 10 simple earrings at $5, make 5 fancy ones—better beads, more time.</li>
              <li><strong>Figure Costs</strong>: Simple cost $1 each, fancy cost $3. Time: 15 min ($1) vs. 30 min ($2). Fancy total: $5.</li>
              <li><strong>Price High</strong>: Simple was $5, try fancy at $12. Post: “Fancy earrings—$12, only 5 made!”</li>
              <li><strong>Sell Them</strong>: Sell 3 at $12 = $36, keep $21 after $15 costs. 10 simple at $5 = $50, keep $40—but more work!</li>
              <li><strong>Stay Special</strong>: Keep making fewer—sell 5 more at $12 = $60. Less work, more cash!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Picture: 5 fancy at $12 = $60, keep $35. 15 simple at $5 = $75, keep $60—but triple the effort. Less is more!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Fewer, better things mean higher prices and less stress—not a cheap race!</p>
            </div>
          </div>

          {/* Visual Callout */}
          <div className="bg-orange-500 text-white p-6 rounded-xl text-center shadow-lg">
            <BarChart2 className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xl font-bold">Know What’s Working</p>
            <p className="mt-2">Our free Sales Dashboard shows you what sells best—add your sales, see the wins.</p>
            <Link to="/tools-dashboard" className="text-yellow-300 underline hover:text-yellow-200">Try it free →</Link>
          </div>
        </section>

        {/* Niche Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">Quick Pricing Ideas for What You Sell</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Clothes</h3>
              <p className="text-gray-300">Shirt $20—special design, not $10 like plain ones!</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Food</h3>
              <p className="text-gray-300">Cookies $12 for 10—homemade taste, not $5 store kind.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Decor</h3>
              <p className="text-gray-300">Candle $15—hand-poured, not $8 for boring ones.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Toys</h3>
              <p className="text-gray-300">Toy $25—unique, not $10 for mass-made.</p>
            </div>
          </div>
        </section>

        {/* CTA Section (No PDF) */}
        <section className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Start Pricing Smart Today
          </h2>
          <p className="text-gray-100 mb-6">
            You’ve got 10 ways to price your stuff right—try one now and see the difference! You don’t have to be the cheapest to win.
          </p>
          <p className="text-gray-200 mt-4">
            Need more help? <Link to="/tools" className="text-yellow-300 underline hover:text-yellow-200">Check our free tools</Link>—they make selling easier.
          </p>
        </section>
      </div>
    </div>
  );
}