/**
 * @namespace AboutUs
 * @description - AboutUs is a screen
 *
 */
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext } from '../components/visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

const AboutUsScreen = ({ navigation, route }) => {
  const content = `
  How Much Up-Front? A Grounded Theory of Agile Architecture Summary by Waterman, Noble, and Allan
  (from The School of Engineering and Computer Science at Victoria University of Wellington, New Zealand) 
  explores the relationship between software architecture and the agile methodology, and how the relationship 
  between both are almost inverse from each other. The paper was published and presented in 2015 at the 
  IEEE/ACM International conference on Software Engineering.`;

  const styles = getThemedStyles(useThemeContext().theme).AboutUs;
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BB_bone }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        }}
        stickyHeaderIndices={[0]}
      >
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
              }}
            >
              <Text style={styles.headerText}>About Us</Text>
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>{content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;
