import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {
  let [selectedImage, setSelectedImage] = React.useState(null);
  const disSelectedImage = () => setSelectedImage(null);

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    Sharing.shareAsync(selectedImage.remoteUri || selectedImage.localUri);
  };

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted == false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled == true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  function HomePage() {
    BackHandler.addEventListener('sairDoApp', () => BackHandler.exitApp());
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image source={{ uri: "https://i.imgur.com/TkIrScD.png" }} style={styles.logo} />

          <Text style={styles.instructions}>
            To share a photo from your phone with a friend, just press the button below!
        </Text>

          <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
            <Text style={styles.buttonText}>Pick a photo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.interpriseText}>Lucas F. Cota</Text>
      </View>
    );
  }

  function SharePage() {
    BackHandler.addEventListener('voltar', disSelectedImage);
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />

          <View style={styles.buttons}>
            <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
              <Text style={styles.buttonText}>Share this photo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
              <Text style={styles.buttonText}>Choose other</Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={disSelectedImage} style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.interpriseText}>Lucas F. Cota</Text>
        </View>
    );
  }

  /*******************************REGRAS************************************/

  if (selectedImage !== null) return <SharePage />;

  return <HomePage />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 14,
    textAlign: 'justify',
    width: 305,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: 350,
    height: 450,
    resizeMode: "cover",
    marginBottom: 10,
  },
  interpriseText: {
    color: '#888',
    fontSize: 12,
  },
});
