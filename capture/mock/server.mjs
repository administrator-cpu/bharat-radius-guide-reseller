import { createServer } from 'node:http';
import { fake, match, merge, responseSchema, itemSchema, oid, NOW } from './gen.mjs';

const PORT = Number(process.env.MOCK_PORT ?? 4100);
const iso = (ms) => new Date(ms).toISOString();
const day = 864e5;
const at = (d, h = 0) => iso(NOW + d * day + h * 36e5);

const ME_ID = oid(1);
const L1 = { id: oid(10), code: 'R-0012', name: 'Laheriasarai Net Point' };
const SUBS_R = [
  { id: oid(11), code: 'R-0031', name: 'Benta Wifi Zone', owner: 'Manoj Yadav', bal: 1845000, cust: 64, state: 'normal' },
  { id: oid(12), code: 'R-0034', name: 'Kadirabad Broadband', owner: 'Imran Ansari', bal: 920000, cust: 41, state: 'normal' },
  { id: oid(13), code: 'R-0037', name: 'Donar Cyber Hub', owner: 'Kavita Mishra', bal: 38000, cust: 23, state: 'low' },
];

const PERMS = ['subscribers.read', 'subscribers.write', 'subscribers.kick', 'kyc.upload', 'branding.manage', 'sessions.read', 'plans.read', 'resellers.read', 'resellers.write', 'billing.read', 'recharges.create', 'recharges.override', 'wallets.transfer', 'billing.cash', 'reports.view', 'tickets.read', 'tickets.write', 'users.read', 'users.write'];

const PLANS = [
  { id: oid(101), name: '30 Mbps Basic', down: 30, price: 49900 },
  { id: oid(102), name: '50 Mbps Unlimited', down: 50, price: 69900 },
  { id: oid(103), name: '100 Mbps Pro', down: 100, price: 99900 },
  { id: oid(104), name: '200 Mbps Ultra', down: 200, price: 149900 },
].map((p) => ({
  id: p.id, name: p.name, description: `${p.down} Mbps, unlimited data, 30 days`,
  downloadKbps: p.down * 1024, uploadKbps: p.down * 1024, burst: null, rateLimit: `${p.down}M/${p.down}M`,
  dataCapBytes: null, fup: null, fupRate: null, validityDays: 30, ipPool: null, simUse: 1,
  billingTypes: ['prepaid'], pricePaise: p.price, gstRatePercent: 18, hsnSac: '998422', extraAttributes: [],
  status: 'active', updatedAt: at(-40),
}));

const PEOPLE = [
  ['Ramesh Kumar', 'ramesh.lsr', 0, 12], ['Sunita Devi', 'sunita.benta', 1, 2], ['Arif Khan', 'arif.kdr', 2, -3],
  ['Priya Jha', 'priya.jha', 1, 1], ['Vikram Singh', 'vikram.s', 3, 22], ['Anjali Verma', 'anjali.v', 1, 0],
  ['Deepak Gupta', 'deepak.g', 0, 5], ['Kavita Thakur', 'kavita.t', 2, 18], ['Imran Ansari', 'imran.a', 1, -12],
  ['Neha Mishra', 'neha.m', 1, 3], ['Suresh Yadav', 'suresh.y', 0, 27], ['Pooja Patel', 'pooja.p', 2, 9],
  ['Manoj Sharma', 'manoj.sh', 1, 6], ['Rekha Kumari', 'rekha.k', 0, -1], ['Sanjay Jha', 'sanjay.j', 3, 14],
  ['Farah Naaz', 'farah.n', 1, 2], ['Gopal Mandal', 'gopal.m', 0, 11], ['Ritu Choudhary', 'ritu.c', 2, 25],
  ['Ajay Paswan', 'ajay.p', 1, 4], ['Shabnam Ara', 'shabnam.a', 1, 16],
];
const SUBS = PEOPLE.map(([name, username, plan, exp], i) => {
  const suspended = i === 8;
  const expired = exp < 0 && !suspended;
  return {
    id: oid(1000 + i), customerNo: `C${String(10231 + i * 7).padStart(6, '0')}`, username, name,
    phone: `+91 98${String(35500000 + i * 117331).slice(0, 8)}`, altPhone: null, email: i % 3 ? null : `${username.split('.')[0]}@gmail.com`,
    address: { line1: `Ward ${3 + (i % 9)}, ${['Laheriasarai', 'Benta', 'Kadirabad', 'Donar'][i % 4]}`, city: 'Darbhanga', state: 'Bihar', pincode: '846004' },
    gstin: null, billingType: 'prepaid', planId: PLANS[plan].id, expiresAt: at(exp, 23.98 - 11.5),
    status: suspended ? 'suspended' : 'active', suspendReason: suspended ? 'Payment pending' : null,
    radiusState: suspended ? 'blocked' : expired ? 'expired' : 'active',
    network: { staticIp: null, macLock: null, simUse: 1, popName: ['Laheriasarai POP', 'Benta POP'][i % 2] },
    fupActive: false, kycStatus: i % 4 === 1 ? 'pending' : 'verified', tags: [], notes: null, syncStatus: 'synced',
    reseller: i % 5 === 3 ? { id: SUBS_R[0].id, code: SUBS_R[0].code, name: SUBS_R[0].name } : { id: L1.id, code: L1.code, name: L1.name },
    plan: { id: PLANS[plan].id, name: PLANS[plan].name },
    online: !expired && !suspended && i % 3 !== 2,
    createdAt: at(-200 + i * 7), updatedAt: at(-2),
  };
});

