import {StyleSheet } from 'react-native';
import Colors, { CustomDarkTheme, CustomLightTheme } from './Colors.js';

export const getThemedStyles = (theme) => {
    let themeColors;
    if (theme === 'light') {
      themeColors = CustomLightTheme.colors;
    } else {
      themeColors = CustomDarkTheme.colors;
    }
    return StyleSheet.create({
      contactInfoContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
      },
      socialIcons: {
        flexDirection: 'row',
        paddingVertical: 5,
        alignContent: 'center',
        paddingHorizontal: 10,
        textAlign: 'center',
      },
      socialText: {
        marginVertical: 1.5,
        marginHorizontal: 10,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
      },
      noListingsText: {
        textAlign: 'center',
        marginTop: 110,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20,
        color: themeColors.BB_darkRedPurple,
      },
      button: {
        width: 110,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRadius: 10,
        marginHorizontal: 2,
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      buttonText: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 15,
        color: themeColors.white,
      },
      ratingStar: {
        alignSelf: 'center',
        position: 'absolute',
        width: '30%',
        height: '60%',
        borderRadius: 20,
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 1,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      circleContainer: {
        top: 15,
        left: 15,
      },
      circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white', // Set the background color as needed
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black', // Set the border color as needed
      },
    });
};