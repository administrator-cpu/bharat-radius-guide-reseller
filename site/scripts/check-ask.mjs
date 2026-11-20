// Checks the Ask box against real-sounding questions. Run: npm run check:ask (Node 22.18+).
// A case passes when the expected topic is the top answer ("top") or among the answers shown ("any").
import { buildIndex, ask } from '../lib/ask/engine.ts';
import { lexicon } from '../lib/ask/lexicon.ts';
import { toDocs } from '../lib/ask/docs.ts';
import { reseller } from '../content/reseller.ts';
import { customer } from '../content/customer.ts';

const ix = buildIndex([...toDocs('reseller', reseller), ...toDocs('customer', customer)], lexicon);

// [audience, question, expected topic id, 'top' | 'any']   (expected null = should say "not found")
const CASES = [
  ['reseller', 'how do I recharge a customer', 'recharge', 'top'],
  ['reseller', 'customer ka recharge kaise kare', 'recharge', 'top'],
  ['reseller', 'richarge kaise karu', 'recharge', 'top'],
  ['reseller', 'ग्राहक का रिचार्ज कैसे करें', 'recharge', 'top'],
  ['reseller', 'insufficient wallet balance', 'request-topup', 'any'],
  ['reseller', 'naya customer kaise jode', 'add-customer', 'top'],
  ['reseller', 'add new connection', 'add-customer', 'top'],
  ['reseller', 'create pppoe user', 'add-customer', 'top'],
  ['reseller', 'customer dhundna hai', 'find-customer', 'top'],
  ['reseller', 'search by phone number', 'find-customer', 'top'],
  ['reseller', 'kis kis ka expire ho raha hai', 'expiring', 'top'],
  ['reseller', 'customers expiring this week', 'expiring', 'top'],
  ['reseller', 'block a customer', 'suspend', 'top'],
  ['reseller', 'customer ko band karna hai payment nahi diya', 'suspend', 'top'],
  ['reseller', 'unblock customer', 'suspend', 'top'],
  ['reseller', 'customer ka net nahi chal raha', 'online-now', 'top'],
  ['reseller', 'connected but no internet', 'online-now', 'top'],
  ['reseller', 'who is online', 'online-now', 'top'],
  ['reseller', 'kick user', 'online-now', 'top'],
  ['reseller', 'aadhar upload', 'kyc', 'top'],
  ['reseller', 'mera balance kitna hai', 'wallet', 'top'],
  ['reseller', 'wallet balance', 'wallet', 'any'],
  ['reseller', 'paisa kaha gaya', 'ledger', 'any'],
  ['reseller', 'paise kat gaye but recharge nahi hua', 'ledger', 'top'],
  ['reseller', 'wallet statement download', 'ledger', 'top'],
  ['reseller', 'balance khatam ho gaya top up kaise mange', 'request-topup', 'top'],
  ['reseller', 'request topup', 'request-topup', 'top'],
  ['reseller', 'sub reseller ko paisa bhejna hai', 'send-money', 'top'],
  ['reseller', 'transfer money to retailer', 'send-money', 'top'],
  ['reseller', 'approve topup request', 'approve-topup', 'top'],
  ['reseller', 'naya reseller banana hai', 'add-sub-reseller', 'top'],
  ['reseller', 'add sub reseller', 'add-sub-reseller', 'top'],
  ['reseller', 'set margin for retailer', 'set-prices', 'top'],
  ['reseller', 'reseller ka rate kaise set kare', 'set-prices', 'top'],
  ['reseller', 'apna logo lagana hai', 'branding', 'top'],
  ['reseller', 'complaint register', 'new-ticket', 'top'],
  ['reseller', 'reply to ticket', 'reply-ticket', 'top'],
  ['reseller', 'monthly sales report', 'reports', 'top'],
  ['reseller', 'gst report excel', 'reports', 'top'],
  ['reseller', 'staff ke liye login', 'staff', 'top'],
  ['reseller', 'add employee', 'staff', 'top'],
  ['reseller', 'password change', 'my-account', 'top'],
  ['reseller', 'password bhool gaya', 'sign-in', 'top'],
  ['reseller', 'otp enable', 'my-account', 'top'],
  ['reseller', 'dashbord', 'dashboard', 'top'],
  ['customer', 'recharge kaise kare', 'portal-recharge', 'top'],
  ['customer', 'how to pay online', 'portal-recharge', 'top'],
  ['customer', 'upi se payment', 'portal-recharge', 'any'],
  ['customer', 'net nahi chal raha', 'portal-report-problem', 'top'],
  ['customer', 'internet not working', 'portal-report-problem', 'top'],
  ['customer', 'router red light', 'portal-report-problem', 'top'],
  ['customer', 'net bahut slow hai', 'portal-report-problem', 'top'],
  ['customer', 'इंटरनेट नहीं चल रहा', 'portal-report-problem', 'top'],
  ['customer', 'plan kab tak hai', 'portal-home', 'top'],
  ['customer', 'kitne din bache', 'portal-home', 'top'],
  ['customer', 'plan expired', 'pay-page', 'any'],
  ['customer', 'upgrade plan', 'portal-change-plan', 'top'],
  ['customer', 'speed badhani hai', 'portal-change-plan', 'any'],
  ['customer', 'plan badalna hai', 'portal-change-plan', 'top'],
  ['customer', 'kitna data use hua', 'portal-usage', 'top'],
  ['customer', 'bill download', 'portal-bills', 'top'],
  ['customer', 'rasid chahiye', 'portal-bills', 'top'],
  ['customer', 'paise kat gaye do baar', 'portal-bills', 'any'],
  ['customer', 'complaint ka jawab', 'portal-ticket-reply', 'top'],
  ['customer', 'complaint close kaise kare', 'portal-ticket-reply', 'top'],
  ['customer', 'password change', 'portal-password', 'top'],
  ['customer', 'password bhul gaya', 'portal-sign-in', 'top'],
  ['customer', 'login nahi ho raha', 'portal-sign-in', 'top'],
  ['customer', 'aadhaar upload', 'portal-kyc', 'top'],
  ['reseller', 'customer ki validity badhani hai', 'recharge', 'top'],
  ['reseller', 'how to give my helper access', 'staff', 'top'],
  ['reseller', 'where do i see todays collection', 'reports', 'top'],
  ['reseller', 'retailer ka wallet low hai', 'send-money', 'any'],
  ['reseller', 'customer ka plan change karna hai', 'recharge', 'top'],
  ['reseller', 'how much profit per recharge', 'set-prices', 'top'],
  ['reseller', 'customer ki id proof', 'kyc', 'top'],
  ['reseller', 'login locked', 'sign-in', 'top'],
  ['customer', 'wifi band hai', 'portal-report-problem', 'top'],
  ['customer', 'mujhe faster internet chahiye', 'portal-change-plan', 'top'],
  ['customer', 'payment fail ho gaya', 'portal-recharge', 'top'],
  ['customer', 'meri complaint ka kya hua', 'portal-ticket-reply', 'top'],
  ['customer', 'gst bill chahiye office ke liye', 'portal-bills', 'top'],
  ['customer', 'ghar shift kar raha hu', 'portal-report-problem', 'top'],
  ['customer', 'मेरा प्लान कब खत्म होगा', 'portal-home', 'top'],
  ['customer', 'what is the weather today', null, 'top'],
  ['reseller', 'cricket score', null, 'top'],
];

let fail = 0;
for (const [aud, q, want, mode] of CASES) {
  const r = ask(ix, q, aud);
  const ids = r.matches.map((m) => m.doc.id);
  const ok = want === null ? !r.confident : mode === 'top' ? ids[0] === want : ids.includes(want);
  if (!ok) fail++;
  const shown = r.matches.map((m) => `${m.doc.id}(${m.score.toFixed(1)})`).join(' ') || '— not found';
  console.log(`${ok ? 'ok  ' : 'FAIL'} [${aud}] ${q.padEnd(44)} → ${shown}${ok ? '' : `   want ${want ?? 'not found'}`}`);
}
console.log(`\n${CASES.length - fail}/${CASES.length} passed`);
process.exit(fail ? 1 : 0);
