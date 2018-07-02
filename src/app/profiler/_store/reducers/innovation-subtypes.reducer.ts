import { PROFILER_ACTIONS } from '../profiler-actions';
import { StateUtil } from '../../../_store/state-util';
import { TypeObject } from '../../../_store/types';
import { DATA_STATE } from '../../../_store/data-states';

export interface InnovationSubtypesState {
  readonly lxSubtypes: TypeObject<any>;
}

const defaultInnovationSubtypesState: InnovationSubtypesState = {
  lxSubtypes: {
    data: {},
    state: DATA_STATE.INITIAL,
  },
};

export function lxSubTypesReducer(state = defaultInnovationSubtypesState, action) {
  switch (action.type) {
    case PROFILER_ACTIONS.GET_LX_SUBTYPES:
      return StateUtil.setResolving(state, 'lxSubtypes', {});

    case PROFILER_ACTIONS.GET_LX_SUBTYPES_RESOLVED:
      return StateUtil.setResolved(state, 'lxSubtypes', action.payload.data);

    case PROFILER_ACTIONS.GET_LX_SUBTYPES_ERROR:
      return StateUtil.setError(state, 'lxSubtypes', action.payload.data.status);

    case PROFILER_ACTIONS.GET_LX_SUBTYPES_EMPTY:
      return StateUtil.setEmpty(state, 'lxSubtypes', 'Characteristics are not available for this item  ');

    case PROFILER_ACTIONS.GET_LX_SUBTYPES_RESET_TO_INITIAL:
      return (state = defaultInnovationSubtypesState);

    default:
      return state;

  }
}
