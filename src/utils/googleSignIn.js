import {
    GoogleSignin,
    statusCodes,
  } from '@react-native-google-signin/google-signin';

  export const configureGoogleSignIn = () => {
      GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
          webClientId: '229086756101-h4g8e8dopm74dnua9o3gmocdmjlr5uuv.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
          offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
          hostedDomain: '', // specifies a hosted domain restriction
          forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
          accountName: '', // [Android] specifies an account name on the device that should be used
          iosClientId: '229086756101-o7ptftoo22r5p9gj24lk2eruog5dag3k.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
          googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
          openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
          profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
        });
  }

  export const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (error) {
      throw error;
    }
  };