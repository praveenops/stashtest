import { PROFILER_ACTIONS } from '../profiler-actions';
import { StateUtil } from '../../../_store/state-util';
import { TypeObject } from '../../../_store/types';
import { DATA_STATE } from '../../../_store/data-states';

export interface InnovationCharacteristicsState {
  readonly innovationCharacteristics: TypeObject<any>;
}

const defaultInnovationCharacteristicsState: InnovationCharacteristicsState = {
  innovationCharacteristics: {
    data: [],
      state: DATA_STATE.INITIAL,
  },
};

export function innovationCharacteristicsReducer(state = defaultInnovationCharacteristicsState, action) {
  switch (action.type) {
    case PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS:
      return StateUtil.setResolving(state, 'innovationCharacteristics', {});

    case PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_RESOLVED:
      return StateUtil.setResolved(state, 'innovationCharacteristics', action.payload.data);

    case PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_ERROR:
      return StateUtil.setError(state, 'innovationCharacteristics', action.payload.data.status);

    case PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_EMPTY:
      return StateUtil.setEmpty(state, 'innovationCharacteristics', 'Details are not available for this item');

    case PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_RESET_TO_INITIAL:
      return (state = defaultInnovationCharacteristicsState);

    default:
      return state;
  }
}
