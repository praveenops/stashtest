// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { microservices } from './microservices';

const apiUrlPrefix = '/ion';
const gtm = '&gtm_auth=GY4FB12qq42bndChzMR4tw&gtm_preview=env-13';

export const environment = Object.assign({}, microservices, {
  production: false,
  apiUrlPrefix,
  gtm,
  productId: 'DE1934657F314B499721D8301915A687',
});
