import { factShareReducer } from './reducers/facts.reducer';
import { profilerContextReducer } from './reducers/profiler-context.reducer';
import { itemDetailsReducer } from './reducers/item-details.reducer';
import { lxSubTypesReducer } from './reducers/innovation-subtypes.reducer';
import { innovationCharacteristicsReducer } from './reducers/innovation-characteristics.reducer';
import { innovationTypesReducer } from './reducers/innovation-types.reducer';
import { innovationItemsReducer } from './reducers/innovation-items.reducer';


export const profilerReducers = {
  MARKET_SHARE:               factShareReducer,
  INNOVATION_TYPE:            innovationTypesReducer,
  INNOVATION_CHARACTERISTICS: innovationCharacteristicsReducer,
  PROFILER_CONTEXT:           profilerContextReducer,
  ITEMS:                      innovationItemsReducer,
  ITEM_DETAILS:               itemDetailsReducer,
  LX_SUBTYPES:                lxSubTypesReducer
};

export const PROFILE_REDUCERS = {
  MARKET_SHARE: 'MARKET_SHARE',
  INNOVATION_TYPE: 'INNOVATION_TYPE',
  LX_SUBTYPES: 'LX_SUBTYPES',
  INNOVATION_CHARACTERISTICS: 'INNOVATION_CHARACTERISTICS',
  PROFILER:     'PROFILER_CONTEXT',
  ITEMS: 'ITEMS',
  ITEM_DETAILS: 'ITEM_DETAILS',
};
