import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo } from '../store/userSlice';

const Settings = () => {
  const userInfo = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut()
      dispatch(clearUserInfo())
    } catch (error) {
    }
  };
 
  return (
    <ScrollView>
    <View style={styles.headerContainer}>
      {userInfo?.user?.photo && (
        <Image
          style={styles.profilePhoto}
          source={{ uri: userInfo.user.photo }}
        />
      )}
      {userInfo?.user?.givenName && (
        <Text style={styles.nameText}>{userInfo.user.givenName}</Text>
      )}
      <Pressable style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </Pressable>
    </View>
    <TouchableOpacity  onPress={handleSignOut}>
      <Text>Sign Out</Text>
    </TouchableOpacity>
  </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50

  },
  profilePhoto: {
    width: 160,
    height: 160,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  nameText: {
    fontSize: 22,
    marginVertical: 14,
    fontWeight: '900'
  },
  editButton: {
    backgroundColor: 'black',
    padding: 14,
    width: '90%',
    alignItems: 'center',
    borderRadius: 10
  },
  editButtonText: {
    color: 'white',
    fontWeight: '800'
  }
})