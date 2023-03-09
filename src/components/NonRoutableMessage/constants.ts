export const CONTACT_SUPPORT_NEW_TICKET = 'https://videate.zendesk.com/hc/en-us/requests/new';

export const NON_ROUTABLE_ROUTES = {
  '10.0.0.0/8': {
    availableIPs: '16,777,214',
    range: '10.0.0.0 — 10.255.255.255',
  },
  '172.16.0.0/12': {
    availableIPs: '1,048,574',
    range: '172.16.0.0 — 172.31.255.255',
  },
  '192.168.0.0/16': {
    availableIPs: '65,534',
    range: '192.168.0.0 — 192.168.255.255',
  },
};
