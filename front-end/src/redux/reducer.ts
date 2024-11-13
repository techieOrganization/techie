import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserInfo } from '@/types/userInfo';

interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
}

const initialState: UserState = {
  userInfo: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.token = null;
    },
  },
});

export const { setUserInfo, setToken, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
