import { DataSetMappingReducers } from './reducers/dataset-mapping.reducer';
import { UserPreferencesReducers } from './reducers/user-preferences.reducer';

export const dashboardReducers = {
  DATA_SET_MAPPING: DataSetMappingReducers,
  USER_PREFERENCES: UserPreferencesReducers,
};

export const DASHBOARD_REDUCERS = {
  DATA_SET_MAPPING: 'DATA_SET_MAPPING',
  USER_PREFERENCES: 'USER_PREFERENCES',
};
