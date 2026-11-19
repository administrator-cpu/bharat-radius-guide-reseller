// Customer portal and pay page, captured on a phone screen (that is how customers use them).
const vis = (l) => l.locator('visible=true').first();
const btn = (name, exact = false) => (p) => vis(p.getByRole('button', { name, exact }));
const text = (t) => (p) => vis(p.getByText(t, { exact: true }));
const label = (name) => (p) => vis(p.getByLabel(name, { exact: true }));
const dialog = (p) => p.getByRole('dialog').first();
const base = { device: 'phone', session: 'customer' };
const TICKET = '/portal/support/aaaaaaaaaaaaaa6720000397';

export default [
  {
    ...base,
    id: 'portal-sign-in',
    open: '/portal/login',
    signedOut: true,
    prepare: async (p) => {
      await p.getByLabel(/username or customer number/i).fill('C010252');
      await p.getByLabel(/password/i).first().fill('••••••••');
    },
    marks: [
      { at: (p) => p.getByLabel(/username or customer number/i), kind: 'click' },
      { at: (p) => p.getByLabel(/password/i).first(), kind: 'click' },
      { at: btn(/log in/i), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'portal-home',
    open: '/portal',
    marks: [
      { at: text('Expires in 2 days'), kind: 'look' },
      { at: text('days left'), box: 'parent2', kind: 'look' },
      { at: (p) => vis(p.getByText(/^Valid until/)), kind: 'look' },
    ],
  },
  {
    ...base,
    id: 'portal-recharge',
    open: '/portal',
    marks: [
      { at: btn(/Recharge ₹/), kind: 'click' },
      { at: text('Amount due'), box: 'parent2', kind: 'look' },
    ],
  },
  {
    ...base,
    id: 'portal-change-plan',
    open: '/portal',
    prepare: async (p) => {
      await p.getByText('Choose', { exact: true }).first().waitFor();
      await p.getByRole('heading', { name: 'Change plan' }).evaluate((el) => el.scrollIntoView({ block: 'start' }));
      await p.evaluate(() => window.scrollBy(0, -70));
    },
    marks: [
      { at: text('Your plan'), box: 'card', kind: 'look' },
      { at: (p) => p.getByRole('button', { name: 'Choose' }).nth(1), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'portal-change-plan-confirm',
    open: '/portal',
    prepare: async (p) => {
      await p.getByRole('button', { name: 'Choose' }).nth(1).click();
      await dialog(p).waitFor();
    },
    marks: [
      { at: (p) => dialog(p).getByText(/You pay/), kind: 'look' },
      { at: (p) => dialog(p).getByRole('button', { name: 'Pay and switch' }), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'pay-page',
    open: '/pay?t=demo',
    session: 'none',
    marks: [
      { at: (p) => p.locator('dl').first(), kind: 'look' },
      { at: btn(/^Pay ₹/), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'portal-usage',
    open: '/portal/usage',
    marks: [
      { at: (p) => vis(p.getByText(/^Downloaded/)), box: 'card', kind: 'look' },
      { at: text('Data this cycle'), box: 'card', kind: 'look' },
      { at: text('Daily usage'), box: 'card', kind: 'look' },
    ],
  },
  {
    ...base,
    id: 'portal-bills',
    open: '/portal/bills',
    marks: [
      { at: (p) => vis(p.getByText(/^LNP\//)), box: 'parent2', kind: 'look' },
      { at: (p) => vis(p.getByRole('button', { name: /PDF/ })), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'portal-report-problem',
    open: '/portal/support',
    prepare: async (p) => {
      await btn('Report a problem')(p).click();
      await p.waitForTimeout(500);
      await p.getByLabel('Subject').fill('Speed drops after 9 pm');
      await p.getByLabel('Details').fill('Every night after 9 pm the speed falls to 2-3 Mbps.');
      await p.getByLabel('What is it about?').scrollIntoViewIfNeeded();
      await p.evaluate(() => window.scrollBy(0, -80));
    },
    marks: [
      { at: label('What is it about?'), kind: 'click' },
      { at: label('Subject'), kind: 'click' },
      { at: label('Details'), kind: 'click' },
      { at: (p) => p.getByRole('button', { name: /send|submit|report/i }).last(), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'portal-ticket-reply',
    open: TICKET,
    marks: [
      { at: (p) => vis(p.getByText(/We changed your line/)), box: 'parent2', kind: 'look' },
      { at: (p) => p.getByPlaceholder(/Write a reply/), kind: 'click' },
      { at: btn('Send', true), kind: 'click' },
      { at: (p) => vis(p.getByText(/close ticket/)), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'portal-password',
    open: '/portal/account',
    prepare: async (p) => {
      await p.getByText('Set a portal password', { exact: true }).evaluate((el) => el.scrollIntoView({ block: 'start' }));
      await p.evaluate(() => window.scrollBy(0, -90));
    },
    marks: [
      { at: (p) => p.getByLabel(/Internet \(PPPoE\) password/), kind: 'click' },
      { at: label('New password'), kind: 'click' },
      { at: label('Repeat new password'), kind: 'click' },
      { at: btn('Save password'), kind: 'click' },
    ],
  },
  {
    ...base,
    id: 'portal-kyc',
    open: '/portal/account',
    prepare: async (p) => {
      await p.getByText('KYC documents', { exact: true }).evaluate((el) => el.scrollIntoView({ block: 'start' }));
      await p.evaluate(() => window.scrollBy(0, -90));
    },
    marks: [
      { at: (p) => vis(p.getByText(/Still needed/)), kind: 'look' },
      { at: label('Document'), kind: 'click' },
      { at: btn(/Upload/), kind: 'click' },
    ],
  },
];
