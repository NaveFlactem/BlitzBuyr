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
import { screenWidth } from '../constants/ScreenDimensions.js';

const SettingsPage = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

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
                        thumbColor={Colors.BB_darkRedPurple}
                        onValueChange={() => {
                          setSwitchItemsState((prevState) => ({
                            ...prevState,
                            [item]: !prevState[item],
                          }));
                        }}
                        style={{
                          bottom: 15,
                          left: 15,
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.BB_darkRedPurple,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: Colors.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerText: {
    color: Colors.BB_bone,
    fontSize: 27.5,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderContainer: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  header: {
    color: Colors.BB_darkRedPurple,
    fontWeight: 'bold',
    fontSize: 20,
  },
  saveSettings: {
    color: Colors.BB_bone,
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  settingsItems: {
    paddingVertical: 20,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontWeight: '500',
    color: Colors.BB_darkerRedPurple,
    fontSize: 15,
  },
  thinHorizontalBar: {
    height: 1,
    backgroundColor: Colors.BB_darkRedPurple,
    width: '100%',
    borderRadius: 5,
  },
  horizontalBar: {
    height: 15,
    backgroundColor: Colors.BB_darkRedPurple,
    width: '100%',
    borderRadius: 5,
  },
});

export default SettingsPage;
