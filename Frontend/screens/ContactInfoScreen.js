/**
 * @namespace EditContactInfo
 * @description - EditContactInfo is a screen that allows users to edit their own contact information and decide what should be visable
 *
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
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
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).ContactInfoScreen;
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
    <SafeAreaView style={styles.safeareaview}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        }}
        stickyHeaderIndices={[0]}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                navigation.navigate('SettingsScreen');
              }}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  color={Colors.BB_bone}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerText}>Contact Info</Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.container}>
          {Object.keys(contactInfo).map((key) => (
            <View key={key}>
              <View style={styles.itemContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <AntDesign
                    name={contactInfo[key].icon}
                    size={24}
                    color={
                      theme === 'dark'
                        ? Colors.BB_violet
                        : Colors.BB_darkRedPurple
                    }
                    style={{ paddingRight: 10 }}
                  />
                  <Text style={styles.title}>
                    {key.charAt(0).toUpperCase() + key.substring(1)}
                  </Text>
                </View>
                <TextInput
                  style={styles.data}
                  value={contactInfo[key].data}
                  onChangeText={(value) => handleInputChange(key, value)}
                />
              </View>
              <View style={styles.thinHorizontalBar}></View>
            </View>
          ))}
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setLoading(true);
              try {
                saveContactInfo(contactInfo);

                navigation.setOptions({
                  params: { profileName: getStoredUsername() },
                });
                navigation.navigate('SettingsScreen');
              } catch (error) {
                alert(error);
              }
              navigation.navigate('BottomNavOverlay');
            }}
          >
            <Text style={styles.buttonText}>Apply Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditContactInfo;
