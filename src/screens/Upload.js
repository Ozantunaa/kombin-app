import { useState } from 'react';
import { Alert, Button, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


const Upload = () => {
  const [selectImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [postText, setpostText] = useState(null)

  const userInfo = useSelector(state => state.user.userInfo);

  const openImagePicker = () => {
    let options = {
      storageOptions: {
        path: "image",

      }
    }
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Image selection was canceled');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        // Eğer bir hata yoksa, seçilen resmi işle
        setSelectedImage(response.assets[0].uri);
      }
    });
    
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log(imageUrl, 'IMAGE URL');
    firestore()
      .collection('posts')
      .add({
        userId: userInfo.user.id,
        post: postText,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      }).then(() => {
        console.log('Gönderi oluşturuldu.');
        setpostText(null)
      }).catch((error) => {
        console.log('Gönderi oluşturulurken bir hata meydana geldi.', error);
      })
  };

  const uploadImage = async () => {
    const uploadUri = selectImage;
    let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    setUploading(true);
    setTransferred(0);
    const storageRef = storage().ref(`/photos/${fileName}`)
    const task = storageRef.putFile(uploadUri);
    // Set transferred procces
    task.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100)
      )
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL()
      setUploading(false);
      Alert.alert(
        'Görsel başarıyla yüklendi!',
        'Kominin paylaşıldı'
      )
      setSelectedImage(null);
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.selectImageContainer}>
        {selectImage == null ? <Text>Bir kombin seç ve paylaş!</Text> :
          <>
            <Image style={{ width: '100%', height: 500, marginTop: 10 }} resizeMode='contain' source={{ uri: selectImage }} />
            <TextInput
              placeholder='Kombinin için bir açıklama yaz'
              onChangeText={(text) => setpostText(text)}
              value={postText}
            />
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