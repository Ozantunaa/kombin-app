import React, { useEffect, useState, useCallback } from 'react';
import { Alert, RefreshControl, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PostCard from '../components/PostCard';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Posts = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    postTime: '4 mins ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-1.jpg'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    postTime: '2 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-3.jpg'),
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    postTime: '1 hours ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.Hey there, this is my test for a post of my social app in React Native.Hey there, this is my test for a post of my social app in React Native.Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-2.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    postTime: '1 day ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-4.jpg'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-6.jpg'),
    postTime: '2 days ago',
    post:
      'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-4.jpg'),
    liked: false,
    likes: '0',
    comments: '0',
  },
];
const Discover = ({ navigation }) => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [])

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
  }, [deleted])

  const fetchPosts = async () => {
    try {
      const list = [];
      await firestore()
        .collection('posts')
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
      //console.log('POSTS', list);
      setPosts(list)
      if (loading) {
        setLoading(false);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error, 'Gönderiler yüklenirken bir hata meydana geldi.');
    }
  }
  const handleDelete = (postId) => {
    Alert.alert(
      'Gönderiyi Sil',
      'Silmek istediğine emin misin?',
      [
        {
          text: 'Vazgeç',
          onPress: () => console.log('Vazgeçildi')
        },
        {
          text: 'Sil',
          onPress: () => deletePost(postId)
        }
      ],
      { cancelable: false }
    )
  }
  const deletePost = (postId) => {
    firestore().collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const { postImg } = documentSnapshot.data();
          if (postImg !== null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);
            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted succesfully!`);
                deleteFirestoreData(postId);
                setDeleted(true);
              })
              .catch((error) => {
                console.log(error, 'error while deleting image');
              })
          }
          /* Post image yoksa burası çalışır */
        } else {
          deleteFirestoreData(postId);
        }
      })
  };
  const deleteFirestoreData = (postId) => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Başarıyla silindi!!',
          'Paylaşım silindi'
        )
      }).catch(error => console.log(error, 'post silinirken hata meydana geldi!'))
  }

  const onRefresh = useCallback(() => {
    fetchPosts()
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <>
      <FlatList
        data={posts}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <PostCard
            onPress={() => navigation.navigate('DiscoverProfile', { userId: item.userId })}
            item={item} onDelete={handleDelete} />)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />


    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
    paddingBottom: 50
  },
});

export default Discover;
