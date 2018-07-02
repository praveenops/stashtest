import { environment } from '../../environments/environment';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromRouter from '@ngrx/router-store';

// console.log all actions
// export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
//   return function(state: any, action: any): any {
//     // console.log('state', state);
//     console.log('action', action);
//
//     return reducer(state, action);
//   };
// }

export const rootReducers: ActionReducerMap<any> = {
  router: fromRouter.routerReducer,
  // logger,
};


/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze] // should be [storeFreeze]
  : [];
