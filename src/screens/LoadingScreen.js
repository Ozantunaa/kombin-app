import { View, Text, ActivityIndicator } from 'react-native'

const LoadingScreen = () => {
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
    <ActivityIndicator size={'large'} color={'orange'}/>
    </View>
  )
}

export default LoadingScreen