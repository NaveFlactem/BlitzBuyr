import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CreateListing = () => {
  const [title, setTitle] = useState(''); //title variable
  const [description, setDescription] = useState(''); //description variable
  const [price, setPrice] = useState(''); //price variable 

  const handleCreateListing = () => {
    // Code to create a listing with database
  };

  const handleUploadPhoto = () => {
    // Add code for handling photo uploads here
  };

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Create a Listing</Text> 
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={text => setTitle(text)}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={text => setDescription(text)}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={text => setPrice(text)}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
        <Image source={require('./assets/ImageIcon.png')} style={styles.uploadIcon} />
      </TouchableOpacity>
      <Button title="Create Listing" onPress={handleCreateListing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,//top of page
    padding: 30,//all around
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
    height: 300,
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
});

export default CreateListing;