const WALLET = {
  id: oid(500), ownerType: 'reseller', owner: L1, walletType: 'L1', parentWalletId: oid(499),
  balancePaise: 4268500, creditLimitPaise: 0, lowBalanceThresholdPaise: 500000, state: 'normal', frozenReason: null,
  totals: { receivedPaise: 25000000, allocatedPaise: 12450000, rechargedPaise: 8281500, refundedPaise: 0 },
  updatedAt: at(0, -1), children: 3, lowChildren: 1, customers: 128 + 64 + 41 + 23, canTopUp: true, canViewLedger: true,
};
const CHILD_WALLETS = SUBS_R.map((r, i) => ({
  id: oid(501 + i), ownerType: 'reseller', owner: { id: r.id, code: r.code, name: r.name }, walletType: 'L2',
  parentWalletId: WALLET.id, balancePaise: r.bal, creditLimitPaise: 0, lowBalanceThresholdPaise: 100000,
  state: r.state, frozenReason: null, updatedAt: at(-i, -3),
  totals: { receivedPaise: 3000000 - i * 500000, allocatedPaise: 0, rechargedPaise: 1200000, refundedPaise: 0 },
}));

const LEDGER = [
  ['RECHARGE', 'debit', 69900, 'Recharge C010231 Ramesh Kumar · 50 Mbps Unlimited', 0, -0.6],
  ['ALLOCATE', 'debit', 500000, 'To R-0037 Donar Cyber Hub', 0, -3],
  ['RECHARGE', 'debit', 49900, 'Recharge C010252 Priya Jha · 30 Mbps Basic', -1, -2],
  ['TOPUP', 'credit', 2500000, 'Top-up from Mithila Fibernet (UPI ref 4410 2291 8830)', -1, -6],
  ['RECHARGE', 'debit', 99900, 'Recharge C010259 Vikram Singh · 100 Mbps Pro', -2, -1],
  ['ALLOCATE', 'debit', 1000000, 'To R-0031 Benta Wifi Zone', -3, -4],
  ['RECHARGE', 'debit', 69900, 'Recharge C010266 Anjali Verma · 50 Mbps Unlimited', -3, -5],
  ['REFUND', 'credit', 69900, 'Refund of recharge RC-88213 (wrong plan)', -4, -2],
];
let bal = WALLET.balancePaise;
const LEDGER_ITEMS = LEDGER.map(([type, direction, amt, description, d, h], i) => {
  const after = bal;
  const before = direction === 'debit' ? after + amt : after - amt;
  bal = before;
  return { id: oid(700 + i), type, direction, amountPaise: amt, balanceBeforePaise: before, balanceAfterPaise: after, referenceId: oid(800 + i), description, createdAt: at(d, h), createdBy: { id: ME_ID, name: 'Rajesh Thakur' } };
});

