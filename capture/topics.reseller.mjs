// One entry per guide topic. `open` = page, `prepare` = clicks/typing before the shot,
// `marks` = what to point at, in order (1, 2, 3…). kind: 'click' = press this, 'look' = read this.
const SUB = '/admin/subscribers/aaaaaaaaaaaaaa67200003e8';
const SUB_CHILD = '/admin/resellers/aaaaaaaaaaaaaa672000000b';
const MY_WALLET = '/admin/wallets/aaaaaaaaaaaaaa67200001f4';

const vis = (l) => l.locator('visible=true').first();
const btn = (name, exact = false) => (p) => vis(p.getByRole('button', { name, exact }));
const tab = (name) => (p) => p.getByRole('tab', { name }).first();
const label = (name) => (p) => p.getByLabel(name, { exact: true }).first();
const text = (t) => (p) => vis(p.getByText(t, { exact: true }));
const link = (name) => (p) => p.getByRole('link', { name }).first();
const dialog = (p) => p.getByRole('dialog').first();

export default [
  {
    id: 'sign-in',
    open: '/login',
    signedOut: true,
    prepare: async (p) => {
      await p.getByLabel(/phone|email|username/i).first().fill('9835012345');
      await p.getByLabel(/password/i).first().fill('••••••••••');
    },
    marks: [
      { at: (p) => p.getByLabel(/phone|email|username/i).first(), kind: 'click' },
      { at: (p) => p.getByLabel(/password/i).first(), kind: 'click' },
      { at: btn(/sign in/i), kind: 'click' },
    ],
  },
  {
    id: 'dashboard',
    open: '/admin',
    marks: [
      { at: text('Wallet balance'), box: 'card', kind: 'look' },
      { at: text('Renewals'), box: 'section', kind: 'look' },
      { at: text('Add a customer'), box: 'card', kind: 'click' },
    ],
  },
  {
    id: 'find-customer',
    open: '/admin/subscribers',
    prepare: async (p) => {
      await p.getByPlaceholder(/Name, C-number/).fill('priya');
      await p.waitForTimeout(900);
    },
    marks: [
      { at: (p) => p.getByPlaceholder(/Name, C-number/), kind: 'click' },
      { at: btn('Expired'), kind: 'look' },
      { at: text('Priya Jha'), box: 'row', kind: 'click' },
    ],
  },
  {
    id: 'add-customer',
    open: '/admin/subscribers/new',
    prepare: async (p) => {
      await p.getByLabel('PPPoE username').fill('ravi.benta');
      await p.getByLabel('Name', { exact: true }).fill('Ravi Shankar').catch(() => {});
    },
    marks: [
      { at: label('PPPoE username'), kind: 'click' },
      { at: label('Reseller'), kind: 'look' },
      { at: label('Plan'), kind: 'click' },
      { at: label('Valid until'), kind: 'click' },
    ],
  },
  {
    id: 'recharge',
    open: SUB,
    prepare: async (p) => {
      await btn('Recharge', true)(p).click();
      await dialog(p).waitFor();
      await p.waitForTimeout(900);
    },
    marks: [
      { at: (p) => dialog(p).getByLabel(/plan/i).first(), kind: 'click' },
      { at: (p) => dialog(p).getByText(/from your wallet/i).first(), box: 'parent2', kind: 'look' },
      { at: (p) => dialog(p).getByRole('button', { name: /recharge|confirm/i }).last(), kind: 'click' },
    ],
  },
  {
    id: 'expiring',
    open: '/admin/subscribers/expiring',
    marks: [
      { at: (p) => vis(p.getByText('7 days', { exact: true })), kind: 'click' },
      { at: (p) => vis(p.getByText('Today', { exact: true })), kind: 'look' },
      { at: (p) => vis(p.getByText(/Recharge ₹/)), kind: 'click' },
    ],
  },
  {
    id: 'suspend',
    open: SUB,
    prepare: async (p) => {
      await btn('Suspend', true)(p).click();
      await dialog(p).waitFor();
    },
    marks: [
      { at: (p) => dialog(p).getByLabel(/reason/i), kind: 'click' },
      { at: (p) => dialog(p).getByRole('button', { name: /suspend/i }).last(), kind: 'click' },
    ],
  },
  {
    id: 'online-now',
    open: '/admin/sessions',
    marks: [
      { at: (p) => p.getByPlaceholder(/Username, IP/), kind: 'click' },
      { at: (p) => p.getByRole('combobox').first(), kind: 'look' },
      { at: (p) => p.getByRole('button', { name: 'Kick' }).nth(1), kind: 'click' },
    ],
  },
  {
    id: 'kyc',
    open: SUB,
    prepare: async (p) => {
      await tab('KYC')(p).click();
      await p.waitForTimeout(600);
    },
    marks: [
      { at: tab('KYC'), kind: 'click' },
      { at: (p) => p.getByRole('button', { name: /upload|add/i }).first(), kind: 'click' },
    ],
  },
  {
    id: 'wallet',
    open: '/admin/wallets',
    marks: [
      { at: text('Balance'), box: 'card', kind: 'look' },
      { at: text('Used for recharges'), box: 'card', kind: 'look' },
      { at: link(/My ledger/), kind: 'click' },
    ],
  },
  {
    id: 'ledger',
    open: MY_WALLET,
    marks: [
      { at: (p) => p.getByRole('table').first(), kind: 'look' },
    ],
  },
  {
    id: 'request-topup',
    open: '/admin/wallets',
    prepare: async (p) => {
      await btn('Request top-up')(p).click();
      await dialog(p).waitFor();
      await dialog(p).getByLabel(/amount/i).first().fill('25000');
    },
    marks: [
      { at: (p) => dialog(p).getByLabel(/amount/i).first(), kind: 'click' },
      { at: (p) => dialog(p).getByLabel(/paid via|received via|via/i).first(), kind: 'click' },
      { at: (p) => dialog(p).getByLabel(/reference|utr/i).first(), kind: 'click' },
      { at: (p) => dialog(p).getByRole('button', { name: /send|request|submit/i }).last(), kind: 'click' },
    ],
  },
  {
    id: 'approve-topup',
    open: '/admin/wallets',
    marks: [
      { at: text('Donar Cyber Hub'), box: 'row', kind: 'look' },
      { at: btn('Approve'), kind: 'click' },
      { at: btn('Reject'), kind: 'click' },
    ],
  },
  {
    id: 'send-money',
    open: '/admin/wallets',
    scrollTo: (p) => p.getByRole('tab', { name: 'Sub-resellers' }).first(),
    marks: [
      { at: tab('Sub-resellers'), kind: 'look' },
      { at: (p) => p.getByRole('button', { name: 'Send', exact: true }).first(), kind: 'click' },
    ],
  },
  {
    id: 'add-sub-reseller',
    open: '/admin/resellers',
    prepare: async (p) => {
      await btn(/Add sub-reseller/)(p).click();
      await p.waitForTimeout(700);
    },
    marks: [
      { at: (p) => p.getByLabel(/business name|^name/i).first(), kind: 'click' },
      { at: (p) => p.getByLabel(/owner/i).first(), kind: 'click' },
      { at: (p) => p.getByLabel(/phone|mobile/i).first(), kind: 'click' },
    ],
  },
  {
    id: 'set-prices',
    open: SUB_CHILD,
    prepare: async (p) => {
      await tab('Prices')(p).click();
      await p.waitForTimeout(700);
    },
    marks: [
      { at: tab('Prices'), kind: 'click' },
      { at: (p) => p.getByRole('table').first(), kind: 'look' },
      { at: (p) => p.getByRole('button', { name: 'Save', exact: true }).last(), kind: 'click' },
    ],
  },
  {
    id: 'branding',
    open: '/account',
    scrollTo: text('Branding'),
    marks: [
      { at: text('Branding'), box: 'card', kind: 'look' },
      { at: (p) => p.getByRole('button', { name: /logo|upload/i }).first(), kind: 'click' },
    ],
  },
  {
    id: 'new-ticket',
    open: '/admin/tickets',
    marks: [
      { at: btn('New ticket'), kind: 'click' },
      { at: (p) => p.getByRole('tablist').first(), kind: 'look' },
      { at: text('No internet since last night'), box: 'row', kind: 'click' },
    ],
  },
  {
    id: 'reply-ticket',
    open: '/admin/tickets/aaaaaaaaaaaaaa672000079a',
    prepare: async (p) => {
      await p.getByPlaceholder(/Write a reply/).fill('Our technician will reach you by 4 pm today.');
    },
    marks: [
      { at: (p) => p.getByPlaceholder(/Write a reply/), kind: 'click' },
      { at: btn('Send'), kind: 'click' },
      { at: label('Status'), kind: 'click' },
    ],
  },
  {
    id: 'reports',
    open: '/admin/reports',
    marks: [
      { at: (p) => p.getByRole('tablist').first(), kind: 'click' },
      { at: (p) => p.getByRole('combobox').first(), kind: 'click' },
      { at: btn('Excel'), kind: 'click' },
    ],
  },
  {
    id: 'staff',
    open: '/admin/users',
    marks: [
      { at: btn('New staff account'), kind: 'click' },
      { at: text('Reseller Staff'), box: 'cell', kind: 'look' },
    ],
  },
  {
    id: 'my-account',
    open: '/account',
    height: 1400,
    marks: [
      { at: label('Current password'), kind: 'click' },
      { at: btn('Turn on'), kind: 'click' },
    ],
  },
];
