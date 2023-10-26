import { useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, TouchableOpacity, SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo } from '../store/userSlice';
import firestore from '@react-native-firebase/firestore';
import PostCard from '../components/PostCard';

const ProfileScreen = ({ navigation, route }) => {
  const userInfo = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut()
      dispatch(clearUserInfo())
    } catch (error) {
    }
  };
  const fetchPosts = async () => {
    try {
      const list = [];
      await firestore()
        .collection('posts')
        .where('userId', '==', userInfo.user.id)
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          // console.log('Total posts', querySnapshot.size);
          querySnapshot.forEach(doc => {
            const { userId, post, postImg, postTime, likes, comments } = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: 'Test name',
              userImg: 'https://i.pinimg.com/originals/da/57/80/da5780f125af8ccbed7a84150e89fcad.png',
              postTime: postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            })
          })
        })
      console.log('POSTS', list);
      setPosts(list)
      if (loading) {
        setLoading(false);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'Gönderiler yüklenirken bir hata meydana geldi.');
    }
  }
  const handleDelete = () => {

  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
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
        <Text style={styles.descriptionText}>Bu kısım kullanıcı ile ilgili bilgilerin vs olduğu kısım olcaktır. sonrasına bakacağız.</Text>
        {route.params ? (
          <View style={styles.userButtonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>Mesaj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <Text style={styles.buttonText}>Takip Et</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.userButtonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('EditProfileScreen')}}>
              <Text style={styles.buttonText}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {handleSignOut() }}>
              <Text style={styles.buttonText}>Çıkış yap</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.box}>
          <Text style={styles.contentTitle}>22</Text>
          <Text style={styles.contentDescription}>Posts</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.contentTitle}>10.000</Text>
          <Text style={styles.contentDescription}>Followers</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.contentTitle}>100</Text>
          <Text style={styles.contentDescription}>Following</Text>
        </View>
      </View>
      {posts.map((item) => (
        <PostCard
          key={item.id}
          item={item}
          onDelete={handleDelete}
        />
      ))}
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 50,

  },
  profilePhoto: {
    width: 130,
    height: 130,
    backgroundColor: 'red',
    borderRadius: 100,
    marginBottom: 10
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10

  },
  descriptionText: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  userButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%'
  },
  button: {
    backgroundColor: 'black',
    padding: 8,
    alignItems: 'center',
    borderRadius: 10,
    margin: 4,
    flex: 1
  },
  buttonText: {
    color: 'white',
    fontWeight: '800'
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  contentTitle: {
    color: 'black',
    fontWeight: '800'
  },
  contentDescription: {
    color: 'black',
  }
})