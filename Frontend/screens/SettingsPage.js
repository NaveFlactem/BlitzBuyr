import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { getThemedStyles } from '../constants/Styles.js';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';

const SettingsPage = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeContext();
  const { toggleTheme } = useThemeContext();

  const styles = getThemedStyles(useThemeContext().theme).SettingsScreen;

  const titles = {
    'Account Settings': ['Change Password', 'Account Info', 'Contact Info'],
    'Notifications': ['Account Activity', 'Notification Preferences'],
    'General': ['Dark Mode'],
    'Privacy': ['Location'],
  };

  // const params = {
  //   'ContactInfoScreen' : {
  //     prevContactInfo: contactInfo,
  //   }
  // }

  const toggleParams = {
    'Dark Mode' : toggleTheme,
  }
  
  const [switchItemsState, setSwitchItemsState] = useState({
    'Dark Mode': false,
    'Account Activity': false,
    'Location': false,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BB_bone }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        stickyHeaderIndices={[0]}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
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
            <Text style={styles.headerText}>Settings</Text>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                navigation.navigate('BottomNavOverlay');
              }}
            >
                <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="check"
                  size={30}
                  color={Colors.BB_bone}
                />
                </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.container}>
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
                    <TouchableOpacity key={item} style={styles.settingsItems} 
                    onPress={() => {
                      setLoading(true);
                    navigation.navigate('BottomNavOverlay');
                    }}>
                      <Text style={styles.itemText}>{item}</Text>
                      <AntDesign
                        name="right"
                        size={15}
                        color={Colors.BB_darkRedPurple}
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
                      <Text style={styles.itemText}>{item}</Text>
                      <Switch
                        trackColor={{
                          false: Colors.gray,
                          true: Colors.BB_darkRedPurple,
                        }}
                        thumbColor={Colors.BB_darkerRedPurple}
                        onValueChange={() => {
                          setSwitchItemsState((prevState) => ({
                            ...prevState,
                            [item]: !prevState[item],
                          }));
                          toggleParams[item]();
                        }}
                        style={{
                          bottom: 15,
                          left: 15,
                        }}
                        value={theme === 'light' ? false : true}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsPage;
