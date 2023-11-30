import React, { useState, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { getThemedStyles } from '../constants/Styles.js';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';

const SettingsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeContext();
  const { toggleTheme } = useThemeContext();

  const styles = getThemedStyles(useThemeContext().theme).SettingsScreen;
  const [contactInfo] = useState(route.params?.prevContactInfo);
  const [profileName] = useState(route.params?.profileName);

  const titles = {
    'Account Settings': ['Change Password', 'Contact Info'],
    // Notifications: ['Account Activity', 'Notification Preferences'],
    Notifications: ['Account Activity'],
    General: ['Dark Mode'],
    More: ['About Us'],
  };

  const toggleNotifications = () => {
    console.log('notification toggle');
  };

  const toggleLocation = () => {
    console.log('location toggle');
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

  const toggleParams = {
    'Dark Mode': toggleDarkMode,
    Location: toggleLocation,
    'Account Activity': toggleNotifications,
  };

  const params = {
    'Contact Info': {
      prevContactInfo: contactInfo,
    },
    'Change Password': { profileName: profileName },
  };

  const [switchItemsState, setSwitchItemsState] = useState({
    'Dark Mode': theme === 'light' ? false : true,
    'Account Activity': false,
    Location: false,
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.BB_bone,
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
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
                          console.log(`${item.replace(' ', '')}Screen`);
                          console.log(params[item]);
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