const TICKETS = [
  [1042, 'No internet since last night', 'no_internet', 'high', 'open', 0, 'portal', 0],
  [1039, 'Speed very slow in evening', 'slow_speed', 'normal', 'in_progress', 4, 'reseller', -1],
  [1035, 'Want to upgrade to 100 Mbps', 'plan_change', 'low', 'waiting_customer', 6, 'portal', -2],
  [1031, 'Charged twice for recharge', 'billing', 'urgent', 'open', 3, 'portal', -2],
  [1027, 'Shifting to new house next week', 'relocation', 'normal', 'resolved', 10, 'reseller', -5],
].map(([number, subject, category, priority, status, si, source, d]) => ({
  id: oid(900 + number), number, subject, category, priority, status, source,
  assignee: status === 'open' ? null : { id: oid(2), name: 'Support · Neha' },
  subscriber: { id: SUBS[si].id, name: SUBS[si].name, customerNo: SUBS[si].customerNo, username: SUBS[si].username, phone: SUBS[si].phone },
  openedBy: { type: source === 'portal' ? 'customer' : 'user', id: oid(3), name: source === 'portal' ? SUBS[si].name : 'Rajesh Thakur' },
  messageCount: 3, lastActivityAt: at(d, -1), firstResponseAt: at(d, -0.5), resolvedAt: status === 'resolved' ? at(d + 1) : null, createdAt: at(d, -3),
}));

const TOPUPS = [
    { id: oid(600), reseller: L1, walletId: WALLET.id, balancePaise: WALLET.balancePaise, amountPaise: 2500000, approvedPaise: null, paidVia: 'upi', reference: 'UPI 4410 2291 8830', note: 'For December renewals', status: 'pending', decisionNote: null, createdAt: at(0, -1), decidedAt: null, canDecide: false, canCancel: true },
    { id: oid(601), reseller: L1, walletId: WALLET.id, balancePaise: 0, amountPaise: 5000000, approvedPaise: 5000000, paidVia: 'bank', reference: 'NEFT SBIN0012', note: null, status: 'approved', decisionNote: null, createdAt: at(-1, -7), decidedAt: at(-1, -6), canDecide: false, canCancel: false },
    { id: oid(602), reseller: { id: SUBS_R[2].id, code: SUBS_R[2].code, name: SUBS_R[2].name }, walletId: CHILD_WALLETS[2].id, balancePaise: 38000, amountPaise: 500000, approvedPaise: null, paidVia: 'cash', reference: null, note: 'Cash given at office', status: 'pending', decisionNote: null, createdAt: at(0, -0.4), decidedAt: null, canDecide: true, canCancel: false },
];

const plan = (id) => PLANS.find((p) => p.id === id);
const list = (items, extra = {}) => ({ items, nextCursor: null, total: items.length, ...extra });

