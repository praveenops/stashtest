import { microservices } from './microservices';

const apiUrlPrefix = '/ion';
const gtm = '&gtm_auth=C5F8owiMZBhmSCn6TO1TUw&gtm_preview=env-28';

export const environment = Object.assign({}, microservices, {
  production: true,
  apiUrlPrefix,
  gtm,
  productId: '8885FE7E9B4847EEB22AF79B6B416C8C',
});
