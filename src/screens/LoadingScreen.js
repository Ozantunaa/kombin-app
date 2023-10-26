import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native'

const LoadingScreen = () => {
  return (
    <View style={styles.loadinContainer}>
      <StatusBar barStyle={'light-content'}/>
      <ActivityIndicator size={'large'} color={'orange'} />
    </View>
  )
}

export default LoadingScreen
const styles = StyleSheet.create({
  loadinContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  }
})