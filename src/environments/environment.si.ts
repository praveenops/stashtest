import { microservices } from './microservices';

const apiUrlPrefix = '/ion';
const gtm = '&gtm_auth=UCuxI-U3qAMByuPSQcLEog&gtm_preview=env-15';

export const environment = Object.assign({}, microservices, {
  production: true,
  apiUrlPrefix,
  gtm,
  productId: 'DE1934657F314B499721D8301915A687',
});
