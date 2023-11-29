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
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { getThemedStyles } from '../constants/Styles.js';
import {
  getStoredPassword,
  setStoredCredentials,
} from './auth/Authenticate.js';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';
import { saveProfileInfo } from '../network/Service.js';

const ChangePassword = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [profileName] = useState(route.params?.profileName);
  const {theme} = useThemeContext();
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
    // Verify password == confirmpassword
    if (password !== confirmPassword) {
      //Add visual prompt later
      console.error('Password and Confirm Password do not match');
      return;
    }
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
    console.log('saveChanges called');
    try {
      await changePassword();
      navigation.setOptions({
        params: { profileName: profileName },
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <SafeAreaView
      style={styles.safeareaview}
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
            <Text style={styles.headerText}>Reset Password</Text>
            <TouchableOpacity onPress={saveChanges}>
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
        <View style={styles.container} backgroundColor={theme === 'dark' ? Colors.black : Colors.BB_bone}>
          <View>
            <Text style={{color: theme === 'dark' ? Colors.BB_bone : Colors.black}}>
              At least 9 characters with uppercase and lowercase letters.
            </Text>
          </View>
          {/* New Password */}
          <View style={{ paddingVertical: 5 }}>
            <Text
              style={{
                color: theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
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
                borderColor: theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
                borderWidth: 1,
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor: theme === 'dark' ? Colors.BB_bone : Colors.white

              }}
            >
              <TextInput
                value={password}
                onChangeText={(value) => setPassword(value)}
                editable={true}
                secureTextEntry={isPasswordHidden}
                style={{ fontSize: 15, fontWeight: 'bold', flex: 1,
                 }}
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
                  color={theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple}
                />
              </TouchableOpacity>
            </View>
            {/* Confirm New Password */}
            <Text
              style={{
                color: theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
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
                borderColor: theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
                borderWidth: 1,
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor: theme === 'dark' ? Colors.BB_bone : Colors.white

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
                  color={theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
