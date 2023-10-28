import { createSlice } from '@reduxjs/toolkit';
import { configureGoogleSignIn, signInWithGoogle } from '../utils/googleSignIn';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
    const userInfo = await signInWithGoogle()
      .then(() => {
        firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .set({
            name: '',
            email: auth().currentUser.email,
            createdAt:firestore.Timestamp.fromDate(new Date()),
            userImg:null,
          })
          .catch(error=>{
            console.log(error,'Kullanıcı eklenirken bir hata meydana geldi')
          })
      })
    dispatch(setUserInfo(userInfo));
  } catch (error) {
    console.error('Error while signing in with Google:', error);
  }
};

export default userSlice.reducer;
