import { PROFILER_ACTIONS } from '../profiler-actions';
import { StateUtil } from '../../../_store/state-util';
import { TypeObject } from '../../../_store/types';
import { DATA_STATE } from '../../../_store/data-states';

export interface InnovationTypesState {
  readonly innovationType: TypeObject<any>;
}

const defaultInnovationTypesState: InnovationTypesState = {
  innovationType: {
    data: {},
    state: DATA_STATE.INITIAL,
  },
};

export function innovationTypesReducer(state = defaultInnovationTypesState, action) {
  switch (action.type) {
    case PROFILER_ACTIONS.GET_INNOVATION_TYPE:
      return StateUtil.setResolving(state, 'innovationType', {});

    case PROFILER_ACTIONS.GET_INNOVATION_TYPE_RESOLVED:
      return StateUtil.setResolved(state, 'innovationType', action.payload.data);

    case PROFILER_ACTIONS.GET_INNOVATION_TYPE_ERROR:
      return StateUtil.setError(state, 'innovationType', action.payload.data.status);

    case PROFILER_ACTIONS.GET_INNOVATION_TYPE_RESET_TO_INITIAL:
      return (state = defaultInnovationTypesState);

    default:
      return state;
  }
}
