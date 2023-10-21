import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const width = Dimensions.get('window').width;

const AnimatedHeader = ({ scrollY }) => {
  
  const headerStyles = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, 200], [44, 0], Extrapolation.CLAMP),
      marginBottom: interpolate(scrollY.value, [0, 200], [10, 5], Extrapolation.CLAMP),
    };
  });

  const textStyles = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(scrollY.value, [0, 200], [24, 16], Extrapolation.CLAMP),
      alignSelf: 'center',
      marginTop: interpolate(scrollY.value, [0, 100, 200], [10, 10, 5], Extrapolation.CLAMP),
     // marginLeft: interpolate(scrollY.value, [0, 100, 200], [0, -width / 2, -width / 2], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={[styles.header, headerStyles]}>
      <Animated.Text style={[styles.headerText, textStyles]}>Uygulama adı</Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomWidth:0.5,
    borderColor:'teal'
  },
  headerText: {
    color: 'black',
    alignSelf:'flex-start'
  },
});

export default AnimatedHeader;
