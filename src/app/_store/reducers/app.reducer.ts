import { TypeAny, TypeObject, TypeBoolean } from '../types';
import { DATA_STATE } from '../data-states';
import { APP_ACTIONS } from '../app-actions';
import { StateUtil } from '../state-util';

export interface AppState {
  readonly brandBar: TypeObject<any>;
  readonly profilerDataSet: TypeAny;
  readonly profilerContext: TypeAny;
  readonly featureToggles: TypeObject<any>;
  readonly splashScreen: TypeBoolean;
}

export const defaultAppState: AppState = {
  brandBar: {
    state: DATA_STATE.INITIAL,
    data: {
      title: ''
    },
  },
  profilerDataSet: {
    state: DATA_STATE.INITIAL,
    data: undefined,
  },
  profilerContext: {
    state: DATA_STATE.INITIAL,
    data: undefined,
  },
  featureToggles: {
    state: DATA_STATE.INITIAL,
    data: {},
  },
  // TODO: should be removed once we remove the splash screen
  splashScreen: {
    state: DATA_STATE.INITIAL,
    data: false
  }
};

export function AppReducer(state = defaultAppState, action) {
  switch (action.type) {
    case APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE:
      return StateUtil.setResolved(state, 'brandBar', action.payload.data);

    case APP_ACTIONS.GET_FEATURE_TOGGLES_RESOLVING:
      return StateUtil.setResolving(state, 'featureToggles', {});

    case APP_ACTIONS.GET_FEATURE_TOGGLES_ERROR:
      return StateUtil.setError(state, 'featureToggles');

    case APP_ACTIONS.GET_FEATURE_TOGGLES_EMPTY:
      return StateUtil.setEmpty(state, 'featureToggles');

    case APP_ACTIONS.GET_FEATURE_TOGGLES_RESOLVED:
      return StateUtil.setResolved(state, 'featureToggles', action.payload.data || {});

    case APP_ACTIONS.UPDATE_DATA_SET:
      return StateUtil.setResolved(state, 'profilerDataSet', action.payload.data);

    // TODO: should be removed once we remove the splash screen
    case APP_ACTIONS.SHOW_SPLASH_SCREEN:
      return StateUtil.setResolved(state, 'splashScreen', true);

    default:
      return state;
  }
}
