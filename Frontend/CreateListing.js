import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleCreateListing = async () => {
    try {
      const photoDataPromises = photos.map(async (photo) => {
        const base64Data = await convertBlobToBase64(photo.blob);
        return base64Data;
      });

      const base64Images = await Promise.all(photoDataPromises);

      const requestPayload = {
        price: price,
        
        title: title,
        description: description,
        username: 'sampleUser',
      };

      const formData = new FormData();
      photos.forEach((item, i) => {
        formData.append("media_files[]", {
          uri: item.uri,
          type: "image/jpeg",
          name: item.filename || `filename${i}.jpg`,
        });
      });
      
      
       
      
      

      console.log('request Payload:', requestPayload);

      const response = await fetch('http://blitzbuyr.lol/api/createListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Response: ${JSON.stringify(data)}`);
      } else {
        console.error(`API Response Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUploadPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      const selectedPhotos = result.assets;
      
      // Fetch and convert selected photos to blobs
      // Create an array of promises for fetching and converting the selected photos to blobs
      const photoDataPromises = selectedPhotos.map(async (photo) => {
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        return blob;
      });
  
      // Wait for all fetch and conversion operations to complete
      const photoData = await Promise.all(photoDataPromises);
  
      // Add selected photos and their blobs to the 'photos' array
      const updatedPhotos = photos.concat(selectedPhotos.map((photo, index) => ({
        ...photo,
        blob: photoData[index],
      })));
      setPhotos(updatedPhotos);
    }
  };

  const handleDeletePhoto = index => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const updatedPhotos = [...photos];
          updatedPhotos.splice(index, 1);
          setPhotos(updatedPhotos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Listing</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        returnKeyType="done" // This allows users to close the keyboard
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline={true}
        textAlignVertical="top" // Allows users to return to a new line
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
        returnKeyType="done" // This allows users to close the numeric keyboard
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
        <Image
          source={require('./assets/ImageIcon.png')}
          style={styles.uploadIcon}
        />
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {photos.map((photo, index) => (
          <View key={index}>
            <Image source={{uri: photo.uri}} style={styles.uploadedPhoto} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePhoto(index)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Button
        title="Create Listing"
        onPress={handleCreateListing}
        style={styles.createListingButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles here'

  container: {
    flex: 1,
    paddingTop: 50, //top of page
    padding: 30, //all around
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 120,
  },
  uploadButton: {
    backgroundColor: 'white',
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1, // Add a border
    borderColor: 'gray', // Border color
  },
  uploadIcon: {
    width: 100,
    height: 100,
  },

  uploadedPhoto: {
    width: 100,
    height: 100,
    margin: 10,
  },
  photoContainer: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#ccc',
    padding: 3,
    borderRadius: 50,
    alignItems: 'center',
  },
  createListingButton: {
    marginBottom: 10, // Adjust the marginBottom value
  },
});

export default CreateListing;
