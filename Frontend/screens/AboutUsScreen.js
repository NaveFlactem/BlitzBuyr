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
  Platform,
} from 'react-native';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext } from '../components/visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';
import { screenHeight } from '../constants/ScreenDimensions';

const AboutUsScreen = ({ navigation }) => {
  const styles = getThemedStyles(useThemeContext().theme).AboutUs;
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();

  const teamMembers = [
    { name: 'Lukas Dopcke', role: 'Developer' },
    { name: 'Shreyas Vittal', role: 'Developer' },
    { name: 'Evan Metcalf', role: 'Product Owner' },
    { name: 'Thomas Pollicino', role: 'Developer' },
    { name: 'Alfonso Del Rosario', role: 'Developer' },
  ];

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
                      : 0.045 * screenHeight,
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
            <Text style={styles.headerText}>About Us</Text>
          </View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        }}
      >
        <View style={styles.container}>
          <Text style={styles.header}>
            Welcome to BlitzBuyr
          </Text>

          <Text style={styles.sectionHeader}>About Us</Text>
          <Text style={styles.paragraph}>
            BlitzBuyrDevs is not just a developement team; it's a
            dynamic community driven by a passion for fast-paced transactions
            and cutting-edge development. We've crafted an open marketplace that
            caters to users seeking swift and efficient buying and selling
            experiences while mantaining a safe and consistent marketplace.  
          </Text>

          <Text style={styles.sectionHeader}>Meet the Team</Text>
          <Text style={styles.paragraph}>
            We are a group of dedicated undergraduate students from the
            University of California, Santa Cruz (UCSC), united by our love for
            coding and innovation. This project was completed through our course,
            Intro to Software Engineering.  BlitzBuyr was produced using Scrum and
            Agile programming practices with a focus in making the expierence as 
            realistic to a developement team in the industry.  Each member got expierence
            practicing as the Scrum Master while keeping an updated Scrum Board and 
            burnout chart. The team went through many new expierences in the developement
            of this app such as React Native, testing using Expo Go, documentation through
            JSDocs, and a live server to store the data of the application. Our diverse 
            team brought a range of skills and perspectives to the table, ensuring a 
            well-rounded approach to the development of BlitzBuyr. 
          </Text>

          <View style={styles.teamList}>
            {teamMembers.map((member, index) => (
              <Text key={index} style={styles.teamMember}>
                {`${member.name} (${member.role})`}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionHeader}>Our Mission</Text>
          <Text style={styles.paragraph}>
            At BlitzBuyrDevs, we're on a mission to redefine the online marketplace
            experience. We understand the importance of speed and efficiency,
            and we're committed to providing a platform that meets the demands
            of users who thrive in a fast-paced environment.
          </Text>

          <Text style={styles.paragraph}>
            Join us on this exciting journey as we revolutionize online
            transactions and empower users with a marketplace designed for
            speed, simplicity, and satisfaction. 
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUsScreen;
