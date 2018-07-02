import { microservices } from './microservices';

const apiUrlPrefix = '/ion';
const gtm = '&gtm_auth=bHXWoLXWbKpU7IczG9Cn1Q&gtm_preview=env-16';

export const environment = Object.assign({}, microservices, {
  production: true,
  apiUrlPrefix,
  gtm,
  productId: '51A73AFD8924417CAFF5B71D22B6F06F',
});
