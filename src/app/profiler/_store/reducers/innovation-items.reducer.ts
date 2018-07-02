import { TypeObject} from '../../../_store/types';
import { DATA_STATE } from '../../../_store/data-states';
import { PROFILER_ACTIONS } from '../profiler-actions';
import { StateUtil } from '../../../_store/state-util';

export interface InnovationItemsState {
  readonly innovationItems: TypeObject<any>;
}

const defaultInnovationItemsState: InnovationItemsState = {
  innovationItems: {
    state: DATA_STATE.INITIAL,
    data: {}
  },
};

export function innovationItemsReducer(state = defaultInnovationItemsState, action) {
  switch (action.type) {
    case PROFILER_ACTIONS.GET_INNOVATION_ITEMS_RESOLVING:
      return StateUtil.setResolving(state, 'innovationItems', {});

    case PROFILER_ACTIONS.GET_INNOVATION_ITEMS_RESOLVED:
      return StateUtil.setResolved(state, 'innovationItems', action.payload.data);

    case PROFILER_ACTIONS.GET_INNOVATION_ITEMS_ERROR:
      return StateUtil.setError(state, 'innovationItems', action.payload.data.status);

    default:
      return state;
  }
}
