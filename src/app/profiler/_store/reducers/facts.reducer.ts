import { PROFILER_ACTIONS } from '../profiler-actions';
import { StateUtil } from '../../../_store/state-util';
import { DATA_STATE } from '../../../_store/data-states';
import { TypeObject } from '../../../_store/types';

export interface FactsState {
  readonly factShare: TypeObject<any>;
}

const defaultFactsState: FactsState = {
  factShare: {
    data: {},
    state: DATA_STATE.INITIAL,
  },
};

export function factShareReducer(state = defaultFactsState, action) {
  switch (action.type) {
    case PROFILER_ACTIONS.GET_MARKET_SHARE_RESOLVING:
      return StateUtil.setResolving(state, 'factShare', {});

    case PROFILER_ACTIONS.GET_MARKET_SHARE_RESOLVED:
      return StateUtil.setResolved(state, 'factShare', action.payload.data);

    case PROFILER_ACTIONS.GET_MARKET_SHARE_ERROR:
      return StateUtil.setError(state, 'factShare', action.payload.data.status);

    case PROFILER_ACTIONS.GET_MARKET_SHARE_RESET_TO_INITIAL:
      return (state = defaultFactsState);

    default:
      return state;
  }
}
