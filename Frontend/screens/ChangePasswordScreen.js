/**
 * @namespace ChangePassword
 * @description - ChangePassword is a screen that allows users to change the password used to access their account.
 *
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { getThemedStyles } from '../constants/Styles.js';
import { getStoredPassword } from './auth/Authenticate.js';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';

const ChangePassword = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  const styles = getThemedStyles(useThemeContext().theme).ChangePasswordScreen;

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };
  useEffect(() => {
    setPassword(getStoredPassword());
  }, [isFocused]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.BB_bone,
      }}
    >
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
            <Text style={styles.headerText}>Change Password</Text>
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
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
