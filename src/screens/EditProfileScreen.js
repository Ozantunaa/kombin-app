import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import BottomSheet from '@gorhom/bottom-sheet';

import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useSelector } from 'react-redux';

const EditProfileScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const userInfo = useSelector(state => state.user.userInfo);
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '30%'], []);

  useEffect(() => {
    getUser();
  }, []);
  const user = firebase.auth().currentUser;

  const getUser = async () => {
    const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      })
  }

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl == null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        name: userData.name,
        about: userData.about,
        userImg: imgUrl,
      })
      .then(() => {
        console.log('User Updated!');
        Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully.'
        );
      })
  }
  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

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
        setImage(response.assets[0].uri);
      }
    });

  };


  renderInner = () => (
    <View style={styles.panel}>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={openImagePicker}>
        <Text style={styles.panelButtonTitle}>Galeriden bir fotoğraf seç</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => { handleTogglePress() }}>
        <Text style={styles.panelButtonTitle}>Vazgeç</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSheetChange = (isOpen) => {
    setIsOpen(isOpen);
  };

  // callbacks
  const handleTogglePress = useCallback(() => {
    if (isOpen) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.expand();
      Keyboard.dismiss()
    }
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <View style={styles.container}>
      <View
        style={{
          margin: 20,
        }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => handleTogglePress()}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={{
                  uri: image
                    ? image
                    : userData
                      ? userData.userImg ||
                      'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                      : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                }}
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 50 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
            {userData ? userData.name : ''}
          </Text>
          {/* <Text>{user.uid}</Text> */}
        </View>

        <View style={styles.action}>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.name : ''}
            onChangeText={(txt) => setUserData({ ...userData, name: txt })}
            style={styles.textInput}
          />
        </View>
        {/*  <View style={styles.action}>
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#666666"
            value={userData ? userData.lname : ''}
            onChangeText={(txt) => setUserData({ ...userData, lname: txt })}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View> */}
        <View style={styles.action}>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="About Me"
            placeholderTextColor="#666666"
            value={userData ? userData.about : ''}
            onChangeText={(txt) => setUserData({ ...userData, about: txt })}
            autoCorrect={true}
            style={[styles.textInput, { height: 40 }]}
          />
        </View>
        <View style={styles.action}>
        <TouchableOpacity style={styles.button} onPress={() => { handleUpdate() }}>
            <Text style={styles.buttonText}>Güncelle</Text>
          </TouchableOpacity>
        </View>
        {/*  <View style={styles.action}>
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            value={userData ? userData.phone : ''}
            onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
            style={styles.textInput}
          />
        </View> */}

        {/*  <View style={styles.action}>
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.country : ''}
            onChangeText={(txt) => setUserData({ ...userData, country: txt })}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.city : ''}
            onChangeText={(txt) => setUserData({ ...userData, city: txt })}
            style={styles.textInput}
          />
        </View> */}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 1 : 0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        style={{
          /*  borderWidth: 0,
           borderTopLeftRadius: 15,
           borderTopRightRadius: 15,
           shadowColor: "#000",
           shadowOffset: {
             width: 0,
             height: 2,
           },
           shadowOpacity: 0.25,
           shadowRadius: 3.84,
           elevation: 5, */
        }}
      >
        {renderInner()}
      </BottomSheet>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom:10,
    flex: 1
  },
  buttonText: {
    color: 'white',
    fontWeight: '800'
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#333333',
  },
});