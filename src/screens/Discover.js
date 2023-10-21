import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PostCard from '../components/PostCard';

const Discover = () => {
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


  return (
    <>
      <FlatList
        data={Posts}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <PostCard
            item={item} />)}
      />


    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    marginTop:50,
    paddingBottom:50
  },
});

export default Discover;
