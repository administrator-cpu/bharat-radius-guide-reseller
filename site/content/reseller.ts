import type { Section } from './types';

export const reseller: Section[] = [
  {
    id: 'start',
    title: 'Getting started',
    topics: [
      {
        id: 'sign-in',
        title: 'Sign in to your panel',
        marks: ['Your phone or email', 'Your password', 'Sign in'],
        short: 'Type your phone number or email, then your password, and press Sign in.',
        mid: 'Open your ISP’s panel link and type the phone number or email your ISP registered for you. Enter your password and press Sign in. After 5 wrong tries the account locks for 15 minutes, so check Caps Lock first.',
        detailed: `Your ISP gives you a panel link (for example new.bharatradius.com) and creates your login. You don’t need to install anything; it works in any browser on your phone or computer.

1. Type the phone number or email your ISP used when creating your account.
2. Type your password. Tap Show if you want to check what you typed.
3. Press Sign in. You land on your dashboard.

If you see “Sign in to a different organisation”, you are on a shared link. Pick your ISP there first.

After 5 wrong passwords in a row the account is locked for 15 minutes. This protects your wallet from someone guessing. Wait, then try again, or ask your ISP to unlock you.

Forgot your password? Ask the person who created your account (your ISP or the reseller above you). They can set a new one for you, and you can change it later from My account.

Tip: on a shared computer, use the menu at the bottom of the sidebar to sign out when you finish.`,
      },
      {
        id: 'dashboard',
        title: 'Your dashboard at a glance',
        marks: ['Wallet balance', 'Renewals due', 'Add a customer'],
        short: 'See your wallet balance, who needs renewing, and quick shortcuts the moment you sign in.',
        mid: 'The dashboard is your home screen. The big number is your wallet balance. Renewals shows how many customers expire today, tomorrow and this week, with the money they will bring in. Tap any card to jump straight to that list.',
        detailed: `The dashboard is the first thing you see after signing in. It answers three questions: how much money do I have, who needs a recharge, and what do I do next.

1. Wallet balance. This is the money you can spend on recharges. The chart shows how it moved over the last month. The dashed orange line is your low-balance alert; when the balance drops below it, top up soon. Wallet ledger opens every entry.
2. Renewals. Four cards count customers expiring today, tomorrow, in the next 7 days, and those already expired this month. The red number underneath is the money waiting to be collected. Tap View on any card to open that exact list and recharge from there.
3. Add a customer. The shortcut on the right opens the new-connection form. My customers and Tickets sit just below it.

Further down you’ll see all your subscribers split by status (active, expired, suspended, disabled) and a count of your sub-resellers, including any with low wallets.

Tip: press Customise at the top right to hide cards you don’t use. Your choice is saved for your login only.`,
      },
      {
        id: 'my-account',
        title: 'Change your password and turn on 2-step sign-in',
        marks: ['Current password', 'Turn on 2-step sign-in'],
        short: 'Open My account to change your password or add a phone code to every sign-in.',
        mid: 'Click your name at the bottom of the sidebar and choose My account. Type your current password, then a new one of at least 10 characters. For extra safety, turn on two-factor sign-in: an authenticator app on your phone gives a fresh code each time.',
        detailed: `My account holds your own login details. Open it from your name at the bottom of the sidebar.

1. Change your password. Type the current password, then the new one twice. It must be at least 10 characters; a short sentence like “mera net sabse tez” is easy to remember and hard to guess. Press Change password.
2. Two-factor sign-in. Press Turn on and scan the QR code with an authenticator app (Google Authenticator, Microsoft Authenticator or similar). From then on, every sign-in asks for the 6-digit code from your phone as well as your password.

Why bother? Your login controls a wallet with real money. If someone learns your password, two-factor sign-in still stops them.

The same page shows your branding (name and logo your customers see) and a Sign out everywhere button. Use that if you lost a phone or think someone else used your login: every device is signed out at once.

Changing the password also signs you out of other devices.`,
      },
    ],
  },
  {
    id: 'customers',
    title: 'Customers',
    topics: [
      {
        id: 'find-customer',
        title: 'Find a customer',
        marks: ['Search box', 'Filter by status', 'Open the customer'],
        short: 'Type a name, customer number, username or phone in the search box on Subscribers.',
        mid: 'Go to Subscribers and start typing in the search box: name, C-number, PPPoE username or phone all work. Results update as you type. Use the chips above (Active, Expired, Suspended) to narrow the list, then click a row to open the customer.',
        detailed: `Subscribers is your full customer list. You only see your own customers and those of your sub-resellers.

1. Type in the search box. Any of these work: part of the name (“priya”), the customer number (C010252), the PPPoE username, or the phone number. The list filters as you type, no Enter needed.
2. Use the chips to narrow down. Expired shows everyone whose validity is over; Suspended shows those you blocked. The Plan and Expiry boxes next to the search filter further, for example “everyone on 50 Mbps expiring this week”.
3. Click the row to open the customer. From there you can recharge, kick, suspend, edit details or check usage.

Reading the list: dates in orange are expiring within a few days; red means already expired. The grey code (R-0012, R-0031) tells you which reseller the customer belongs to.

Tip: press Clear next to the filters to start over.`,
      },
      {
        id: 'add-customer',
        title: 'Add a new customer',
        marks: ['PPPoE username', 'Who the customer belongs to', 'Plan', 'Valid until'],
        short: 'Open Subscribers, press New subscriber, fill in username, plan and customer details, then save.',
        mid: 'Press New subscriber. Choose the PPPoE username the customer’s router will dial with; leave the password empty and one is generated. Pick the plan and when it’s valid until. Add name, mobile and address below, then save. The login works on the router within seconds.',
        detailed: `Every new connection starts here: Subscribers → New subscriber (or Add a customer on the dashboard).

1. PPPoE username. This is what the customer’s router dials with, so keep it simple and unique, like ravi.benta. Leave PPPoE password empty and the panel generates a strong one.
2. Reseller. Empty means the customer is yours. If you have sub-resellers, type to pick one and the customer goes under them instead.
3. Plan. Pick the speed and price. Only plans you are allowed to sell appear.
4. Valid until. The connection works until the end of this day (Indian time). After that the customer is cut off or sent to the pay page, depending on your ISP’s setting.

Further down, fill in the Customer section: name, mobile, address. The mobile is used for expiry SMS and for the customer portal, so get it right.

Optional fields: Static IP (only if you sold one), Lock to MAC (logins from other devices are refused), and Simultaneous logins (leave empty to use the plan’s default).

Press Save. The account reaches the RADIUS server within seconds, so the customer can connect straight away. Note that saving does not take money from your wallet; the recharge does.`,
      },
      {
        id: 'recharge',
        title: 'Recharge a customer',
        marks: ['Choose the plan', 'What it costs you', 'Recharge'],
        short: 'Open the customer, press Recharge, check the plan and price, then confirm. Your wallet pays.',
        mid: 'Open the customer and press Recharge. Pick the plan and number of periods. The box shows what leaves your wallet and your current balance. Customer pays is the amount to collect, including GST. Press Recharge and the new validity starts straight away.',
        detailed: `Recharging adds validity to a prepaid customer. The money comes out of your wallet, so check your balance first.

1. Choose the plan. It starts on the customer’s current plan. Pick another one to change their speed at the same time. Periods lets you sell 2 or 3 months together.
2. Check the money. From your wallet is what this recharge takes from you. Wallet balance is what you have now. Starts shows when the new period begins: if the customer still has days left, the new period starts after them, so nothing is lost.
3. Press Recharge.

Customer pays is your selling price including GST, the amount you should collect. Valid until shows the new end date. If your role allows price changes, you can edit both before confirming (for example for a discount or a custom date).

What happens next: the customer is renewed immediately. If they were cut off or on slow speed, the router reconnects them at full speed within a few seconds. An invoice is created automatically.

If you see “Insufficient Wallet Balance”, request a top-up first (see Wallet & money). Made a mistake? Ask your ISP to reverse the recharge; the money returns to your wallet.`,
      },
      {
        id: 'expiring',
        title: 'Renew customers before they expire',
        marks: ['Pick a time window', 'When it expires', 'Recharge in one click'],
        short: 'Expiring soon lists customers running out, with a one-click Recharge button on each row.',
        mid: 'Open Subscribers → Expiring soon, or tap a Renewals card on the dashboard. Choose a window: today and tomorrow, 7, 15 or 30 days. Each row shows the plan, expiry date and a Recharge button with the price, so you can renew without opening every customer.',
        detailed: `Customers who expire without a recharge lose their internet and often call you angry. This screen helps you get there first.

1. Pick a time window. Today and tomorrow is your urgent list. 7 days is good for a weekly round of calls.
2. Read the Expires column. Red “Today” and “Tomorrow” need action now; “In 3 days” gives you time to call.
3. Press Recharge ₹… on the row. The same recharge box opens with the plan already chosen, and the price shown is what the customer pays.

The list is sorted by expiry, soonest first, and shows the phone number under each name, so you can call down the list.

A good routine: every morning open Today and tomorrow, call or WhatsApp each customer, and recharge those who pay. Your ISP may also send automatic SMS reminders before expiry.

Tip: on the dashboard, the red amount under each Renewals card is the money waiting in that list.`,
      },
      {
        id: 'suspend',
        title: 'Suspend or reactivate a customer',
        marks: ['Reason (optional)', 'Suspend'],
        short: 'Suspend cuts the customer off and blocks logins. Activate brings them back.',
        mid: 'Open the customer and press Suspend. Add a short reason like “payment pending”; it shows in the login log so staff know why. The customer is disconnected at once. To bring them back, open the same customer and press Activate. Their validity date is unchanged.',
        detailed: `Suspending is for when you need to stop a connection now, for example unpaid dues, misuse, or the customer asked to pause.

1. Type a reason. It’s optional, but it helps: anyone checking why the customer can’t connect will see it in the login log.
2. Press Suspend.

What happens: the customer is disconnected immediately and their router can’t log in again. Their plan and valid-until date stay as they are.

To undo it, open the customer again. The Suspend button now reads Activate. Press it and the customer can connect again straight away.

Suspend vs. letting it expire: expiry happens on its own when validity runs out, and a recharge fixes it. A suspension stays until someone activates the customer, even if they recharge. Use it on purpose, not as a reminder.

Tip: the Suspended chip on the Subscribers list shows everyone you have blocked, so you don’t forget anyone.`,
      },
      {
        id: 'online-now',
        title: 'See who is online and disconnect a session',
        marks: ['Search a username, IP or MAC', 'Filter by router', 'Kick'],
        short: 'Online now lists every connected customer. Kick drops one so their router reconnects.',
        mid: 'Open Online now to see who is connected, on which router, for how long and how much data they used. Search by username, IP or MAC. Press Kick to drop a stuck session; the customer’s router dials again by itself, which often fixes “connected but no internet”.',
        detailed: `Online now is a live list of your connected customers. It refreshes every 30 seconds.

1. Search. Type the start of a username, IP address or MAC address to find one customer fast.
2. Filter by router. If you have more than one router (POP), pick one to see only its customers. The number in brackets is how many are online there.
3. Kick. This drops the connection. The customer’s router dials in again automatically, usually within seconds.

When to kick: the customer says “Wi-Fi connected but no internet”, a speed change didn’t apply, or a session looks stuck. A fresh login fixes most of these.

Reading the columns: Online for shows how long the current session has lasted. Down / Up shows data used in this session. If a customer isn’t in the list at all, they are not connected; check their status (expired? suspended?) and the router lights.

Who had an IP (the second tab) tells you which customer used a given IP at a certain time, which is useful for complaints and police requests.`,
      },
      {
        id: 'kyc',
        title: 'Upload KYC documents',
        marks: ['KYC tab', 'Upload'],
        short: 'Open the customer’s KYC tab, choose the document type, attach the file and press Upload.',
        mid: 'Every connection needs ID proof by law. Open the customer and go to the KYC tab. It lists what’s still missing. Choose the document type (Aadhaar, photo, signed CAF), type the last 4 digits, attach a photo or PDF up to 5 MB, and press Upload. Your ISP verifies it.',
        detailed: `Indian telecom rules require ID proof and a signed Customer Application Form (CAF) for every connection. The KYC tab keeps these with the customer.

1. Open the KYC tab on the customer. The yellow line tells you what’s missing, for example “aadhaar, photo, caf_signed”.
2. Choose the document type, type the number (only the last 4 digits are needed and only those are stored), pick the file and press Upload.

Accepted files: JPEG, PNG, WebP or PDF, up to 5 MB. A clear phone photo is fine.

The CAF: press Create CAF form to get a ready-filled form. Print it, have the customer sign it, then photograph it and upload it as Signed CAF.

After upload, the status stays “pending” until your ISP checks and verifies the documents. You can upload but not verify; that’s on purpose, so a second person checks every ID.

Privacy: files are stored encrypted, and every time someone opens one it is recorded. Never send KYC photos over WhatsApp groups; upload them here instead.`,
      },
    ],
  },
  {
    id: 'money',
    title: 'Wallet & money',
    topics: [
      {
        id: 'wallet',
        title: 'Check your wallet balance',
        marks: ['Your balance', 'Spent on recharges', 'Full history'],
        short: 'Wallets shows your balance, what you received, spent and sent to sub-resellers.',
        mid: 'Open Wallets. Balance is what you can spend now. Received is everything the level above sent you. Used for recharges and Sent to sub-resellers show where it went. Below are pending top-up requests and your sub-resellers’ balances. My ledger opens every single entry.',
        detailed: `Your wallet is prepaid money that pays for customer recharges. It never goes negative: if it’s empty, recharges stop until you top up.

1. Balance. What you can spend right now. The green “Normal” tag turns orange (Low) when you’re under your alert level, and red when empty.
2. The other cards. Received is the total money the level above has given you. Used for recharges is what your customer recharges cost you. Sent to sub-resellers is what you passed down to the people under you.
3. My ledger. Opens the full history, one line per entry.

Lower on the page you’ll find top-up requests (yours, and those waiting for your approval) and a table of each sub-reseller’s balance, with a Send button next to each.

How the money moves: your ISP (or the reseller above you) puts money in your wallet. You spend it on recharges or send part of it to your own sub-resellers. Each level keeps its own balance; a new top-up is added to what’s already there.

Tip: the sidebar always shows your balance at the top, on every page.`,
      },
      {
        id: 'ledger',
        title: 'Read your wallet history',
        marks: ['Every entry with running balance'],
        short: 'The ledger lists every top-up, recharge, transfer and refund with the balance after each.',
        mid: 'Open Wallets → My ledger. Each line shows the date, what happened, the amount in or out, and your balance after it. Filter by credits or debits, type or date. Export statement downloads it, handy for matching with your own accounts.',
        detailed: `The ledger is your bank statement inside the panel. Nothing is ever deleted from it; even a mistake is fixed with a new, opposite entry, so the history always adds up.

Each line shows:
1. Date and time of the entry.
2. Description: which customer was recharged and on which plan, which sub-reseller you sent money to, or which top-up you received (with the UPI or bank reference).
3. Debit (money out, in red) or Credit (money in, in green).
4. Balance: your wallet after that entry.

The cards on top summarise a period: opening balance, total credits, total debits and the balance now. Change the dates to look at a different month.

Filters: All / Credits / Debits, and a type filter (Top-up, Recharge, Allocation, Refund, Adjustment) help when you’re looking for one thing, like every top-up this month.

Export statement downloads the filtered view so you can match it with your own accounts.

Tip: if a customer says “I paid but my recharge didn’t happen”, search the ledger for their C-number. No entry means no recharge was made.`,
      },
      {
        id: 'request-topup',
        title: 'Ask for a wallet top-up',
        marks: ['Amount', 'How you paid', 'Payment reference', 'Send request'],
        short: 'Press Request top-up, enter amount and payment details, and send it to the level above.',
        mid: 'Pay your ISP or upline by UPI, bank or cash first. Then open Wallets → Request top-up. Enter the amount, how you paid and the UTR or reference number, and send it. The money is added to your balance as soon as they approve.',
        detailed: `When your balance runs low, you pay the level above you (your ISP or the reseller who created you) and ask them to load your wallet.

First, pay them the usual way: UPI, bank transfer or cash.

Then on Wallets press Request top-up:
1. Amount in rupees.
2. Paid via: UPI, bank or cash.
3. Reference / UTR: the transaction number from your UPI app or bank. This lets them match your payment quickly. For cash, leave it empty and add a note.
4. Press Request. The button shows the exact amount, so check it before pressing.

The request appears under My top-up requests as “pending”. When they approve it, the amount is added to your existing balance and the request turns green. They may approve a different amount if the payment doesn’t match; you’ll see what was approved.

Changed your mind or typed the wrong amount? Press Withdraw on a pending request and create a new one.

Tip: add a note like “for December renewals” so the person approving knows the context.`,
      },
      {
        id: 'approve-topup',
        title: 'Approve a sub-reseller’s top-up request',
        marks: ['Request from your sub-reseller', 'Approve', 'Reject'],
        short: 'Check the payment arrived, then press Approve to load their wallet, or Reject it.',
        mid: 'When a sub-reseller asks for money, the request appears at the top of Wallets under Top-up requests. Check the amount and reference against your UPI or bank. Press Approve to move the money from your wallet to theirs, or Reject with a reason.',
        detailed: `Your sub-resellers pay you and then ask you to load their wallet. Their requests appear under Top-up requests at the top of the Wallets page, with a “waiting” count.

1. Read the request: who sent it, their current balance, the amount, and how they say they paid (UPI, bank or cash, plus any reference or note).
2. Check your UPI app or bank for the payment, or count the cash.
3. Press Approve. You can change the amount if they paid a different sum.
4. Or press Reject and give a reason, like “payment not received yet”.

Approving moves money from your wallet to theirs, so you need enough balance. Both ledgers record it.

Don’t approve before the money is really in your account. Once approved, they can spend it on recharges straight away.

Tip: the All tab shows past requests too, useful when a sub-reseller says “I already paid you last week”.`,
      },
      {
        id: 'send-money',
        title: 'Send money to a sub-reseller',
        marks: ['Your sub-resellers', 'Send'],
        short: 'In the Sub-resellers table on Wallets, press Send next to a name to move money to them.',
        mid: 'You can load a sub-reseller’s wallet without waiting for a request. Scroll to Sub-resellers on the Wallets page, find them, and press Send. Enter the amount and how they paid you. The money leaves your wallet and is added to theirs immediately.',
        detailed: `Sometimes a sub-reseller pays you in person and you want to load their wallet right away. You don’t need them to send a request first.

1. On Wallets, scroll down to the Sub-resellers table. The Low and Empty tabs show who needs money most.
2. Press Send next to their name.

In the box that opens, enter the amount, how they paid you (cash, UPI or bank) and a reference if there is one, then confirm.

The money leaves your wallet and is added to their existing balance at once. Both of your ledgers show the transfer, so there’s never a dispute later about who sent what.

You can only send what you have. If your own balance is low, request a top-up first.

Tip: the Status column turns “Low balance” when a sub-reseller drops below their alert level. A quick Send before the evening rush keeps their customers renewing.`,
      },
    ],
  },
  {
    id: 'sub-resellers',
    title: 'Sub-resellers',
    topics: [
      {
        id: 'add-sub-reseller',
        title: 'Add a sub-reseller',
        marks: ['Business name', 'Owner’s name', 'Mobile number'],
        short: 'On Resellers, press Add sub-reseller, fill in business name, owner and mobile, then save.',
        mid: 'Open Resellers and press Add sub-reseller. Enter the shop or business name, the owner’s name and mobile. GSTIN and address are optional. Untick “May add its own sub-resellers” if they shouldn’t build their own network. Then create their login and set their prices.',
        detailed: `A sub-reseller is a shop or partner under you who sells connections in their own area. They get their own panel, wallet and customers, and you see everything they do.

On Resellers, press Add sub-reseller:
1. Business name: what their customers know them as, e.g. “Benta Wifi Zone”.
2. Owner: the person responsible.
3. Mobile: used for their login and alerts.

GSTIN is only needed if they are GST-registered. Address helps on invoices.

May add its own sub-resellers: leave it ticked if they can create resellers under themselves; untick it to keep them as a final level.

Press Add reseller. They get a code like R-0038.

Next steps:
- Set their prices (the Prices tab), otherwise they pay the plan’s full price.
- Create their login under Sign-ins.
- Send them some money so they can start recharging.

You can see and manage everything they do. Open panel lets you look at the panel exactly as they see it, useful when they call you for help.`,
      },
      {
        id: 'set-prices',
        title: 'Set prices for a sub-reseller',
        marks: ['Prices tab', 'Price per plan', 'Save'],
        short: 'On the sub-reseller’s Prices tab, set what each plan costs them and what they charge.',
        mid: 'Open the sub-reseller and go to Prices. Wallet price is what their wallet pays per recharge; the difference from your cost is your margin. Customer price is what they charge customers, before GST. Untick May sell to hide a plan from them. Press Save.',
        detailed: `Prices decide how money splits between you and your sub-reseller on every recharge.

1. Open the sub-reseller and press the Prices tab.
2. For each plan you’ll see:
   Wallet price: taken from their wallet each time they recharge a customer on this plan. If this is ₹615 and your own cost is ₹573, you earn ₹42 per recharge.
   Customer price: their default selling price to customers, before GST. The amount with GST is shown underneath.
   May sell: untick to stop them selling that plan.
3. Press Save at the bottom.

Under each plan name you can see the MRP and GST rate as a reference.

The Billing model at the top shows how they pay: “Prepaid top-up” means you load their wallet and each recharge takes the wallet price.

Changes apply to the next recharge; past recharges are not touched. Reset brings back what was saved before you started editing.

Tip: keep the wallet price below the customer price, or your sub-reseller loses money on each sale.`,
      },
      {
        id: 'branding',
        title: 'Show your name and logo to customers',
        marks: ['Your branding', 'Upload a logo'],
        short: 'In My account, set a display name and logo; your panel and customer portal show them.',
        mid: 'Open My account → Branding. Type the display name your customers know you by and press Save name. Upload a logo (PNG, JPEG or WebP, up to 512 KB). It appears in your panel and your customers’ portal instead of the ISP’s name. Your sub-resellers inherit it.',
        detailed: `Your customers know your shop, not the ISP behind it. Branding puts your name and logo on what they see.

1. Open My account (click your name at the bottom of the sidebar). The Branding card is at the top. The preview shows what your panel and customers see right now.
2. Display name: type your business name and press Save name.
3. Logo: choose a PNG, JPEG or WebP file up to 512 KB. Wide logos fit best; a simple logo on a white or transparent background looks cleanest.

Where it shows: in your own panel, in your sub-resellers’ panels, and in the customer portal your customers use to check usage and pay.

Your sub-resellers use your branding unless they set their own. A sub-reseller can override it with their name and logo.

The small “Powered by” line at the bottom always stays.

To change a sub-reseller’s branding for them, open the sub-reseller and use their Branding tab.`,
      },
    ],
  },
  {
    id: 'support',
    title: 'Support, reports & team',
    topics: [
      {
        id: 'new-ticket',
        title: 'Track customer complaints with tickets',
        marks: ['New ticket', 'Filter by status', 'Open a ticket'],
        short: 'Tickets lists every complaint. Press New ticket to log a call, or open one to reply.',
        mid: 'When a customer calls with a problem, log it: press New ticket, pick the customer, the category (no internet, slow speed, billing…) and priority. Customers can also raise tickets from their portal. Use the tabs to see what’s active, unassigned or resolved.',
        detailed: `Tickets keep every complaint in one place so nothing is forgotten when calls pile up.

1. New ticket. Use this when a customer calls or walks in. Pick the customer, choose a category (No internet, Slow speed, Billing, Plan change, Shifting, Other), set the priority and describe the problem.
2. Tabs. Active shows everything still open. Assigned to me and Unassigned help split work in a team. Resolved and Closed keep the history.
3. Open a ticket by clicking its row to read the conversation and reply.

Customers can raise tickets themselves from their portal; those appear here too.

The coloured tag next to the number shows priority: Urgent and High first. The status tells you where it stands: Open (nobody has acted), In progress, Waiting for customer, Resolved.

Search by ticket number or customer number in the search box, or filter by category to see, for example, every slow-speed complaint this week, which often points to one router or area.`,
      },
      {
        id: 'reply-ticket',
        title: 'Reply to a ticket and close it',
        marks: ['Write your reply', 'Send', 'Change status'],
        short: 'Type your reply, press Send, and set the status to Resolved once the problem is fixed.',
        mid: 'Open the ticket. Reply to customer sends a message they see in their portal. Internal note is visible only to staff, good for technical details. Press Send. Update the status on the right as work progresses, and set it to Resolved when the customer is back online.',
        detailed: `A ticket is a conversation between you and the customer, with private notes for your team.

1. Write your reply. With Reply to customer selected, the customer sees it in their portal. Switch to Internal note for things only staff should see, like “fibre cut near Ward 7, technician sent”. Notes show with a yellow “Staff only” label.
2. Press Send.
3. Change status on the right:
   In progress: someone is working on it.
   Waiting for customer: you need them to do or confirm something.
   Resolved: fixed and confirmed with the customer.

You can also change the priority there. The right side shows the customer’s details with Open subscriber, so you can check their status, usage or kick their session without leaving the ticket.

Good replies are short and specific: what you found, what you’re doing, and when it will be fixed. “Technician will reach you by 4 pm” beats “we are looking into it”.

Tip: resolve tickets as soon as the issue is fixed so your Active list stays honest.`,
      },
      {
        id: 'reports',
        title: 'Download reports',
        marks: ['Choose a report', 'Choose the period', 'Download Excel'],
        short: 'Pick a report and date range, then download it as Excel or PDF.',
        mid: 'Open Reports. Choose a report tab: revenue, collections, recharges and expiries, subscribers, reseller sales or tickets. Pick a period like “This month” or set your own dates. The tables update on screen. Excel keeps numbers as numbers for your accounts; PDF is ready to print.',
        detailed: `Reports turn your daily activity into numbers you can share with your accountant or partner.

1. Choose a report:
   Revenue: what you earned, by day and by plan, with GST split out.
   Collections: payments received.
   Recharges and expiries: who renewed and who didn’t.
   Subscribers: growth and status of your customer base.
   Reseller sales: how each sub-reseller is doing.
   Tickets: complaints and how fast they were handled.
2. Choose the period: This month, last month, or pick any start and end date. Days follow Indian time.
3. Download Excel or PDF.

Excel files keep numbers as real numbers, so totals and formulas work. PDF is for printing or sending to someone who just needs to read it.

Reports only include your own branch: your customers and your sub-resellers’. Your ISP sees the full picture.

Tip: run Reseller sales at the end of every month to see which sub-reseller needs help or a push.`,
      },
      {
        id: 'staff',
        title: 'Give your staff their own login',
        marks: ['New staff account', 'Their role'],
        short: 'Staff & roles lets you add logins for your employees, each with limited access.',
        mid: 'Don’t share your password. Open Staff & roles and press New staff account. Enter their name and mobile, and give them the Reseller Staff role. Staff can add and recharge customers and handle tickets, but can’t manage wallets, prices or sub-resellers.',
        detailed: `If someone else in your shop handles customers, give them their own login instead of sharing yours. Every action is then recorded under the right name, and you can switch them off anytime.

1. Press New staff account. Enter their name, mobile (or email) and a starting password.
2. Choose the role:
   Reseller Owner: full access, like you.
   Reseller Staff: day-to-day work: view and add customers, recharge, take cash, upload KYC, see who’s online, handle tickets. They cannot send money, change prices, add sub-resellers or manage other staff.

The list shows each person’s role, status and when they last signed in.

Use the ⋯ menu on a row to reset their password, unlock them after too many wrong tries, or disable them when they leave. Disabling signs them out everywhere at once.

Tip: recharges by staff still come from your wallet. Check Recharges or the ledger now and then to see who did what.`,
      },
    ],
  },
];
