import { PROFILER_ACTIONS } from '../profiler-actions';
import { StateUtil } from '../../../_store/state-util';
import { DATA_STATE } from '../../../_store/data-states';
import { TypeArray } from '../../../_store/types';

export interface ItemDetailsState {
  itemDetails: TypeArray<any>;
  itemPictures: TypeArray<any>;
  itemCharacteristics: TypeArray<any>;
}

const defaultItemDetailsState: ItemDetailsState = {
  itemDetails: {
    data: [],
    state: DATA_STATE.INITIAL,
  },
  itemPictures: {
    data: [],
    state: DATA_STATE.INITIAL,
  },
  itemCharacteristics: {
    data: [],
    state: DATA_STATE.INITIAL,
  },
};

export function itemDetailsReducer(state = defaultItemDetailsState, action) {
  switch (action.type) {
    case PROFILER_ACTIONS.GET_ITEM_DETAILS_RESOLVING:
      return StateUtil.setResolving(state, 'itemDetails', []);

    case PROFILER_ACTIONS.GET_ITEM_DETAILS_RESOLVED:
      return StateUtil.setResolved(state, 'itemDetails', action.payload.data);

    case PROFILER_ACTIONS.GET_ITEM_DETAILS_ERROR:
      return StateUtil.setError(state, 'itemDetails', action.payload.data.status);

    case PROFILER_ACTIONS.GET_ITEM_DETAILS_EMPTY:
      return StateUtil.setEmpty(state, 'itemDetails', 'Details are not available for this item');

    case PROFILER_ACTIONS.GET_ITEM_PICTURES_RESOLVING:
      return StateUtil.setResolving(state, 'itemPictures', []);

    case PROFILER_ACTIONS.GET_ITEM_PICTURES_RESOLVED:
      return StateUtil.setResolved(state, 'itemPictures', action.payload.data);

    case PROFILER_ACTIONS.GET_ITEM_PICTURES_ERROR:
      return StateUtil.setError(state, 'itemPictures', action.payload.data.status);

    case PROFILER_ACTIONS.GET_ITEM_PICTURES_EMPTY:
      return StateUtil.setEmpty(state, 'itemPictures', 'Images are not available for this item');

    case PROFILER_ACTIONS.GET_ITEM_CHARACTERISTICS_RESOLVED:
      return StateUtil.setResolved(state, 'itemCharacteristics', action.payload.data);

    case PROFILER_ACTIONS.GET_ITEM_CHARACTERISTICS_ERROR:
      return StateUtil.setError(state, 'itemCharacteristics', action.payload.data.status);

    case PROFILER_ACTIONS.GET_ITEM_CHARACTERISTICS_EMPTY:
      return StateUtil.setEmpty(state, 'itemCharacteristics', 'Characteristics are not available for this item  ');

    default:
      return state;
  }
}
