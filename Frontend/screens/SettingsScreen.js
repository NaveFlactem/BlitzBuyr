/**
 * @namespace SettingsScreen
 * @memberof Screens
 *
 *
 */

import React, { useState, memo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { getThemedStyles } from '../constants/Styles.js';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';
import * as SecureStore from 'expo-secure-store';
import { screenHeight } from '../constants/ScreenDimensions';

/**
 * @function SettingsScreen
 * @memberof Screens.SettingsScreen
 * @param {Object} navigation - Stack navigation object.
 * @param {Object} route - Information about the current route.
 * @returns {JSX.Element}
 */
const SettingsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeContext();
  const { toggleTheme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).SettingsScreen;
  const [contactInfo] = useState(route.params?.prevContactInfo);
  const [profileName] = useState(route.params?.profileName);
  const [accountActivityChecked, setAccountActivityChecked] = useState(false);

  const params = {
    'Contact Info': {
      prevContactInfo: contactInfo,
    },
    'Change Password': { profileName: profileName },
  };

  const [switchItemsState, setSwitchItemsState] = useState({
    'Dark Mode': theme === 'light' ? false : true,
    'Account Activity': false,
  });

  const titles = {
    'Account Settings': ['Change Password', 'Contact Info'],
    Notifications: ['Account Activity'],
    General: ['Dark Mode'],
    More: ['About Us'],
  };

  const toggleDarkMode = async () => {
    try {
      await toggleTheme();
      setSwitchItemsState((prevState) => ({
        ...prevState,
        'Dark Mode': theme === 'light',
      }));
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const toggleNotifications = async () => {
    const accountActivityStatus = !switchItemsState['Account Activity'];

    try {
      if (!accountActivityStatus) {
        setAccountActivityChecked(false);
        await SecureStore.setItemAsync('accountActivityStatus', 'false');
        setSwitchItemsState((prevState) => ({
          ...prevState,
          'Account Activity': false,
        }));
      } else {
        setAccountActivityChecked(true);
        await SecureStore.setItemAsync('accountActivityStatus', 'true');
        setSwitchItemsState((prevState) => ({
          ...prevState,
          'Account Activity': true,
        }));
      }
    } catch (error) {
      console.error('Error setting secure store:', error);
    }
  };

  const toggleParams = {
    'Dark Mode': toggleDarkMode,
    'Account Activity': toggleNotifications,
  };

  useEffect(() => {
    const loadAccountActivityStatus = async () => {
      try {
        const storedStatus = await SecureStore.getItemAsync(
          'accountActivityStatus',
        );
        const parsedStatus =
          storedStatus !== null ? storedStatus === 'true' : false;
        setSwitchItemsState((prevState) => ({
          ...prevState,
          'Account Activity': parsedStatus,
        }));
      } catch (error) {
        console.error('Error loading account activity status:', error);
      }
    };

    loadAccountActivityStatus();
  }, []);

  return (
    <SafeAreaView style={styles.safeareaview}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarContainer}>
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              navigation.navigate('BottomNavOverlay');
            }}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color={Colors.BB_bone}
                style={{
                  top:
                    Platform.OS === 'ios'
                      ? 0.035 * screenHeight
                      : 0.055 * screenHeight,
                }}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              paddingLeft: 10,
              alignContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Text style={styles.headerText}>Settings</Text>
          </View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        Account
        Activity
        style={{
          backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        }}
      >
        {/* CONTENT */}
        <View style={styles.container}>
          <View style={styles.settingsContent}>
            {/* EACH VIEW IS CREATED FROM EACH KEY IN THE titles DICTIONARY */}
            {Object.entries(titles).map(([section, items]) => (
              <View key={section}>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.header}>{section}</Text>
                </View>
                {items.map((item, index) => (
                  <View key={`${section}-${item}`}>
                    {/* IF KEY IS A REDIRECT TO DIFFERENT PAGE */}
                    {!switchItemsState.hasOwnProperty(item) ? (
                      <TouchableOpacity
                        key={item}
                        style={styles.settingsItems}
                        onPress={() => {
                          setLoading(true);
                          console.log(
                            `navigating to => ${item.replace(' ', '')}Screen`,
                          );
                          console.log(`with parameters => ${params[item]}`);
                          navigation.navigate(
                            `${item.replace(' ', '')}Screen`,
                            params[item],
                          );
                        }}
                      >
                        <Text style={styles.itemText}>{item}</Text>
                        <AntDesign
                          name="right"
                          size={15}
                          color={
                            theme === 'dark'
                              ? Colors.BB_bone
                              : Colors.BB_darkerRedPurple
                          }
                          style={{ right: 25 }}
                        />
                      </TouchableOpacity>
                    ) : (
                      // IF KEY IS A TOGGLE
                      <View
                        key={item}
                        style={{
                          paddingTop: 20,
                          paddingHorizontal: 5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text
                          style={[styles.itemText, { left: 20, bottom: 6 }]}
                        >
                          {item}
                        </Text>
                        <Switch
                          trackColor={{
                            false:
                              theme === 'dark' ? Colors.BB_bone : Colors.gray,
                            true: Colors.BB_violet,
                          }}
                          thumbColor={
                            theme === 'dark'
                              ? '#3e3e42'
                              : Colors.BB_darkerRedPurple
                          }
                          onValueChange={() => {
                            setSwitchItemsState((prevState) => ({
                              ...prevState,
                              [item]: !prevState[item],
                            }));
                            toggleParams[item]();
                          }}
                          style={{
                            bottom: 15,
                            right: 10,
                          }}
                          value={switchItemsState[item]}
                        />
                      </View>
                    )}
                    {/* Thin Horizontal Bar */}
                    {index !== items.length - 1 && ( //Only appear when it's not the last item in the key.
                      <View style={styles.thinHorizontalBar}></View>
                    )}
                  </View>
                ))}
                <View style={styles.horizontalBar}></View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
