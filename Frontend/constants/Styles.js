import { StyleSheet } from 'react-native';
import Colors, { CustomDarkTheme, CustomLightTheme } from './Colors.js';
import { screenHeight, screenWidth } from './ScreenDimensions.js';

export const shapes = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  diamond: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    transform: [{ rotate: '45deg' }],
  },
  rhombus: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
  },
  oval: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  hexagon: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    transform: [{ rotate: '45deg' }],
  },
  square: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rectangle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
  },
});

export const getThemedStyles = (theme) => {
  let themeColors;
  if (theme === 'light') {
    themeColors = CustomLightTheme.colors;
  } else {
    themeColors = CustomDarkTheme.colors;
  }
  return StyleSheet.create({
    ////////////////////////////////////////////
    ProfileScreen: {
      contactInfoContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
      },
      settingsIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
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
        backgroundColor: 'white', 
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black', 
      },
    },
    ////////////////////////////////////////////
    HomeScreen: {
      screenfield: {
        flex: 1,
        backgroundColor: themeColors.BB_pink,
      },
      swiperContainer: {
        height: screenHeight,
        width: screenWidth,
      },
      topTap: {
        position: 'absolute',
        top: 0.08 * screenHeight,
        width: screenWidth,
        height: 0.05 * screenHeight,
        zIndex: 3,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.BB_pink,
      },
      sliderCover: {
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        position: 'absolute',
      },
    },
    ////////////////////////////////////////////
    TopBarHome: {
      logo: {
        height: 0.1 * screenWidth,
        width: 0.55 * screenWidth,
        top: 0.025 * screenHeight,
        right: 0.01 * screenWidth,
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          },
        }),
      },
      menu: {
        position: 'absolute',
        paddingTop: Platform.OS == 'ios' ? 20 : 29,
        paddingLeft: 20,
        paddingBottom: 20,
        paddingRight: 20,
        height: 'auto',
        width: 'auto',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 80,
        left: '1%',
        zIndex: 11,
        ...Platform.select({
          ios: {
            top: '28%',
            shadowColor: themeColors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          },
          android: {
            top: '12%',
          },
        }),
      },
      location: {
        position: 'absolute',
        height: 'auto',
        width: 'auto',
        bottom: '8%',
        right: '5%',
        zIndex: 11,
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          },
        }),
      },
      topBar: {
        position: 'absolute',
        height: 0.09 * screenHeight,
        width: screenWidth,
        backgroundColor: themeColors.BB_darkRedPurple,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottomWidth: 3,
        borderColor:
          Platform.OS == 'ios' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)',
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          },
        }),
        zIndex: 10,
      },
    },
    ////////////////////////////////////////////
    RatingScreen: {
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      title: {
        fontSize: 24,
        marginBottom: '5%',
      },
      profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: '5%',
      },
      ratingContainer: {
        flexDirection: 'row',
        marginBottom: 20, // Add margin to move the button down
      },
      starButton: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
      },
      starMargin: {
        marginRight: 4,
      },
      backButton: {
        position: 'absolute',
        top: '7%',
        left: '7%',
      },
    },
    ////////////////////////////////////////////
    SettingsScreen: {
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        fontSize: 24,
      },
    },
    circleContainer: {
      top: 15,
      left: 15,
    },
    circle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'white', 
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'black', 
    },
    ////////////////////////////////////////////
  });
};