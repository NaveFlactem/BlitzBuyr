/**
 * @namespace EditContactInfo
 * @description - EditContactInfo is a screen that allows users to edit their own contact information and decide what should be visable
 *
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import { saveContactInfo } from '../network/Service';
import { getStoredUsername } from './auth/Authenticate';

/**
 * Represents a screen for editing contact information.
 * @function
 * @name EditContactInfo
 * @memberof EditContactInfo
 * @param {Object} navigation - The object used to navigate between screens.
 * @param {Object} route - Information about the current route
 * @returns {JSX.Element} A screen for editing a users contact information.
 */
const EditContactInfo = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(route.params?.prevContactInfo);

  /**
   *
   * @function
   * @name handleInputChange
   * @memberof EditContactInfo
   * @param {string} key - The key representing the type of contact information to update.
   * @param {string} value - The new value to be set for the specified contact information.
   * @returns {void}
   * @description Updates the contact information state by modifying a specific key-value pair.
   */
  const handleInputChange = (key, value) => {
    setContactInfo((prevContactInfo) => ({
      ...prevContactInfo,
      [key]: { ...prevContactInfo[key], data: value },
    }));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 22,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 25,
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            navigation.navigate('BottomNavOverlay');
          }}
          style={styles.circleContainer}
        >
          <View style={styles.circle}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
          </View>
        </TouchableOpacity>

        <Text
          style={{
            position: 'absolute',
            color: Colors.BB_darkRedPurple,
            fontSize: 22.5,
            fontWeight: 'bold',
            top: 20,
          }}
        >
          Edit Contact
        </Text>
      </View>

      <ScrollView style={{ marginTop: 50 }}>
        <View style={styles.container}>
          {Object.keys(contactInfo).map((key) => (
            <View key={key} style={styles.itemContainer}>
              <Text style={styles.title}>
                {key.charAt(0).toUpperCase() + key.substring(1)}
              </Text>
              <TextInput
                style={styles.data}
                value={contactInfo[key].data}
                onChangeText={(value) => handleInputChange(key, value)}
              />
            </View>
          ))}
        </View>

        {/* SAVE CHANGES BUTTON */}
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              try {
                saveContactInfo(contactInfo);

                navigation.setOptions({
                  params: { profileName: getStoredUsername() },
                });
                navigation.goBack();
              } catch (error) {
                alert(error);
              }
            }}
            style={{
              width: 130,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.BB_darkRedPurple,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: Colors.black,
              marginVertical: 20,
            }}
          >
            <Text
              style={{
                fontStyle: 'normal',
                color: Colors.white,
                fontWeight: '500',
                fontSize: 15,
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  data: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    padding: 8,
  },
  circleContainer: {
    position: 'absolute',
    top: 15,
    left: Platform.OS == 'ios' ? 15 : 0,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
};

export default EditContactInfo;
