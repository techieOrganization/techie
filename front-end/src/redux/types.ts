export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

interface Login {
  type: typeof LOGIN;
  payload: string;
}

interface Logout {
  type: typeof LOGOUT;
}

export type AuthActionTypes = Login | Logout;

export interface AuthState {
  sessionId: string | null;
}
