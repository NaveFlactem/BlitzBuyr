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
import { useThemeContext } from '../components/visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

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
  const styles = getThemedStyles(useThemeContext().theme).EditContactInfo;
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
        backgroundColor: Colors.BB_bone,
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


export default EditContactInfo;
