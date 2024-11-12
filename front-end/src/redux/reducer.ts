import { AuthActionTypes, AuthState, LOGIN, LOGOUT } from './types';

const initState = {
  sessionId: null,
};

export const authReducer = (state = initState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        sessionId: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        sessionId: null,
      };
    default:
      return state;
  }
};
