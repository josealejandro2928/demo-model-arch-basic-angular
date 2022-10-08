export const appIcons = [
  { name: 'server', icon: 'dns' },
  { name: 'server-2', icon: 'storage' },
  { name: 'component', icon: 'call_to_action' },
  { name: 'database', icon: 'database' },
  { name: 'cloud', icon: 'cloud' },
  { name: 'cloud', icon: 'cloud' },
  { name: 'payment', icon: 'payments' },
  { name: 'binary', icon: 'code' },
  { name: 'binary-2', icon: 'terminal' },
  { name: 'web', icon: 'web' },
  { name: 'mobile', icon: 'phone_iphone' },
  { name: 'user', icon: 'group' },
  { name: 'computer', icon: 'computer' },
  { name: 'load-balancer', icon: 'account_tree' },
  { name: 'load-balancer-2', icon: 'mediation' },
  { name: 'auth', icon: 'verified_user' },
];

export const delay_ms = async (ms: number) => {
  return new Promise((r) => setTimeout(r, ms || 1000));
};
