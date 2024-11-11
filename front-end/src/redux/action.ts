export const login = (sessionId: string) => ({
  type: 'LOGIN',
  payload: sessionId,
});

export const logout = () => ({
  type: 'LOGOUT',
});
