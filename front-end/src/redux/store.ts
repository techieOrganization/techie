import { createStore, combineReducers } from 'redux';

import { authReducer } from './reducer';
import { AuthState } from './types';

export type RootState = {
  auth: AuthState;
};
export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer);

export default store;
