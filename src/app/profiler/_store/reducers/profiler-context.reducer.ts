import { PROFILER_ACTIONS } from '../profiler-actions';
import { StateUtil } from '../../../_store/state-util';
import { DATA_STATE } from '../../../_store/data-states';
import { TypeAny, TypeObject } from '../../../_store/types';


export interface ProfilerContextState {
  readonly contextId: TypeAny;
  readonly datasetMetadata: TypeObject<any>;
  readonly datasetMetadataDefaults: any;
  readonly datasets: any;
  readonly contextDetails: any;
}

export const defaultProfilerContextState: ProfilerContextState = {
  contextId: {
    state: DATA_STATE.INITIAL,
    data: undefined,
  },
  datasetMetadata: {
    state: DATA_STATE.INITIAL,
    data: {},
  },
  datasetMetadataDefaults: {},
  datasets: {},
  contextDetails: {},
};

export function profilerContextReducer(state = defaultProfilerContextState, action) {
  switch (action.type) {
    case PROFILER_ACTIONS.GET_DATASET_METADATA_RESOLVED:
      const data = action.payload.data;
      const datasetMetadata = Array.isArray(data) && data.length ? data[0] : {};
      return StateUtil.setResolved(state, 'datasetMetadata', datasetMetadata);

    case PROFILER_ACTIONS.GET_DATASET_METADATA_RESOLVING:
      return StateUtil.setResolving(state, 'datasetMetadata', {});

    case PROFILER_ACTIONS.GET_DATASET_METADATA_ERROR:
      return StateUtil.setError(state, 'datasetMetadata', action.payload.data.status);

    case PROFILER_ACTIONS.GET_CONTEXT_RESOLVED:
      return StateUtil.setResolved(state, 'contextDetails', action.payload.data);

    case PROFILER_ACTIONS.GET_CONTEXT_RESOLVING:
      return StateUtil.setResolving(state, 'contextDetails', {});

    case PROFILER_ACTIONS.GET_CONTEXT_ERROR:
      state = StateUtil.setError(state, 'contextDetails', action.payload.data.status);
      return StateUtil.setError(state, 'contextId', action.payload.data.status);

    case PROFILER_ACTIONS.SET_PROFILER_CONTEXT:
      return StateUtil.setResolved(state, 'contextDetails', action.payload.data);

    case PROFILER_ACTIONS.SET_CONTEXT_ID:
      return StateUtil.setResolved(state, 'contextId', action.payload.data);

    case PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_RESOLVED:
      state = StateUtil.setResolved(state, 'contextId', action.payload.data.id);
      return StateUtil.setResolved(state, 'contextDetails', action.payload.data);

    case PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_RESOLVING:
      return StateUtil.setResolving(state, 'contextId', {});

    case PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_ERROR:
      return StateUtil.setError(state, 'contextId', action.payload.data.status);

    case PROFILER_ACTIONS.CLEAR_STORE:
      return (state = defaultProfilerContextState);

    default:
      return state;
  }
}