const fixtures = [
  ['GET', '/api/v1/auth/me', () => ({
    user: { id: ME_ID, tenantId: oid(0), type: 'reseller', resellerId: L1.id, name: 'Rajesh Thakur', email: 'rajesh@lsrnet.in', phone: '+91 9835012345', roleIds: [oid(50)], status: 'active', mfaEnabled: false, lockedUntil: null, lastLoginAt: at(0, -2), createdAt: at(-300) },
    permissions: PERMS, mfa: 'ok', requireMfa: false, viewAs: null,
    reseller: { ...L1, level: 1, canCreateSubResellers: true },
    branding: { name: null, logoUrl: null, fromResellerId: null },
    tenant: { id: oid(0), name: 'Mithila Fibernet', code: 'mithila' },
  })],
  ['GET', '/api/v1/auth/preferences', () => ({ dashboardHidden: [] })],
  ['GET', '/api/v1/subscribers/summary', () => ({ asOf: at(0), total: 128, active: 117, suspended: 3, disabled: 1, expired: 7, expiredThisMonth: 9, expiringToday: 4, expiringTomorrow: 6, expiring7d: 19, renewPaise: { today: 279600, tomorrow: 419400, next7d: 1328100, expiredThisMonth: 629100 } })],
  ['GET', '/api/v1/sessions/summary', () => ({ online: 96, stale: 0, byNas: [{ nasIp: '10.10.1.1', nasName: 'Laheriasarai CCR', online: 71 }, { nasIp: '10.10.2.1', nasName: 'Benta hAP', online: 25 }] })],
  ['GET', '/api/v1/billing/summary', () => ({ today: { recharges: 11, rechargePaise: 789900 }, month: { recharges: 212, invoicedPaise: 15203400, collectedPaise: 14788100 }, unpaid: { count: 0, balancePaise: 0, overdue: 0 }, wallets: { resellerBalancePaise: 2803000, low: 1, frozen: 0 }, sms: { queued: 0, failed24h: 0 } })],
  ['GET', '/api/v1/sessions/activity', () => ({
    points: Array.from({ length: 24 }, (_, h) => ({ at: at(-1, h + 12), online: Math.round(70 + 30 * Math.sin((h - 6) / 24 * Math.PI * 2) + (h % 3)), lastWeek: Math.round(66 + 28 * Math.sin((h - 6) / 24 * Math.PI * 2)) })),
    hours: Array.from({ length: 24 }, (_, h) => ({ hour: at(-1, h + 12), accepted: 20 + ((h * 7) % 15), rejected: h % 5 === 0 ? 2 : 0 })),
  })],
  ['GET', '/api/v1/subscribers', (q) => {
    let items = SUBS;
    const s = (q.get('q') || q.get('search') || '').toLowerCase();
    if (s) items = items.filter((x) => (x.name + x.username + x.customerNo + x.phone).toLowerCase().includes(s));
    return list(items, { total: s ? items.length : 128 });
  }],
  ['GET', '/api/v1/subscribers/expiring', () => list(SUBS.filter((s) => s.radiusState === 'active').sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)).slice(0, 10), { total: 19 })],
  ['GET', /^\/api\/v1\/subscribers\/([0-9a-f]{24})$/, (q, [id]) => SUBS.find((s) => s.id === id) ?? SUBS[0]],
  ['GET', /^\/api\/v1\/subscribers\/([0-9a-f]{24})\/kyc$/, () => ({ status: 'pending', cafNo: null, aadhaarLast4: null, note: null, decidedAt: null, documents: [], missing: ['aadhaar', 'photo', 'caf_signed'], canView: true, canUpload: true, canVerify: false })],
  ['GET', /^\/api\/v1\/subscribers\/([0-9a-f]{24})\/sessions$/, (q, [id]) => list([0, 1, 2].map((i) => ({ id: oid(3000 + i), username: SUBS[0].username, subscriberId: id, nasIp: '10.10.1.1', nasName: 'Laheriasarai CCR', framedIp: `100.64.3.${20 + i}`, mac: 'D4:CA:6D:3A:91:0F', startedAt: at(-i, -6), updatedAt: at(-i, -1), stoppedAt: i ? at(-i, -1) : null, sessionSecs: 18000 + i * 3000, uploadBytes: 4.1e8, downloadBytes: 6.2e9 - i * 1e9, terminateCause: i ? 'User-Request' : null, stale: false })))],
  ['GET', '/api/v1/plans', () => list(PLANS)],
  ['GET', /^\/api\/v1\/plans\/([0-9a-f]{24})$/, (q, [id]) => plan(id) ?? PLANS[1]],
  ['GET', '/api/v1/recharges/quote', (q) => {
    const p = plan(q.get('planId')) ?? PLANS[1];
    const sub = SUBS.find((s) => s.id === q.get('subscriberId')) ?? SUBS[0];
    const start = Math.max(NOW, Date.parse(sub.expiresAt));
    return { plan: { id: p.id, name: p.name, validityDays: 30 }, quantity: 1, walletPricePaise: Math.round(p.pricePaise * 0.82), walletBalancePaise: WALLET.balancePaise, customerPricePaise: p.pricePaise, customerTotalPaise: Math.round(p.pricePaise * 1.18), periodStart: iso(start), newExpiresAt: iso(start + 30 * day), walletModel: 'prepaid', sharePercent: null, canOverride: true, maxExpiresAt: iso(start + 400 * day) };
  }],
  ['GET', '/api/v1/recharges', () => list(SUBS.slice(0, 8).map((s, i) => ({ id: oid(4000 + i), subscriber: { id: s.id, name: s.name, customerNo: s.customerNo, username: s.username }, plan: s.plan, siteReseller: s.reseller, amountPaise: Math.round(plan(s.planId).pricePaise * 0.82), customerPricePaise: plan(s.planId).pricePaise, taxPaise: Math.round(plan(s.planId).pricePaise * 0.18), channel: i % 3 ? 'reseller_wallet' : 'cash', status: 'SUCCESS', oldExpiresAt: at(-i - 1), periodStart: at(-i), newExpiresAt: at(30 - i), quantity: 1, by: { id: ME_ID, name: 'Rajesh Thakur' }, invoiceId: oid(4100 + i), paymentId: null, walletModel: 'prepaid', sharePercent: null, override: null, reversal: null, replayed: false, createdAt: at(-i, -2) })))],
  ['GET', '/api/v1/wallets/mine', () => WALLET],
  ['GET', '/api/v1/wallets', () => list([WALLET, ...CHILD_WALLETS])],
  ['GET', /^\/api\/v1\/wallets\/([0-9a-f]{24})$/, (q, [id]) => [WALLET, ...CHILD_WALLETS].find((w) => w.id === id) ?? WALLET],
  ['GET', /^\/api\/v1\/wallets\/([0-9a-f]{24})\/ledger$/, () => list(LEDGER_ITEMS)],
  ['GET', '/api/v1/wallets/topup-requests', (q) => list(TOPUPS.filter((t) => (q.get('box') === 'incoming' ? t.reseller.id !== L1.id : q.get('box') === 'outgoing' ? t.reseller.id === L1.id : true) && (!q.get('status') || t.status === q.get('status'))), { pending: 1 })],
  ['IGNORE', '', () => list([
    { id: oid(600), reseller: L1, walletId: WALLET.id, balancePaise: WALLET.balancePaise, amountPaise: 2500000, approvedPaise: null, paidVia: 'upi', reference: 'UPI 4410 2291 8830', note: 'For December renewals', status: 'pending', decisionNote: null, createdAt: at(0, -1), decidedAt: null, canDecide: false, canCancel: true },
    { id: oid(601), reseller: L1, walletId: WALLET.id, balancePaise: 0, amountPaise: 5000000, approvedPaise: 5000000, paidVia: 'bank', reference: 'NEFT SBIN0012', note: null, status: 'approved', decisionNote: null, createdAt: at(-1, -7), decidedAt: at(-1, -6), canDecide: false, canCancel: false },
    { id: oid(602), reseller: { id: SUBS_R[2].id, code: SUBS_R[2].code, name: SUBS_R[2].name }, walletId: CHILD_WALLETS[2].id, balancePaise: 38000, amountPaise: 500000, approvedPaise: null, paidVia: 'cash', reference: null, note: 'Cash given at office', status: 'pending', decisionNote: null, createdAt: at(0, -0.4), decidedAt: null, canDecide: true, canCancel: false },
  ], { pending: 2 })],
  ['GET', '/api/v1/resellers', () => list(SUBS_R.map((r, i) => ({ id: r.id, code: r.code, name: r.name, ownerName: r.owner, phone: `+91 99${3410000 + i * 1771}0`, email: null, gstin: null, address: { line1: r.name.split(' ')[0], city: 'Darbhanga', state: 'Bihar', pincode: '846004' }, parentId: L1.id, level: 2, creditLimitPaise: 0, canCreateSubResellers: false, status: 'active', suspendReason: null, blockedBy: null, counts: { subResellers: 0, directCustomers: r.cust, totalCustomers: r.cust }, wallet: { id: CHILD_WALLETS[i].id, balancePaise: r.bal, state: r.state }, parent: L1, createdAt: at(-150 + i * 20), updatedAt: at(-3) })))],
  ['GET', /^\/api\/v1\/resellers\/([0-9a-f]{24})$/, (q, [id]) => {
    const addr = (n) => ({ line1: n, city: 'Darbhanga', state: 'Bihar', pincode: '846004' });
    if (id === L1.id) return { ...L1, ownerName: 'Rajesh Thakur', phone: '+91 9835012345', email: 'rajesh@lsrnet.in', gstin: null, address: addr('Station Road, Laheriasarai'), parentId: null, level: 1, creditLimitPaise: 0, canCreateSubResellers: true, status: 'active', suspendReason: null, blockedBy: null, counts: { subResellers: 3, directCustomers: 128, totalCustomers: 256 }, updatedAt: at(-3), path: [], walletId: WALLET.id };
    const i = Math.max(0, SUBS_R.findIndex((r) => r.id === id));
    const r = SUBS_R[i];
    return { id: r.id, code: r.code, name: r.name, ownerName: r.owner, phone: '+91 9934100000', email: null, gstin: null, address: addr(r.name.split(' ')[0]), parentId: L1.id, level: 2, creditLimitPaise: 0, canCreateSubResellers: false, status: 'active', suspendReason: null, blockedBy: null, counts: { subResellers: 0, directCustomers: r.cust, totalCustomers: r.cust }, updatedAt: at(-3), path: [L1], walletId: CHILD_WALLETS[i].id };
  }],
  ['GET', /^\/api\/v1\/wallets\/([0-9a-f]{24})\/report$/, () => {
    let b = 1800000;
    return { rows: Array.from({ length: 29 }, (_, i) => {
      const credit = i === 9 || i === 23 ? 5000000 : 0;
      const debit = 120000 + ((i * 37) % 9) * 30000 + (i % 5 === 0 ? 500000 : 0);
      b += credit - debit;
      return { day: at(i - 28).slice(0, 10), creditsPaise: credit, debitsPaise: debit, byType: { RECHARGE: debit }, countByType: { RECHARGE: Math.round(debit / 60000) }, count: Math.round(debit / 60000) + (credit ? 1 : 0) };
    }) };
  }],
  ['GET', /^\/api\/v1\/reports\/([a-z-]+)$/, (q, [name]) => {
    const days = Array.from({ length: 7 }, (_, i) => at(i - 6).slice(0, 10));
    const tables = {
      revenue: [{ title: 'Revenue by day', columns: [{ key: 'day', label: 'Day', kind: 'text' }, { key: 'recharges', label: 'Recharges', kind: 'int' }, { key: 'net', label: 'Net', kind: 'money' }, { key: 'gst', label: 'GST', kind: 'money' }, { key: 'gross', label: 'Total', kind: 'money' }], rows: days.map((d, i) => { const g = 520000 + ((i * 7919) % 400000); return { day: d, recharges: 7 + (i % 5) * 2, net: Math.round(g / 1.18), gst: g - Math.round(g / 1.18), gross: g }; }), totals: { day: 'Total', recharges: 61, net: 3702542, gst: 666458, gross: 4369000 } },
        { title: 'Revenue by plan', columns: [{ key: 'plan', label: 'Plan', kind: 'text' }, { key: 'count', label: 'Recharges', kind: 'int' }, { key: 'gross', label: 'Total', kind: 'money' }], rows: PLANS.map((p, i) => ({ plan: p.name, count: [21, 26, 10, 4][i], gross: [21, 26, 10, 4][i] * Math.round(p.pricePaise * 1.18) })) }],
    };
    return { name, title: 'Revenue', from: q.get('from') ?? at(-19).slice(0, 10), to: q.get('to') ?? at(0).slice(0, 10), generatedAt: at(0), tables: tables[name] ?? tables.revenue };
  }],
  ['GET', /^\/api\/v1\/resellers\/([0-9a-f]{24})\/rates$/, () => ({ canSetWalletPrices: true, canSetCustomerPrices: true, walletModel: 'prepaid', sharePercent: null, items: PLANS.map((p, i) => ({ planId: p.id, planName: p.name, planPricePaise: p.pricePaise, gstRatePercent: 18, walletPricePaise: Math.round(p.pricePaise * 0.88 / 100) * 100, customerPricePaise: p.pricePaise, active: i < 3, custom: i < 2 })) })],
  ['GET', /^\/api\/v1\/resellers\/([0-9a-f]{24})\/branding$/, () => ({ name: 'Laheriasarai Net Point', logoUrl: null, effective: { name: 'Laheriasarai Net Point', logoUrl: null, fromResellerId: L1.id } })],
  ['GET', '/api/v1/tickets', () => list(TICKETS)],
  ['GET', '/api/v1/tickets/counts', () => ({ open: 2, in_progress: 1, waiting_customer: 1, resolved: 1, closed: 14, mine: 1, unassigned: 2 })],
  ['GET', /^\/api\/v1\/tickets\/([0-9a-f]{24})$/, (q, [id]) => {
    const t = TICKETS.find((x) => x.id === id) ?? TICKETS[0];
    return { ...t, events: [
      { id: oid(950), kind: 'message', body: 'Internet is not working since last night. Router light is red.', from: null, to: null, author: { type: 'customer', id: t.subscriber.id, name: t.subscriber.name }, createdAt: at(0, -3) },
      { id: oid(951), kind: 'note', body: 'Checked: no session since 22:40. Likely fibre cut near Ward 7.', from: null, to: null, author: { type: 'user', id: ME_ID, name: 'Rajesh Thakur' }, createdAt: at(0, -2) },
      { id: oid(952), kind: 'message', body: 'Our technician is on the way. It should be fixed within 2 hours.', from: null, to: null, author: { type: 'user', id: ME_ID, name: 'Rajesh Thakur' }, createdAt: at(0, -1.5) },
    ] };
  }],
  ['GET', '/api/v1/sessions/live', () => list(SUBS.filter((s) => s.online).map((s, i) => ({ id: oid(3100 + i), username: s.username, subscriberId: s.id, nasIp: i % 3 ? '10.10.1.1' : '10.10.2.1', nasName: i % 3 ? 'Laheriasarai CCR' : 'Benta hAP', framedIp: `100.64.3.${20 + i}`, mac: `D4:CA:6D:3A:${String(10 + i).padStart(2, '0')}:0F`, startedAt: at(0, -1 - i * 1.7), updatedAt: at(0, -0.05), stoppedAt: null, sessionSecs: 3600 + i * 6100, uploadBytes: 1.2e8 * (i + 1), downloadBytes: 9.1e8 * (i + 1), terminateCause: null, stale: false })), { total: 96 })],
  ['GET', '/api/v1/users', () => list([
    { id: ME_ID, tenantId: oid(0), type: 'reseller', resellerId: L1.id, name: 'Rajesh Thakur', email: 'rajesh@lsrnet.in', phone: '+91 9835012345', roleIds: [oid(50)], status: 'active', mfaEnabled: false, lockedUntil: null, lastLoginAt: at(0, -2), createdAt: at(-300) },
    { id: oid(4), tenantId: oid(0), type: 'reseller', resellerId: L1.id, name: 'Sonu Kumar', email: null, phone: '+91 9801122334', roleIds: [oid(51)], status: 'active', mfaEnabled: false, lockedUntil: null, lastLoginAt: at(-1, -4), createdAt: at(-90) },
    { id: oid(5), tenantId: oid(0), type: 'reseller', resellerId: L1.id, name: 'Pinki Devi', email: null, phone: '+91 9801199887', roleIds: [oid(51)], status: 'active', mfaEnabled: false, lockedUntil: null, lastLoginAt: at(-3), createdAt: at(-40) },
  ])],
  ['GET', '/api/v1/roles', () => [
    { id: oid(50), tenantId: null, name: 'Reseller Owner', scope: 'reseller', permissions: PERMS, builtIn: true, requireMfa: false },
    { id: oid(51), tenantId: null, name: 'Reseller Staff', scope: 'reseller', permissions: PERMS.slice(0, 10), builtIn: true, requireMfa: false },
  ]],
];

