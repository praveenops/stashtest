import { DASHBOARD_ACTIONS } from '../dashboard-actions';
import { StateUtil } from '../../../_store/state-util';
import { TypeNumber, TypeString } from '../../../_store/types';
import { DATA_STATE } from '../../../_store/data-states';

export interface DatasetUserPreferenceState {
  country: TypeString;
  category: TypeNumber;
}

const defaultDatasetUserPreferenceState: DatasetUserPreferenceState = {
  country: {
    state: DATA_STATE.INITIAL,
    data: ''
  },
  category: {
    state: DATA_STATE.INITIAL,
    data: NaN,
  },
};


export function UserPreferencesReducers(state = defaultDatasetUserPreferenceState, action) {
  switch (action.type) {
    case DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE_RESOLVED:
    case DASHBOARD_ACTIONS.SAVE_USER_PREFERENCE_RESOLVED:
      if (action.payload.data.success) {
        state = StateUtil.setResolved(state, 'country',
          action.payload.data.userDetails.profiler.country
        );
        return StateUtil.setResolved(state, 'category',
          action.payload.data.userDetails.profiler.contextId
        );
      } else {
        state = StateUtil.setResolved(state, 'country', '');
        return StateUtil.setResolved(state, 'category', NaN);
      }
    case DASHBOARD_ACTIONS.SAVE_USER_PREFERENCE_ERROR:
      if (!action.payload.data.status) {
        state = StateUtil.setError(state, 'country', action.payload.data.status);
        return StateUtil.setError(state, 'category', action.payload.data.status);
      } else {
        return state;
      }

    case DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE_ERROR:
      state = StateUtil.setError(state, 'country', action.payload.data.status);
      return StateUtil.setError(state, 'category', action.payload.data.status);

    case DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE_RESOLVING:
      state = StateUtil.setResolving(state, 'country', '');
      return StateUtil.setResolving(state, 'category', NaN);

    default:
      return state;
  }
}
