import { microservices as ms } from '../../../environments/microservices';

export const ENDPOINT = {

  FEATURE_TOGGLES:          `/api/features`,

  // metadata
  // Todo: rename
  DATASETS:               `${ms.metadataApi}/datasets`,
  DATASET:                `${ms.metadataApi}/datasets/{0}`,
  DATASET_METADATA:       `${ms.metadataApi}/datasetMetadata`,

  // user preference
  FETCH_USER_PREFERENCE:  `${ms.userApi}/user`,
  SAVE_USER_PREFERENCE:   `${ms.userApi}/user`,

  // facts
  ITEMS:                  `${ms.factsApi}/items`,
  ITEM_DETAILS:           `${ms.factsApi}/items/{0}`,
  ITEM_PICTURES:          `${ms.factsApi}/items/images/{0}`,
  ITEM_PUBLIC_IMAGE:      `${ms.factsApi}/public/image`,
  ITEM_CHARS:             `${ms.factsApi}/items/chars/{0}`,
  MARKET_SHARE:           `${ms.factsApi}/share`,
  INNOVATION_TYPE:        `${ms.factsApi}/innovationTypeShare`,
  ITEM_PERFORMANCE:       `${ms.factsApi}/performance`,
  INNOVATION_CHARACTERISTICS: `${ms.factsApi}/characteristics`,
  PROFILER_CONTEXT:       `${ms.factsApi}/context`,
  UPSERT_CONTEXT:         `${ms.factsApi}/context/upsert`,
  LX_SUBTYPES:            `${ms.factsApi}/innovationSubTypeShare`,

  GET_CONTEXT:            `${ms.factsApi}/context/{0}`,


  get(endpoint: string, pathParams?: string[]) {
    if (typeof endpoint !== 'string' || !Array.isArray(pathParams)) {
      return endpoint;
    }
    return endpoint.replace(/({\d})/g, function(i) {
      return pathParams[i.replace(/{/, '').replace(/}/, '')];
    });
  }
};
