import { microservices } from './microservices';

const apiUrlPrefix = '/ion';
const gtm = '&gtm_auth=GY4FB12qq42bndChzMR4tw&gtm_preview=env-13';

export const environment = Object.assign({}, microservices, {
  production: true,
  apiUrlPrefix,
  gtm,
  productId: 'DE1934657F314B499721D8301915A687',
});
