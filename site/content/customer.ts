import type { Section } from './types';

export const customer: Section[] = [
  {
    id: 'connection',
    title: 'Your connection',
    topics: [
      {
        id: 'portal-sign-in',
        title: 'Log in to your account',
        marks: ['Username or customer number', 'Password', 'Log in'],
        short: 'Type your username or customer number and your internet password, then tap Log in.',
        mid: 'Open the link your provider sent you. Type your username or customer number (like C010252) from your welcome SMS. The password is the same one your router uses, unless you set a separate website password. Tap Log in.',
        detailed: `Your provider’s customer website lets you check your plan, recharge, see your data use and report problems. It works in any phone browser; nothing to install.

1. Username or customer number. Both are on your welcome SMS. The customer number looks like C010252.
2. Password. At first this is your internet (PPPoE) password, the same one saved in your Wi-Fi router. If you later set a separate website password, use that one instead. Tap Show to check what you typed.
3. Tap Log in.

You stay logged in on that phone, so you won’t need to type this every time.

After 5 wrong passwords the account is locked for 15 minutes. This protects you from someone guessing.

Forgot your password or lost the SMS? Call your provider. Their number is shown at the top of the website once you log in, and on your bills. They can reset your website password; after that you log in with your internet password again.`,
      },
      {
        id: 'portal-home',
        title: 'Check your plan and days left',
        marks: ['Plan status', 'Days left', 'Valid until'],
        short: 'The home screen shows your plan, how many days are left, and the exact end date.',
        mid: 'Right after you log in you see your plan name and speed. The coloured tag tells you the status: Active, Expires in a few days, Expired or Suspended. The circle counts the days left, and Valid until shows the last day your internet works.',
        detailed: `The home screen answers the most common question: “Is my internet paid, and until when?”

1. Plan status. The small coloured tag under your plan name shows where you stand:
   Active: everything is fine.
   Expires in 2 days (yellow): recharge soon to avoid a break.
   Expired (red): your validity is over; recharge to get full speed back.
   Suspended: your provider has paused the connection. Call them.
2. Days left. The circle fills down as days pass, so you can see at a glance how much is left.
3. Valid until. Your internet works until the end of this day.

Under the plan you’ll see your speed and whether your data is unlimited.

Lower on the screen are two small boxes: Amount due (any unpaid bill) and Data used since your plan started. Below them, “Internet not working? Report a problem” takes you straight to Help.

Tip: you’ll also usually get an SMS a few days before expiry, but checking here takes two seconds.`,
      },
      {
        id: 'portal-recharge',
        title: 'Recharge your plan',
        marks: ['Recharge button', 'Anything still due'],
        short: 'Tap the orange Recharge button and pay with UPI, card or net banking. Days are added instantly.',
        mid: 'On the home screen tap Recharge. The amount already includes GST. A secure payment page opens; pay with any UPI app, card or net banking. As soon as the payment goes through, 30 days are added to your plan and your bill appears under Bills.',
        detailed: `You can renew your plan yourself, any time, without calling anyone.

1. Recharge button. Tap Recharge ₹… on the home screen. The amount shown is the full price including GST; there are no extra charges. A secure payment page opens: choose UPI (Google Pay, PhonePe, Paytm and others), a debit or credit card, or net banking, and complete the payment.
2. Anything still due. If the Amount due box shows a number, you have an unpaid bill. A Pay button appears for it on the same screen.

What happens next: when the payment is confirmed, your validity is extended straight away. If you still had days left, the new period starts after them, so you don’t lose any days by recharging early. If your plan had already expired, full speed comes back within about a minute.

Your bill and receipt appear under Bills.

Payment page closed before you finished? Just tap Recharge again. If money left your account but no days were added, report it from Help with the category Billing.

If the button is missing and you see “Online payment is not available yet”, your provider takes payments in person. Pay them directly and they’ll recharge you.`,
      },
      {
        id: 'portal-change-plan',
        title: 'Switch to a different plan',
        marks: ['Your current plan', 'Choose a new plan'],
        short: 'Scroll down to Change plan on the home screen and tap Choose on the plan you want.',
        mid: 'Scroll down the home screen to Change plan. Your current plan has a dark border and a “Your plan” tag. Every other plan shows its speed, days and full price with GST. Tap Choose on the one you want; you’ll confirm and pay on the next step.',
        detailed: `Need more speed for work, studies or a new TV? You can upgrade (or move to a cheaper plan) yourself.

1. Scroll down the home screen to Change plan. Your current plan is the one with the dark border and the “Your plan” tag.
2. Compare the others. Each card shows the speed in big letters, the plan name, how many days it lasts, and the full price including GST.
3. Tap Choose on the plan you want.

A confirmation box opens next, showing exactly what you’ll pay and what changes. Nothing is charged until you confirm and pay there.

Not sure which speed you need? Rough guide: 30 Mbps is fine for browsing, WhatsApp and one video stream; 50 to 100 Mbps suits a family streaming on several phones and a TV; 200 Mbps is for heavy downloads and many devices at once.

If you don’t see Change plan at all, your provider hasn’t set up other plans for you. Ask them from Help.`,
      },
      {
        id: 'portal-change-plan-confirm',
        title: 'Confirm and pay for the new plan',
        marks: ['What you pay and what changes', 'Pay and switch'],
        short: 'Check the price and new speed in the box, then tap Pay and switch to pay.',
        mid: 'After you tap Choose, a box tells you the price and what changes: your connection moves to the new speed and 30 days are added to your validity. Tap Pay and switch, finish the payment, and the new speed starts as soon as payment completes.',
        detailed: `This is the last step before your plan changes. Read the box carefully.

1. What you pay and what changes. It shows the full price including GST, the new speed, and how many days will be added to your validity.
2. Tap Pay and switch. The same secure payment page as a recharge opens: pay with UPI, card or net banking.

As soon as the payment completes, your connection moves to the new speed and the new days are added. Your router reconnects by itself; if the speed doesn’t change within a few minutes, turn the router off and on once.

Changed your mind? Tap Cancel or the ×. Nothing is charged.

The bill for the new plan appears under Bills, like any recharge.

Tip: if you want to try a faster plan for one month only, switch now and choose your old plan again at the next recharge.`,
      },
      {
        id: 'pay-page',
        title: 'Internet stopped? Pay from the expired page',
        marks: ['Your details', 'Pay'],
        short: 'When your plan expires, any website opens this page. Check your details and tap Pay.',
        mid: 'If your plan expires, your provider may keep you connected at low speed and show this page whenever you open a website. Check that the name and customer number are yours, tap Pay, and complete the payment. Full speed returns within a minute.',
        detailed: `Many providers don’t cut you off completely when your plan ends. Instead, you get very slow internet, and any website you open shows this page. You don’t need to log in; it already knows which connection you are.

1. Your details. Check the name (partly hidden for privacy), customer number, when it expired and your plan. If this isn’t you (for example on a shared Wi-Fi), tap “Not you?” and type your username, customer number or mobile.
2. Tap Pay. The amount includes GST. Pay with UPI, card or net banking.

Full speed comes back within about a minute of payment. If websites still don’t open, turn your router or phone Wi-Fi off and on once.

This page only renews your current plan. To change plans or download bills, log in to your account instead.

Tip: the message at the bottom is repeated in Hindi for family members who prefer it.`,
      },
    ],
  },
  {
    id: 'usage-bills',
    title: 'Usage & bills',
    topics: [
      {
        id: 'portal-usage',
        title: 'See how much data you use',
        marks: ['Total downloaded', 'This cycle', 'Day by day'],
        short: 'Usage shows your data for the last 31 days, this plan period, and each single day.',
        mid: 'Tap Usage in the bottom bar. The top boxes show how much you downloaded and uploaded in the last 31 days. Data this cycle shows use since your plan started, with your limit if you have one. The chart shows each day, so you can spot heavy days.',
        detailed: `Usage helps you understand where your data goes, and whether your plan still fits.

1. Downloaded and Uploaded. Totals for the last 31 days. Downloading is what you watch and browse; uploading is what you send, like video calls and photo backups.
2. Data this cycle. Use since your current plan started. If your plan has a data limit (FUP), a bar shows how close you are; after the limit your speed drops until the next recharge. Unlimited plans show the total only.
3. Daily usage. One bar per day: blue is download, orange is upload. Tall bars usually mean streaming, big downloads or phone backups.

Further down is a list of your recent connections: when your router connected and disconnected, and how much it used each time.

Speed feels slow but usage looks normal? It may be a network issue rather than your data. Report it from Help so your provider can check.

Tip: if every day looks heavy and you are on a capped plan, consider switching to an unlimited one from Change plan on the home screen.`,
      },
      {
        id: 'portal-bills',
        title: 'Download your bills and receipts',
        marks: ['A bill', 'Download PDF'],
        short: 'Bills lists every invoice and payment. Tap PDF to download a bill.',
        mid: 'Tap Bills in the bottom bar. Each invoice shows its number, date, amount and status (Paid or Due). Tap PDF to download it, for example for office reimbursement. Scroll down to Payments to see every payment you made and how you paid.',
        detailed: `Every recharge creates a proper GST invoice. You can download them any time.

1. A bill. Each one shows the invoice number, the date, the amount including GST, and its status: Paid, Due, or Overdue.
2. Tap PDF to download the invoice. It opens in your phone’s PDF viewer, where you can save or share it, for example to send to your office for reimbursement.

Scroll down to Payments. Every payment you made is listed with the date, amount and status. Online payments show the gateway reference; cash paid to your provider shows too, once they record it.

If a bill is Due, a Pay button appears on the home screen. Paying it there settles the bill immediately.

Something looks wrong, like a double charge? Report it from Help with the category Billing, and mention the invoice number. Your provider can issue a refund or credit note if needed.`,
      },
    ],
  },
  {
    id: 'help',
    title: 'Help & account',
    topics: [
      {
        id: 'portal-report-problem',
        title: 'Report a problem',
        marks: ['What it is about', 'Short title', 'What happened', 'Send'],
        short: 'Go to Help, tap Report a problem, choose a type, describe it and tap Send.',
        mid: 'Tap Help, then Report a problem. Pick what it’s about (no internet, slow speed, billing, plan change, shifting). Give it a short title and describe what happened: router lights, since when, which devices. Tap Send. Your provider replies right here.',
        detailed: `Instead of calling and waiting, report the problem here. It reaches your provider straight away and you can follow every reply.

1. What is it about? Choose the closest one: No internet, Slow speed, Billing, Plan change, Shifting, or Other. This sends it to the right person.
2. Subject. A short title, like “Speed drops after 9 pm”.
3. Details. The more specific, the faster it gets fixed. Useful things to mention:
   Router lights: is any light red or blinking?
   Since when: “since last night”, “every evening”.
   Which devices: only Wi-Fi, or also with a cable?
4. Tap Send.

Your report appears under My tickets with a number and status: Open, In progress, Waiting for customer, Resolved.

Tip: before reporting “no internet”, turn the router off for 30 seconds and on again. It fixes many problems on its own.`,
      },
      {
        id: 'portal-ticket-reply',
        title: 'Reply to your provider and close a ticket',
        marks: ['Their reply', 'Write your answer', 'Send', 'Close when fixed'],
        short: 'Open your ticket, read the reply, answer if needed, and close it once fixed.',
        mid: 'Open the ticket from Help → My tickets. Replies from your provider appear in the conversation. If the status says Waiting for customer, they need something from you; type your answer and tap Send. When everything works again, tap “My problem is solved — close ticket”.',
        detailed: `Each ticket is a conversation between you and your provider.

1. Their reply. Messages from your provider appear on the left with their name. Yours appear on the right.
2. Write your answer. If the status at the top says Waiting for customer, they asked you to do or check something, like restarting the router. Tell them what happened.
3. Tap Send.
4. Close when fixed. Once your internet works properly again, tap “My problem is solved — close ticket”. This tells your provider they can stop working on it.

Statuses explained:
   Open: received, not handled yet.
   In progress: someone is working on it.
   Waiting for customer: they need your reply.
   Resolved: they think it’s fixed.

You can see all your tickets, old and new, under Help → My tickets.

Tip: reply in the same ticket instead of opening a new one for the same problem. The whole history stays together, which helps them fix it faster.`,
      },
      {
        id: 'portal-password',
        title: 'Set your own website password',
        marks: ['Your internet password', 'New password', 'Type it again', 'Save'],
        short: 'In Account, set a separate password for this website. Your router keeps working as before.',
        mid: 'Tap your initials at the top and go to Account. Under Set a portal password, type your current internet (PPPoE) password, then a new website password of at least 8 characters, twice. Tap Save password. From now on use the new one to log in here; your router is not affected.',
        detailed: `At first you log in with your internet (PPPoE) password, the one inside your router. Setting a separate website password is safer: you can share Wi-Fi details with family without them getting into your account.

Open Account (tap your initials in the top corner) and scroll to Set a portal password.

1. Your internet (PPPoE) password. Proves it’s really you.
2. New password. At least 8 characters. A short sentence you’ll remember works well.
3. Type the new password again.
4. Tap Save password.

From now on, only the new password works on this website. Your router keeps using the old internet password, so your connection is not affected at all.

Forgot the new password? Ask your provider to reset your website password. They’ll sign you out everywhere, and you can log in with your internet password again.

On the same Account page you can see your details. To change your name, phone or address, contact your provider; the page shows their number.`,
      },
      {
        id: 'portal-kyc',
        title: 'Upload a missing ID document',
        marks: ['What is missing', 'Document type', 'Upload'],
        short: 'In Account → KYC documents, see what’s missing, pick the type, attach a photo and Upload.',
        mid: 'Every connection needs ID proof by government rules. In Account, KYC documents shows what your provider already has and what is still needed. Choose the document type, enter the last digits of its number, pick a clear photo or PDF up to 5 MB, and tap Upload.',
        detailed: `Government rules require every internet connection to have ID proof on file. If something is missing, you can upload it from your phone instead of visiting the shop.

Open Account and find KYC documents. The tag shows the status: pending (being checked), verified (all done) or rejected (upload again).

1. What is missing. The line “Still needed: …” tells you exactly which document your provider needs, for example a photo.
2. Document type. Pick it from the list: Aadhaar, PAN, Voter ID, Passport, Driving licence, Photo, Address proof and so on. If there is a Number field, the last 4 digits are enough; only a masked number is stored.
3. Choose the file and tap Upload. JPEG, PNG, WebP or PDF, up to 5 MB.

Tips for a good photo: lay the card flat in good light, fill the frame, and make sure all text is readable and nothing is cut off.

Your provider checks the document. When it’s accepted, the tag changes to verified.

Your files are stored encrypted and are only seen by your provider’s authorised staff.`,
      },
    ],
  },
];
