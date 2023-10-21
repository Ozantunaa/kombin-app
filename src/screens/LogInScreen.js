
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import { signInWithGoogleAsync } from '../store/userSlice';

const LogInScreen = () => {
    const dispatch = useDispatch();

    const handleGoogleSignIn = async () => {
        dispatch(signInWithGoogleAsync());
    };

    const animatedValue = new Animated.Value(0);

    Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
    }).start();

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.logoContainer, { transform: [{ translateY }] }]}>
                <Image source={{ uri: 'https://i.pinimg.com/originals/da/57/80/da5780f125af8ccbed7a84150e89fcad.png' }} style={styles.logo} />
                <Text style={styles.logoText}>Uygulama Adı</Text>
            </Animated.View>
            <TouchableOpacity
                onPress={() => {
                    handleGoogleSignIn()
                }}
                style={styles.googleButton}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} style={styles.googleLogo} />
                <Text style={styles.signinText}>Google ile giriş yap</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    googleLogo: {
        width: 25,
        height: 25,
        marginRight: 10

    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    signinText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 18
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
        padding: 16,
        borderRadius: 99,
        backgroundColor: 'white'
    },
});

export default LogInScreen;
