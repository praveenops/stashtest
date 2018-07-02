import { DASHBOARD_ACTIONS } from '../dashboard-actions';
import { COUNTRY_NAME } from '../../../shared/constants/countries-constant';
import { StateUtil } from '../../../_store/state-util';
import { TypeArray, TypeObject, TypeBoolean } from '../../../_store/types';
import { DATA_STATE } from '../../../_store/data-states';

export interface DatasetState {
  readonly countries: TypeArray<any>;
  readonly countryCategoriesMap: TypeObject<any>;
}

const defaultDatasetState: DatasetState = {
  countries: {
    state: DATA_STATE.INITIAL,
    data: []
  },
  countryCategoriesMap: {
    state: DATA_STATE.INITIAL,
    data: {}
  },

};


export function DataSetMappingReducers(state = defaultDatasetState, action) {
  switch (action.type) {
    case DASHBOARD_ACTIONS.FETCH_DATASETS_RESOLVED:
      const countries = action.payload.data
                              .map(c => ({name: COUNTRY_NAME[c.country], value: c.country}))
                              .sort((c1, c2) => c1.name > c2.name);
      const categories = action.payload.data
                               .map(e => ({[e.country]: e.datasets}))
                               .reduce((prev, curr) => Object.assign(prev, curr), {});
      state = StateUtil.setResolved(state, 'countryCategoriesMap', categories);
      return StateUtil.setResolved(state, 'countries', countries);

    case DASHBOARD_ACTIONS.FETCH_DATASETS_ERROR:
      state = StateUtil.setError(state, 'countryCategoriesMap', action.payload.data.status);
      return StateUtil.setError(state, 'countries', action.payload.data.status);

    case DASHBOARD_ACTIONS.FETCH_DATASETS_RESOLVING:
      state = StateUtil.setResolving(state, 'countryCategoriesMap', {});
      return StateUtil.setResolving(state, 'countries', []);

    default:
      return state;
  }
}
