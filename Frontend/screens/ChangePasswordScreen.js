/**
 * @namespace ChangePasswordScreen
 * @memberof Screens
 */
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';
import Colors from '../constants/Colors';
import { screenHeight } from '../constants/ScreenDimensions';
import { getThemedStyles } from '../constants/Styles.js';
import { saveProfileInfo } from '../network/Service.js';
import {
  getStoredPassword,
  setStoredCredentials,
} from './auth/Authenticate.js';

/**
 * @function ChangePassword
 * @memberof Screens.ChangePasswordScreen
 * @param {Object} navigation - Stack navigation object.
 * @param {Object} route - Information about the current route.
 * @description A screen that allows users to change their password.
 * @returns {JSX.Element}
 */
const ChangePassword = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [profileName] = useState(route.params?.profileName);
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).ChangePasswordScreen;

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
  };
  useEffect(() => {
    setPassword(getStoredPassword());
    setConfirmPassword(getStoredPassword());

    console.log(profileName);
  }, [isFocused]);

  const changePassword = async () => {
    const formData = new FormData();
    formData.append('username', profileName);
    formData.append('password', password);

    try {
      console.log('Changing password:', formData);
      await saveProfileInfo(formData);

      await setStoredCredentials(profileName, password);
      console.log('Password changed successfully.');
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  };

  const saveChanges = async () => {
    if (password === '' || confirmPassword === '') {
      Alert.alert('Invalid Input', 'Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      // Add visual prompt later
      Alert.alert(
        'Password Mismatch',
        'Password and Confirm Password do not match.'
      );
      return;
    }
    if (password.length < 8 || confirmPassword.length < 8) {
      Alert.alert('Invalid Input', 'Password must be at least 8 characters.');
      return;
    }
    try {
      await changePassword();
      navigation.setOptions({
        params: { profileName: profileName },
      });
      navigation.navigate('SettingsScreen');
    } catch (error) {
      console.error(error);
      Alert.alert(error);
    }
  };

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
            <Text style={styles.headerText}>Reset Password</Text>
          </View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        }}
      >
        {/* CONTENT */}
        <View
          style={styles.container}
          backgroundColor={theme === 'dark' ? Colors.black : Colors.BB_bone}
        >
          <View>
            <Text
              style={{
                color: theme === 'dark' ? Colors.BB_bone : Colors.black,
                marginTop: 10,
              }}
            >
              At least 9 characters with uppercase and lowercase letters.
            </Text>
          </View>
          {/* New Password */}
          <View style={{ paddingVertical: 5 }}>
            <Text
              style={{
                color:
                  theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
                fontWeight: 'bold',
                fontSize: 18,
                paddingVertical: 10,
                paddingHorizontal: 5,
              }}
            >
              New Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                borderColor:
                  theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
                borderWidth: 1,
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor:
                  theme === 'dark' ? Colors.BB_bone : Colors.white,
              }}
            >
              <TextInput
                value={password}
                onChangeText={(value) => setPassword(value)}
                editable={true}
                secureTextEntry={isPasswordHidden}
                style={{ fontSize: 15, fontWeight: 'bold', flex: 1 }}
              />
              <TouchableOpacity
                style={{
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={togglePasswordVisibility}
              >
                <MaterialIcons
                  name="visibility"
                  size={30}
                  color={
                    theme === 'dark'
                      ? Colors.BB_violet
                      : Colors.BB_darkRedPurple
                  }
                />
              </TouchableOpacity>
            </View>
            {/* Confirm New Password */}
            <Text
              style={{
                color:
                  theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
                fontWeight: 'bold',
                fontSize: 18,
                paddingVertical: 10,
                paddingHorizontal: 5,
              }}
            >
              Confirm New Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                borderColor:
                  theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
                borderWidth: 1,
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor:
                  theme === 'dark' ? Colors.BB_bone : Colors.white,
              }}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={(value) => setConfirmPassword(value)}
                editable={true}
                secureTextEntry={isConfirmPasswordHidden}
                style={{ fontSize: 15, fontWeight: 'bold', flex: 1 }}
              />
              <TouchableOpacity
                style={{
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={toggleConfirmPasswordVisibility}
              >
                <MaterialIcons
                  name="visibility"
                  size={30}
                  color={
                    theme === 'dark'
                      ? Colors.BB_violet
                      : Colors.BB_darkRedPurple
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={{ paddingVertical: 15 }}>
              <View style={styles.thinHorizontalBar}></View>
            </View>
            {/* Apply Changes Button */}
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity style={styles.button} onPress={saveChanges}>
                <Text style={styles.buttonText}>Apply Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
