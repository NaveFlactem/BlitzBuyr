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

  const styles = getThemedStyles(useThemeContext().theme).ChangePassword;

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
    if (password !== confirmPassword) {
      // Add visual prompt later
      console.error('Password and Confirm Password do not match');
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
      alert(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.BB_bone,
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        stickyHeaderIndices={[0]}
      >
        {/* Top Bar */}
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
            <View style={{paddingLeft: 10, alignContent: 'center', alignSelf: 'center'}}>
              <Text style={styles.headerText}>Reset Password</Text>
            </View>
          </View>
        </View>
        {/* CONTENT */}
        <View style={styles.container} backgroundColor={Colors.BB_bone}>
          <View>
            <Text>
              At least 9 characters with uppercase and lowercase letters.
            </Text>
          </View>
          {/* New Password */}
          <View style={{ paddingVertical: 5 }}>
            <Text
              style={{
                color: Colors.BB_darkRedPurple,
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
                borderColor: Colors.BB_darkRedPurple,
                borderWidth: 1,
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
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
                  color={Colors.BB_darkRedPurple}
                />
              </TouchableOpacity>
            </View>
            {/* Confirm New Password */}
            <Text
              style={{
                color: Colors.BB_darkRedPurple,
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
                borderColor: Colors.BB_darkRedPurple,
                borderWidth: 1,
                borderRadius: 5,
                justifyContent: 'space-between',
                paddingHorizontal: 15,
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
                  color={Colors.BB_darkRedPurple}
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
