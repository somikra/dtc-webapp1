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
            <span className="text-yellow-300">Your Easy Guide to Selling Online</span>
          </h1>
          <p className="text-xl text-gray-100 text-center">
            Just starting out? Don’t worry! This guide is for you—even if you’re new, have no money, or English isn’t your first language. We’ll show you every step to get people buying your stuff online, simple and clear.
          </p>
          <div className="flex justify-center mt-8">
            <a
              href="#playbook"
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
          <h2 className="text-3xl font-bold text-white mb-4">You Can Do This—Here’s How</h2>
          <p className="text-gray-300 leading-relaxed">
            Hey there! Maybe you’re 16, just made something cool like bracelets or cookies, and you want to sell it online. Or maybe you’ve got an idea but no one’s buying yet. That’s okay! Everyone starts somewhere. Big companies have lots of money and people to help them, but you don’t need that. You’ve got energy, a phone or computer, and this guide. We’re going to walk you through 10 different ways to get your first customers—people who’ll pay for what you’re selling. Each way is explained super clearly, step by step, like a friend showing you how to do it. You don’t need to be rich or super smart at tech. If you can read this, you can do it. We’ll use simple words, give you examples, and make sure you know exactly what to do. Ready? Let’s make your first sale happen!
          </p>
        </section>

        {/* Playbook Section */}
        <section id="playbook" className="mb-16">
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">10 Ways to Get Customers: Your Simple Plan</h2>

          {/* Strategy 1: Targeted Social Media Ads */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">1. Targeted Social Media Ads—Show Your Stuff to the Right People</h3>
            <p className="text-gray-300 mb-4">
              Social media is where people hang out—like Instagram, TikTok, or Facebook. You can pay a little money to show your product to people who might buy it. Don’t worry, it’s not hard, and you don’t need a lot of cash. Let’s say you’re selling colorful phone cases. Here’s exactly how to do it, step by step:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick One App to Use</strong>: First, decide where to show your ad. If your product looks pretty—like clothes, jewelry, or phone cases—use Instagram. If it’s fun or weird—like a toy or snack—try TikTok. Download the app on your phone if you don’t have it. Sign up with your email—it’s free. For our phone case example, let’s pick Instagram because people love seeing cool designs there.</li>
              <li><strong>Make Something to Show</strong>: Take a picture or a short video with your phone. For the phone case, maybe hold it up and snap a photo where it looks bright and clear. Or record a 5-second video of you putting it on your phone. Don’t worry if it’s not perfect—just make sure people can see what you’re selling. Write a little message like: “Get this phone case! First 10 people get it cheaper—free shipping too!” That makes people excited to buy fast.</li>
              <li><strong>Find the Right People</strong>: Open Instagram on your phone. Make a post with your picture or video—click the plus (+) button at the bottom, pick your file, write your message, and hit “Share.” Now, turn it into an ad. After posting, you’ll see a button under it that says “Boost Post” or “Promote.” Tap that. Instagram will ask: “Who should see this?” Pick an age—like 13 to 20 if you think teens want your phone case. Pick interests—like “fashion” or “phones.” Choose your country or city. This makes sure only people who might like your stuff see it, so you don’t waste money.</li>
              <li><strong>Pay a Little to Show It</strong>: Instagram will ask how much money you want to spend. Start small—choose $5 total. Then pick how long—like 2 days. That’s $2.50 a day, super cheap! You need a debit card or PayPal—type in the numbers when it asks. Hit “Boost” or “Start” at the end. Your ad will start showing up on people’s phones right away.</li>
              <li><strong>See What Happens and Make It Better</strong>: After 2 days, check how it went. On your post, tap “View Insights” or “Promotion Results.” It’ll show how many people saw it (maybe 200) and how many clicked your link (maybe 5). If you got 1 sale, awesome—that’s a win! If not, try again. Change the picture or write something new like “15% off today only!” Spend another $5. Keep the one that gets more clicks and stop the ones that don’t work.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine this: You spend $5, 300 people see your phone case, 10 click, and 2 buy it for $10 each. You just made $20 from $5! That’s how ads can work. Start with a tiny amount, like pocket money, and grow from there.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Even a small ad can find people who want your stuff. It’s like putting a sign in a busy place, but online—and you control who sees it!</p>
            </div>
          </div>

          {/* Strategy 2: Lead Magnets */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">2. Lead Magnets—Give Something Free to Get Buyers</h3>
            <p className="text-gray-300 mb-4">
              People don’t buy from someone they don’t know. A lead magnet is a small free thing you give them—like a list of tips—so they trust you and give you their email. Then you can tell them about your product later. Let’s say you sell homemade cookies. Here’s how to do it, super easy:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Think of Something They Want</strong>: What do people who like cookies care about? Maybe quick snacks or fun recipes. Make a little list called “5 Easy Cookie Snack Ideas.” It’s free, and it connects to your cookies because they could use them in the ideas. Keep it simple so it’s not hard to make.</li>
              <li><strong>Create Your Free Gift</strong>: Open your phone or computer and go to docs.google.com—it’s free, like an online notebook. Sign in with your email or make a new one. Click “New” then “Document.” Type a title: “5 Easy Cookie Snack Ideas.” Write 5 short tips, like: “1. Dip a cookie in milk for a quick treat.” or “2. Crumble a cookie on yogurt—yummy!” Add a picture—take one of your cookie with your phone and upload it by clicking “Insert,” then “Image.” When it’s done, click “File” at the top, then “Download,” then “PDF Document.” Save it on your phone or computer.</li>
              <li><strong>Put It Somewhere They Can Get It</strong>: You need a way for people to download your PDF. Go to linktr.ee on your phone or computer—it’s a free website. Sign up with your email. Click “Add New Link.” Name it “Get My Free Cookie Guide.” Now upload your PDF to Google Drive (drive.google.com, also free). Sign in, click “New,” then “File Upload,” pick your PDF, and click it once uploaded. Hit “Share,” change it to “Anyone with the link,” and copy the link. Paste that link into your Linktree. Save it.</li>
              <li><strong>Tell People About It</strong>: Open Instagram or any app you use. In your bio (the little description under your name), paste your Linktree link—edit your profile and add it there. Make a post or story saying: “I made a free guide—5 Cookie Snack Ideas! Click my bio to get it!” Tell 5 friends by text: “Hey, I made this cool free thing—can you share it?” They might tell others too.</li>
              <li><strong>Talk to Them After</strong>: When someone clicks your link and gets the guide, ask for their email first. On Linktree, add a note: “Put your email here to get it!” Write down the emails you get on paper or in your phone. Send them an email from your Gmail: “Hi! Here’s your cookie guide—hope you like it!” Two days later, send another: “Hey, did you enjoy the guide? My cookies make these snacks even better—use code COOKIE10 for 10% off!” If you get 10 emails, that’s 10 people who might buy.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Picture this: You give away your guide to 20 people. 5 email you back and buy a $5 cookie pack with the discount. That’s $25 from something free! It’s like making friends who turn into customers.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Giving something free makes people like you. Then you can talk to them and sell later—it’s slow but strong!</p>
            </div>
          </div>

          {/* Strategy 3: Referral Program */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">3. Referral Program—Let Friends Help You Sell</h3>
            <p className="text-gray-300 mb-4">
              Your friends and family can tell people about your product—it’s free and works because people trust them more than ads. Let’s say you’re selling bracelets. Here’s how to get them to help you:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Make a Special Offer</strong>: Decide on a discount—like 15% off your bracelets. If you have a shop online (like Etsy or a simple website), go to the settings. Look for “Discounts” or “Coupons.” Make a code called “FRIEND15” that takes 15% off the price. If you don’t have a shop, just write it down—you’ll do it by hand later.</li>
              <li><strong>Ask Your Friends</strong>: Open your phone and text 10 people you know—friends, cousins, anyone. Say: “Hi! I’m selling bracelets now—they’re really cool. Can you tell people about them? If they use this code FRIEND15, they get 15% off. If 3 people buy with it, I’ll give you a free bracelet!” Make it fun so they want to help.</li>
              <li><strong>Help Them Share</strong>: Tell your friends how to tell others. They can text their own friends: “Hey, my friend makes awesome bracelets—use FRIEND15 to get 15% off!” Or post on Facebook or Instagram: “Check out these bracelets—code FRIEND15 saves you money!” Give them a picture of your bracelet to share—send it by text or WhatsApp.</li>
              <li><strong>Keep Track</strong>: When someone buys, ask them: “Did you use a code? Which one?” Write it down—like “FRIEND15 from Sarah.” If you have a shop, check the “Orders” page—it shows the codes people used. After 3 sales from one friend, send them their free bracelet and say thanks!</li>
              <li><strong>Make It Bigger</strong>: After someone buys, email them: “Hi! Thanks for getting a bracelet. If you tell a friend to use FRIEND15, your next one is 15% off too!” Use your email or phone to send it. If 5 friends share and each gets 2 sales, that’s 10 customers from people you know!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think about it: Your friend posts about your bracelet, 10 people see it, and 2 buy at $10 each. That’s $20, and it didn’t cost you anything! Friends helping friends is powerful.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">People believe their friends. It’s free, easy, and grows fast if you keep it going!</p>
            </div>
          </div>

          {/* Strategy 4: Pinterest Posts */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">4. Pinterest Posts—Show Off Your Product for Free</h3>
            <p className="text-gray-300 mb-4">
              Pinterest is like an online bulletin board where people look for ideas—and stuff to buy. It’s free and great if your product looks nice, like candles. Here’s how to use it:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Start Your Pinterest</strong>: Go to pinterest.com on your phone or computer. Click “Sign Up” and use your email—it’s free. After you’re in, click “Create” then “Create a Board.” Name it “My Candle Ideas” or something fun about your product.</li>
              <li><strong>Take Some Pictures</strong>: Grab your phone and take 5 photos of your candle. Try different ways—like one lit up, one on a table, one in your hand. Make sure it’s bright—open a window or use a lamp. Don’t worry if it’s not perfect, just show it off.</li>
              <li><strong>Add Your Pictures</strong>: On Pinterest, click “Create Pin” in your board. Pick one photo from your phone. Give it a title like “Handmade Candle - Buy It Here.” Write a little note: “This candle makes your room cozy—get it at [your shop link].” If you don’t have a shop, use a PayPal link or say “Message me to buy!”</li>
              <li><strong>Help People Find It</strong>: Add words people might search—like “handmade candle,” “cozy decor,” “gift idea,” “scented candle,” “cheap candles.” Type them in the “Tags” or “Description” box. This is how people see your pin when they look for stuff like yours.</li>
              <li><strong>Check and Do More</strong>: Wait a week, then go to your profile and click “Analytics” or “Stats.” It shows how many saw your pin—like 50 views or 100. If lots of people look, make more pins with new photos. If someone clicks your link and buys, you’ve got a sale from zero cost!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: You post 5 pins, each gets 50 views, so 250 people see your candle. 5 click and 1 buys for $15. That’s money from just pictures! Pinterest is like a free store window.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">It’s free and people go there to shop. Good pictures can bring buyers without spending a penny!</p>
            </div>
          </div>

          {/* Strategy 5: Local Online Groups */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">5. Local Online Groups—Sell to People Near You</h3>
            <p className="text-gray-300 mb-4">
              There are groups online—like on Facebook—where people in your town or area talk and buy things. It’s a great place to start because they’re close. Let’s say you sell drawings. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Find the Groups</strong>: Open Facebook on your phone or computer. In the search bar at the top, type “Buy and Sell [Your Town]” or “[Your Town] Marketplace.” Like if you’re in Miami, try “Buy and Sell Miami.” Click “Groups” to see them. Join 2 or 3 that look busy—lots of posts every day.</li>
              <li><strong>Say Hello</strong>: Once you’re in, make a post. Click “Write something” or “Sell something.” Say: “Hi everyone! I’m [your name], and I make drawings. They’re fun and colorful—thought you might like them!” Add a photo of your best drawing—take it with your phone in good light.</li>
              <li><strong>Give a Little Deal</strong>: Add to your post: “The first 5 people who buy get 10% off—just message me!” This makes people want to act fast. Tell them how to buy—like “Send me a message” or “Pay with PayPal at [your email].”</li>
              <li><strong>Talk to People</strong>: If someone comments, “Cool drawings!” reply fast: “Thanks! Want one? It’s $10, or $9 with the discount.” Be nice—it makes them trust you. If they message, answer quick with how to pay and get it.</li>
              <li><strong>Keep Posting</strong>: Every week, post again with a new drawing or deal—like “This week only, 2 drawings for $15!” Don’t post too much or people get annoyed—just once a week is good. If 3 people buy the first time, you’ve started strong!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think of this: You post in a group with 1000 people, 50 see it, and 3 buy a $10 drawing. That’s $30 from your neighborhood! Local groups are like a market right at home.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">People near you like buying from someone they feel close to—it’s easy and personal!</p>
            </div>
          </div>

          {/* Strategy 6: Free Samples */}
          <div className=" chemicalbg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">6. Free Samples—Let Them Try Before They Buy</h3>
            <p className="text-gray-300 mb-4">
              Giving a tiny bit of your product for free can make people want the big version. It’s cheap and shows how good your stuff is. Let’s say you make lip balm. Here’s how to do it:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick Something Small</strong>: Look at your lip balm. Can you make a tiny one—like a little dab in a small container? It should cost you less than $1 to make. Maybe use a tiny jar from a craft store or even a clean bottle cap with plastic wrap!</li>
              <li><strong>Tell People</strong>: Open Instagram or WhatsApp. Make a post or message: “Want a free lip balm sample? Just pay $2 to ship it—send me a message!” The $2 covers your envelope and stamp so you don’t lose money.</li>
              <li><strong>Get the Money</strong>: When someone messages, say: “Great! Send $2 to my PayPal at [your email].” Sign up at paypal.com if you don’t have it—it’s free. They send the money, you get a note saying it’s there. Write their address down from their message.</li>
              <li><strong>Send It Out</strong>: Put the tiny lip balm in an envelope—get cheap ones at a dollar store. Write their address, add a stamp (check the price at your post office, like $0.50), and mail it. Include a note: “Thanks! Hope you love it—full size is $5.”</li>
              <li><strong>Ask Them Later</strong>: A week after they get it, message or email: “Hi! Did you like the lip balm? The big one’s 15% off with code SAMPLE15—just $4.25!” If 5 people try it and 2 buy, you’ve got $8.50 from a $5 start!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Picture this: 10 people pay $2 for a sample—that’s $20. You spend $5 on making and mailing, so you keep $15. Then 3 buy the full size for $12.75 total. That’s $27.75 from a little free gift! Trying it makes them love it.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">When people try your product, they see how great it is—and they’ll want more!</p>
            </div>
          </div>

          {/* Strategy 7: Collaborations */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">7. Collaborations—Team Up with Others</h3>
            <p className="text-gray-300 mb-4">
              Find someone online who has followers and work together—they tell their people about you. It’s free if you give them something. Let’s say you sell hair clips. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Look for Someone</strong>: Open Instagram. Search for people who post about hair or fashion—type “hair ideas” in the search bar. Look for accounts with 500 to 2000 followers—not too big, so they’ll talk to you. Find one you like, like “HairByJenny.”</li>
              <li><strong>Ask Them</strong>: Click their profile, then “Message.” Write: “Hi Jenny! I love your hair posts. I make hair clips—can I send you a free one to show your followers?” Be nice and short—they’re busy too.</li>
              <li><strong>Send It and Help Them</strong>: If they say yes, ask for their address in messages. Mail a hair clip—put it in an envelope with a note: “Thanks! Here’s a code—HAIR10—for your followers to get 10% off.” Tell them: “Post a pic wearing it and share the code!”</li>
              <li><strong>Watch What Happens</strong>: When they post, look at it—see if people comment or message you. If you have a shop, check if anyone uses “HAIR10” to buy. Write down how many sales—like 2 clips at $5 each.</li>
              <li><strong>Do It More</strong>: If Jenny’s post gets you 3 sales, find 5 more people like her. Message them the same way. If each gets 2 sales, that’s 10 customers from just mailing a few clips!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: Jenny has 1000 followers, posts your clip, and 50 see it. 5 buy at $5 each—that’s $25. You spent $2 on the clip and shipping, so you keep $23! Teaming up is like borrowing their megaphone.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Someone else’s followers become your customers—it’s free advertising with a friend!</p>
            </div>
          </div>

          {/* Strategy 8: Flash Sales */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">8. Flash Sales—Make a Quick Deal</h3>
            <p className="text-gray-300 mb-4">
              A flash sale is a super fast discount—like one day only—so people buy now, not later. Let’s say you sell stickers. Here’s how to do it:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Choose Your Deal</strong>: Pick one thing—like your best sticker pack. Decide to sell it cheaper for 24 hours—say from $5 to $4 (20% off). Write it down so you remember.</li>
              <li><strong>Tell Everyone</strong>: Open Instagram. Make a Story—tap the plus (+) button, pick a sticker photo, and write: “Flash Sale! Stickers $4 today only—usually $5! Buy here: [your link].” If you don’t have a shop, say “Message me!”</li>
              <li><strong>Add a Clock</strong>: On the Story, tap the sticker icon (a square with a smiley) and pick “Countdown.” Name it “Sale Ends,” set it to midnight tonight, and add it. It ticks down so people hurry.</li>
              <li><strong>Spread the Word</strong>: Text 5 friends: “Hey, I’m doing a quick sale—stickers $4 today only! Tell someone?” Post in a group or on WhatsApp too: “Flash sale—stickers $4 till midnight!”</li>
              <li><strong>Count It Up</strong>: After midnight, see how many bought. Check messages or your shop orders. If 4 people buy at $4, that’s $16 in a day! Next time, try 2 days or a bigger discount.</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think about it: 20 people see your Story, 5 buy at $4—that’s $20 fast! People love deals, and the countdown makes them act quick.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Fast sales get people excited—they don’t want to miss out, so they buy right away!</p>
            </div>
          </div>

          {/* Strategy 9: Content Sharing */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">9. Content Sharing—Share Ideas to Get Attention</h3>
            <p className="text-gray-300 mb-4">
              Write something helpful about your product to get people interested—no website needed. Let’s say you sell homemade soap. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Pick an Idea</strong>: Think what people want to know about soap—like keeping skin soft. Decide to write “5 Ways to Make Your Skin Happy.” It’s easy and connects to your soap.</li>
              <li><strong>Write It Down</strong>: Open your phone’s Notes app or Google Docs. Type: “5 Ways to Make Your Skin Happy.” Write 5 short tips: “1. Wash with warm water.” “2. Use soft soap (like mine!).” “3. Pat dry, don’t rub.” “4. Add lotion after.” “5. Drink water all day.” Keep it simple!</li>
              <li><strong>Share It</strong>: Open Facebook or X. Post: “I made this—5 Ways to Make Your Skin Happy! Number 2 is my soap—message me to get it!” If you have a link, add it. Use your soap photo too—upload it with the post.</li>
              <li><strong>Talk to People</strong>: If someone says “Nice tips!” reply: “Thanks! My soap helps with #2—it’s $5, want one?” Be friendly. Answer everyone who talks to you.</li>
              <li><strong>Do It Again</strong>: Every week, write a new list—like “5 Bath Time Tricks.” Post it the same way. If 10 people like the first one and 2 buy, keep going—more will come!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Imagine: 30 people see your post, 5 say something, and 2 buy soap at $5 each. That’s $10 from a little note! Sharing ideas makes people notice you.
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">Helping people with ideas makes them like you—and then they might buy your stuff!</p>
            </div>
          </div>

          {/* Strategy 10: Pre-Orders */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-3">10. Pre-Orders—Sell Before You Make It</h3>
            <p className="text-gray-300 mb-4">
              Get people to pay for your product before it’s ready—it saves money and tests if they like it. Let’s say you want to sell keychains. Here’s how:
            </p>
            <ul className="text-gray-300 list-decimal pl-5 mb-4">
              <li><strong>Plan Your Product</strong>: Decide on a keychain design—like a star shape. Say it’s “coming soon” and you’ll make it in 2 weeks. Offer it cheaper now—like $5 instead of $6 (about 20% off).</li>
              <li><strong>Tell People</strong>: Post on Instagram or WhatsApp: “Pre-order my new star keychain! $5 now, ships in 2 weeks—usually $6. Pay here: [PayPal link].” Get a PayPal at paypal.com—use “Send Money” to make a link or say “Message me!”</li>
              <li><strong>Get the Money</strong>: When someone messages, send them your PayPal email or a payment link. They pay $5, you see it in PayPal. Write down their name and address—they’ll get it later.</li>
              <li><strong>Keep Them Updated</strong>: After a week, email or message: “Thanks for pre-ordering! Your keychain ships in 7 days—I’m making it now!” Use the money they paid to buy materials—like $2 for supplies.</li>
              <li><strong>Send It and Grow</strong>: Make the keychains, put them in envelopes, and mail them with stamps. After they get it, say: “Hope you love your keychain! Tell a friend?” If 3 pre-order, that’s $15 to start—and more might come!</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Think of it: 5 people pre-order at $5—that’s $25. You spend $10 on supplies and shipping, keep $15, and have happy customers who might buy again. It’s like a safe start!
            </p>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-300 font-semibold">Why This Helps You:</p>
              <p className="text-gray-200">You get money first, so you can make what people already want—no guessing!</p>
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
          <h2 className="text-3xl font-extrabold text-yellow-300 mb-8">Extra Ideas for What You Sell</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Clothes</h3>
              <p className="text-gray-300">Instagram Story: “One-day sale—shirts $10, usually $12!” Add a timer.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Food</h3>
              <p className="text-gray-300">Message 10 friends: “Free snack sample, $2 shipping—want one?”</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Decor</h3>
              <p className="text-gray-300">Pinterest: Post 5 pics—“Cozy room ideas, buy here!”</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">Toys</h3>
              <p className="text-gray-300">X post: “Pre-order my new toy—$5 now, $6 later!”</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Get the <span className="text-yellow-300">DTC Playbook</span>
          </h2>
          <p className="text-gray-100 mb-6">
            All these steps in one easy file—take it with you, follow it, and sell! Click to download now.
          </p>
          <a
            href={playbookUrl}
            download="DTC-First-Customer-Playbook.pdf"
            className="inline-flex items-center px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Download It
            <Download className="ml-2 h-5 w-5" />
          </a>
          <p className="text-gray-200 mt-4">
            Want more help? <Link to="/tools" className="text-yellow-300 underline hover:text-yellow-200">Check our free tools</Link>—they make selling easier.
          </p>
        </section>
      </div>
    </div>
  );
}