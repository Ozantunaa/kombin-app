import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withDelay, withReanimatedTimer, withSpring, withTiming } from 'react-native-reanimated'
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/tr';
import firestore, { firebase } from '@react-native-firebase/firestore';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Swipable = ({ item }) => {
    const translateX = useSharedValue(0)
    const panGesture = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.startX = translateX.value;
        },
        onActive: (event, context) => {
            translateX.value = context.startX + event.translationX;
        },
        onEnd: (event) => {
            if (event.translationX > 40) {
                // Eğer sürükleme işlemi yeterince sağa yapılırsa kapat
                translateX.value = withSpring(0);
            } else {
                // Aksi takdirde açık pozisyonu koru
                translateX.value = withSpring(-70);
            }
        },

    })
    const rStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: withTiming(translateX.value, { duration: 0 }) // Açma ve kapatma işlemleri aynı hızda
        }]
    }))
    return (
        <GestureHandlerRootView style={{ flex: 2 }}>
            <PanGestureHandler onGestureEvent={panGesture}>
                <Animated.View style={[styles.swipableStyle, rStyle]}>
                    <View style={styles.open} />
                    <CircleTouchbable iconName={'a'} text={item.likes} />
                    <CircleTouchbable iconName={'b'} text={item.comments} />
                    <CircleTouchbable iconName={'c'} text={'Save'} />
                    <CircleTouchbable iconName={'d'} text={'200'} />
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    )
};
const CircleTouchbable = ({ iconName, text }) => {
    return (
        <TouchableOpacity style={styles.circleContainer}>
            <View style={styles.circle}>
                <Text>{iconName}</Text>
            </View>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
};



const PostCard = ({ item, onDelete,onPress }) => {
    const [showMore, setShowMore] = useState(false);
    const userInfo = useSelector(state => state.user.userInfo);
    const [userData, setUserData] = useState(null);
    const user = firebase.auth().currentUser;
    
    
    const maxCharCount = 100;
    
    // const message = showMore ? item.post : item.post.length <= maxCharCount ? item.post : item.post.slice(0, maxCharCount) + '...';
    const message = showMore ? item.post : (!item.post || item.post.length <= maxCharCount) ? item.post : item.post.slice(0, maxCharCount) + '...';
    
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };
    useEffect(() => {
     getUser();
    }, [])
    console.log(item,'???item');
    const getUser = async () => {
        await firestore()
          .collection('users')
          .doc(item.userId)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              console.log('User Data', documentSnapshot.data());
              setUserData(documentSnapshot.data());
            }
          })
      }

    return (
        <ImageBackground
            source={{ uri: item.postImg }}
            style={styles.postcard}
        >
            <Swipable item={item} />
            <View style={styles.postcardContent}>
                <View style={styles.bottomInfo}>
                    <View style={styles.senderTop}>
                        <Image style={styles.senderImage} source={{ uri:  userData ? userData.userImg : 'https://i.pinimg.com/originals/da/57/80/da5780f125af8ccbed7a84150e89fcad.png' }} />
                        <TouchableOpacity onPress={onPress}>
                        <Text style={styles.senderText}>{userData ? userData.name : 'Test'}</Text>
                        </TouchableOpacity>
                        {item.userId == userInfo?.user.id ? <Button onPress={() => onDelete(item.id)} title='sil' color={'red'} /> : null}
                        <Text>{moment(item.postTime.toDate()).locale('tr').fromNow()}</Text>
                    </View>
                    <View style={styles.senderBottom}>
                        <Text style={styles.messageText}>{message}</Text>
                        {item.post?.length > 100 && (
                            <TouchableOpacity onPress={toggleShowMore}>
                                <Text style={styles.showMoreText}>
                                    {showMore ? 'Kapat' : 'Devamı'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}

export default PostCard

const styles = StyleSheet.create({
    postcard: {
        width: width / 1.1, // Genişlik
        height: height / 1.5, // Yükseklik
        borderRadius: 28, // Kenar yuvarlama
        overflow: 'hidden', // İçerik sınırları kenarları kesmesin,
        marginBottom: 20,
    },
    postcardContent: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    bottomInfo: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 6
    },
    messageText: {
        fontSize: 16,
        color: 'white',
    },
    senderText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8
    },
    senderImage: {
        width: 46,
        height: 46,
        borderRadius: 99
    },
    senderTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 10
    },
    senderBottom: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10,
        width: 310,
    },
    showMoreText: {
        color: 'white',
        textDecorationLine: 'underline',
        marginTop: 8,
    },
    swipableStyle: {
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
        width: 100,
        height: 320,
        position: 'absolute',
        right: -80,
        top: height / 18,
        borderTopLeftRadius: 28,
        borderBottomLeftRadius: 28,
        justifyContent: 'center',
    },
    open: {
        backgroundColor: 'white',
        width: 6,
        height: 35,
        position: 'absolute',
        borderRadius: 10,
        marginLeft: 6
    },
    circleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    text: {
        fontSize: 10,
        color: 'white'
    },
})