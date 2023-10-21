import { createSlice } from '@reduxjs/toolkit';
import { configureGoogleSignIn, signInWithGoogle } from '../utils/googleSignIn';

const initialState = {
  userInfo: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export const signInWithGoogleAsync = () => async (dispatch) => {
    try {
        configureGoogleSignIn();
        const userInfo = await signInWithGoogle();
        dispatch(setUserInfo(userInfo));
    } catch (error) {
        console.error('Error while signing in with Google:', error);
    }
};

export default userSlice.reducer;
