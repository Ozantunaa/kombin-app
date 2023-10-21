import { useState } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Upload = () => {
  const [selectImage, setSelectedImage] = useState('')

  const ImagePicker = () => {

    let options = {
      storageOptions: {
        path: "image",

      }
    }
    launchImageLibrary(options, response => {
      setSelectedImage(response.assets[0].uri)
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.selectImageContainer}>
        {selectImage == '' ? <Text>Bir kombin seç ve paylaş!</Text> :
          <>
            <Image style={{ width: '100%', height: 500, marginTop: 10 }} resizeMode='contain' source={{ uri: selectImage }} />
            <TextInput placeholder='Kombinin için bir açıklama yaz' />
          </>

        }
        <Button title={selectImage == '' ? 'Fotoğraf seç' : 'Fotoğrafı değiştir'} onPress={ImagePicker} />
      </View>
    </ScrollView>
  )
}

export default Upload

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
})