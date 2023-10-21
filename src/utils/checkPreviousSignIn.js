import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const checkPreviousSignIn = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      const userInfo = await GoogleSignin.signInSilently();
      const idToken = userInfo.idToken;

      // Firebase'e geçiş yaparken Google ID Token'ını kullan
      const credential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(credential);

      return userInfo;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
