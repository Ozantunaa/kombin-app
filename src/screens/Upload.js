import { useState } from 'react';
import { Alert, Button, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const Upload = () => {
  const [selectImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);



  const openImagePicker = () => {
    let options = {
      storageOptions: {
        path: "image",

      }
    }
    launchImageLibrary(options, response => {
      setSelectedImage(response.assets[0].uri)
    });
  };
  const submitPost = async () => {
    const uploadUri = selectImage;
    let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(fileName).putFile(uploadUri);
    // Set transferred procces
    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100)
      )
    });

    try {
      await task;
      setUploading(false);
      Alert.alert(
        'Görsel başarıyla yüklendi!',
        'Kominin paylaşıldı'
      )
    } catch (error) {
      console.log(error);
    }
    setSelectedImage(null);
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.selectImageContainer}>
        {selectImage == null ? <Text>Bir kombin seç ve paylaş!</Text> :
          <>
            <Image style={{ width: '100%', height: 500, marginTop: 10 }} resizeMode='contain' source={{ uri: selectImage }} />
            <TextInput placeholder='Kombinin için bir açıklama yaz' />
          </>

        }
        <Button title={selectImage == null ? 'Fotoğraf seç' : 'Fotoğrafı değiştir'} onPress={() => openImagePicker()} />
        {uploading && <Text>{transferred} % Yükleniyor</Text>}
        {selectImage && <Button title='Paylaş' color={'green'} onPress={() => submitPost()} />}
      </View>
    </ScrollView>
  )
}

export default Upload

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  selectImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
})