const reportSamples = (name) => ({ name, rows: [], columns: [] });

function handle(method, path, q, body) {
  for (const [m, p, fn] of fixtures) {
    if (m !== method) continue;
    if (typeof p === 'string' ? p === path : p.test(path)) {
      const params = typeof p === 'string' ? [] : p.exec(path).slice(1);
      const hit = match(method, path);
      const out = fn(q, params, body);
      if (!hit) return out;
      const schema = responseSchema(hit.op);
      if (!schema) return out;
      if (out && Array.isArray(out.items)) {
        const is = itemSchema(schema);
        const base = fake(schema, '', hit.route);
        return { ...merge(base, { ...out, items: [] }), items: out.items.map((it, i) => merge(fake(is, '', `${hit.route}[${i}]`), it)) };
      }
      if (Array.isArray(out)) return out;
      return merge(fake(schema, '', hit.route), out);
    }
  }
  const hit = match(method, path);
  if (!hit) return undefined;
  if (method !== 'GET') {
    const schema = responseSchema(hit.op);
    return schema ? fake(schema, '', hit.route) : { ok: true };
  }
  const schema = responseSchema(hit.op);
  return schema ? fake(schema, '', hit.route) : {};
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    let parsed = null;
    try { parsed = body ? JSON.parse(body) : null; } catch {}
    if (url.pathname === '/api/v1/auth/login' || url.pathname === '/api/v1/auth/refresh') {
      res.writeHead(200, { 'content-type': 'application/json', 'set-cookie': ['isp_at=demo; Path=/', 'isp_csrf=demo; Path=/'] });
      return res.end(JSON.stringify({ ok: true, mfa: 'ok' }));
    }
    const out = handle(req.method, url.pathname, url.searchParams, parsed);
    console.log(req.method, url.pathname + url.search, out === undefined ? '404' : 'ok');
    if (out === undefined) {
      res.writeHead(404, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Not found' } }));
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(out));
  });
}).listen(PORT, () => console.log('mock api on', PORT));
