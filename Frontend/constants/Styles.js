/**
 * @namespace Styles
 * @description - Styles is a file that contains all the styles for the app
 */

import { Platform, StyleSheet } from 'react-native';
import Colors, { CustomDarkTheme, CustomLightTheme } from './Colors.js';
import { screenHeight, screenWidth } from './ScreenDimensions.js';

/**
 * @function getThemedStyles
 * @param {string} theme
 * @returns {Object} StyleSheet
 * @memberof Styles
 * @description Returns the styles for the current theme (light or dark). Holds all predefined styles for the app.
 */
export const getThemedStyles = (theme) => {
  let themeColors;
  if (theme === 'light') {
    themeColors = CustomLightTheme.colors;
  } else {
    themeColors = CustomDarkTheme.colors;
  }
  return StyleSheet.create({
    // PROFILE SCREEN //
    ProfileScreen: {
      pageHeader: {
        position: 'absolute',
        top: 0,
        height: 0.09 * screenHeight,
        width: screenWidth,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
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
        textAlign: 'center',
      },
      socialText: {
        marginVertical: 1.5,
        marginHorizontal: 10,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'left',
        width: 250,
        overflow: 'hidden',
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
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
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
        width: 0.1 * screenWidth,
        height: 0.1 * screenWidth,
        borderRadius: 25,
        left: 15,
        top: '-44%',
      },
      circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor:
          theme === 'dark' ? themeColors.BB_darkRedPurple : Colors.BB_bone,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor:
          theme === 'dark'
            ? themeColors.BB_darkRedPurple
            : Colors.BB_darkRedPurple,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          },
        }),
      },
    },

    // HOME SCREEN //
    HomeScreen: {
      screenfield: {
        flex: 1,
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_pink,
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
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_pink,
      },
      sliderCover: {
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        position: 'absolute',
      },
    },

    // TOP BAR HOME //
    TopBarHome: {
      logo: {
        height: 0.1 * screenWidth,
        width: 0.55 * screenWidth,
        top: 0.025 * screenHeight,
        right: 0.01 * screenWidth,
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
          },
          android: {
            bottom: -15,
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

    // RATING SCREEN //
    RatingScreen: {
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        height: 'auto',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      title: {
        fontSize: 24,
        marginBottom: '5%',
        color: theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
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
      submitButton: {
        backgroundColor: theme === 'dark' ? '#3e3e42' : Colors.BB_darkRedPurple,
        width: 0.3 * screenWidth,
        height: 0.06 * screenHeight,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 20,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      submitText: {
        color: Colors.BB_bone,
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
      },
    },

    AboutUs: {
      safeareaview: {
        flex: 1,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
      topBar: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: themeColors.BB_darkRedPurple,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderBottomColor: themeColors.black,
      },
      topBarContainer: {
        justifyContent: 'center',
        width: '100%',
      },
      headerText: {
        color: Colors.BB_bone,
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingLeft: 10,
      },
      text: {
        fontSize: 18,
        fontWeight: 'bold',
        alignContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
      },
      textContainer: {
        paddingHorizontal: 10,
        alignContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
      },
      container: {
        padding: 20,
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      paragraph: {
        fontSize: 16,
        marginBottom: 15,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      teamList: {
        marginLeft: 15,
      },
      teamMember: {
        fontSize: 16,
        marginBottom: 5,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
    },

    // SETTINGS SCREEN //
    SettingsScreen: {
      safeareaview: {
        flex: 1,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
      scrollViewContent: {
        flexGrow: 1,
      },
      container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
      },
      settingsContent: {
        height: 'auto',
        width: 0.95 * screenWidth,
        marginTop: 0.02 * screenHeight,
        backgroundColor: theme === 'dark' ? themeColors.BB_darkRedPurple : null,
        borderRadius: 20,
        alignSelf: 'center',
        paddingBottom: 20,
      },
      topBar: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: themeColors.BB_darkRedPurple,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 2,
        paddingTop: Platform.OS == 'android' ? 20 : 0,
        borderBottomColor: themeColors.black,
      },
      topBarContainer: {
        justifyContent: 'center',
        width: '100%',
      },
      headerText: {
        color: Colors.BB_bone,
        fontSize: 24,
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
        left: 10,
      },
      header: {
        color: theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
        fontWeight: 'bold',
        fontSize: 20,
        left: 10,
      },
      saveSettings: {
        color: themeColors.BB_bone,
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
        left: 10,
      },
      itemText: {
        fontWeight: '500',
        color: theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
        fontSize: 15,
        left: 10,
      },
      thinHorizontalBar: {
        height: 1,
        backgroundColor:
          theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
        width: '90%',
        borderRadius: 5,
        alignSelf: 'center',
      },
      horizontalBar: {
        height: 15,
        backgroundColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        width: '90%',
        borderRadius: 5,
        alignSelf: 'center',
      },
    },
    ////////////////////////////////////////////
    TagDrawer: {
      drawerContainer: {
        position: 'absolute',
        height: 0.9 * screenHeight,
        width: 0.3 * screenWidth,
        zIndex: 110,
        left: 0.55 * screenWidth,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
      drawerScroll: {
        top: 0.08 * screenHeight,
        width: 0.4 * screenWidth,
        height: '100%',
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRightWidth: 2,
        borderRightColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_orange,
      },
      drawer: {
        alignSelf: 'center',
        left: '5%',
        borderRadius: 20,
        paddingTop: 20,
        height: 'auto',
        width: 'auto',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 12,
        backgroundColor:
          theme === 'dark' ? Colors.black : Colors.BB_darkRedPurple,
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      outsideDrawer: {
        position: 'absolute',
        height: screenHeight,
        width: screenWidth,
        zIndex: 11,
      },
      tagContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 20,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: 0.055 * screenHeight,
        width: 0.3 * screenWidth,
        zIndex: 120,
        ...Platform.select({
          ios: {
            shadowColor: 'white',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      tagText: {
        color: themeColors.white,
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold',
      },
      rhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: 0.035 * screenHeight,
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkPink,
        opacity: 0.15,
        transform: [{ rotate: '45deg' }],
      },
      tagSelected: {
        alignSelf: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRadius: 20,
        height: '100%',
        width: '100%',
        position: 'absolute',
        borderColor: themeColors.BB_bone,
        borderWidth: 1,
      },
      applyButton: {
        borderRadius: 20,
        height: 0.06 * screenHeight,
        width: 0.3 * screenWidth,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? Colors.BB_violet : Colors.BB_pink,
        borderColor: themeColors.BB_bone,
        borderWidth: 1,
        ...Platform.select({
          ios: {
            shadowColor: Colors.BB_bone,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: theme === 'dark' ? 0.5 : 0.2,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      applyButtonText: {
        color: themeColors.white,
        fontSize: 18,
        fontWeight: 'bold',
      },
      swipeArea: {
        position: 'absolute',
        width: 0.05 * screenWidth,
        height: screenHeight,
        left: 0,
        zIndex: 200,
      },
      seperationContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 0.06 * screenHeight,
        width: '90%',
        marginTop: 10,
        marginBottom: 10,
      },
      seperationText: {
        color: themeColors.white,
        backgroundColor:
          theme === 'dark' ? Colors.black : Colors.BB_darkRedPurple,
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
        width: 'auto',
        top: '9%',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
      },
      separatorLine: {
        position: 'absolute',
        height: 1,
        backgroundColor: 'white',
        width: '80%',
        marginTop: 5,
      },
      swipeArea: {
        position: 'absolute',
        width: 0.05 * screenWidth,
        height: screenHeight,
        left: 0,
        zIndex: 200,
      },
      spacer: {
        position: 'relative',
        height: 0.06 * screenHeight,
      },
    },
    ////////////////////////////////////////////
    ChangePasswordScreen: {
      safeareaview: {
        flex: 1,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
      scrollViewContent: {
        flexGrow: 1,
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
      },
      container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
      },
      topBar: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: themeColors.BB_darkRedPurple,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 2,
        paddingTop: Platform.OS == 'android' ? 20 : 0,
        borderBottomColor: themeColors.black,
      },
      topBarContainer: {
        justifyContent: 'center',
        width: '100%',
      },
      headerText: {
        color: Colors.BB_bone,
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
      },
      iconContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      },
      itemContainer: {
        paddingVertical: 10,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      data: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
        padding: 8,
      },
      thinHorizontalBar: {
        height: 10,
        backgroundColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        width: '100%',
        borderRadius: 5,
        alignContent: 'center',
      },
      buttonText: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 15,
        color: themeColors.white,
      },
      button: {
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 20,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
    },
    ////////////////////////////////////////////
    NoWifi: {
      noWifiContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 0.1 * screenHeight,
      },
      noWifiText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'gray',
        marginTop: 20,
      },
      noWifiImage: {
        position: 'absolute',
        width: 0.3 * screenWidth,
        height: 0.15 * screenHeight,
        alignSelf: 'center',
        top: 0.2 * screenHeight,
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.BB_bone,
        textAlign: 'center',
      },
      retryButton: {
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        padding: 10,
        borderRadius: 40,
        width: '20%',
        height: '7%',
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          },
          android: {
            elevation: 5,
          },
        }),
      },
    },
    ////////////////////////////////////////////
    NoListings: {
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'dark' ? Colors.BB_bone : Colors.BB_darkRedPurple,
        textAlign: 'center',
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.BB_bone,
        textAlign: 'center',
      },
      retryButton: {
        marginTop: 20,
        justifyContent: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        padding: 10,
        borderRadius: 40,
        width: '20%',
        height: '7%',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? null : Colors.BB_bone,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          },
          android: {
            elevation: 5,
          },
        }),
      },
    },
    ////////////////////////////////////////////
    LocationSlider: {
      box: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        position: 'absolute',
        right: 0,
        bottom: Platform.OS == 'ios' ? screenHeight * 0.8 : screenHeight * 0.75,
        width: screenWidth * 0.7,
        height: screenHeight * 0.07,
        borderRadius: 80,
        paddingTop: Platform.OS == 'ios' ? 0 : 3,
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
          },
          android: {
            elevation: 20,
          },
        }),
      },
      valueText: {
        position: 'absolute',
        bottom: '65%',
        color: themeColors.white,
        fontWeight: 'bold',
        fontSize: 14,
      },
    },
    ////////////////////////////////////////////
    Listing: {
      card: {
        height: screenHeight,
        width: screenWidth,
        alignItems: 'center',
      },
      cardBackground: {
        position: 'absolute',
        width: 0.9 * screenWidth,
        height: 0.79 * screenHeight,
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRadius: 20,
        borderWidth: 0.005 * screenHeight,
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        bottom: Platform.OS == 'ios' ? '28%' : '23%',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      cardBackground2: {
        position: 'absolute',
        width: 0.9 * screenWidth,
        height: 0.8 * screenHeight,
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRadius: 20,
        borderWidth: 0.005 * screenHeight,
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        bottom: Platform.OS == 'ios' ? '15.5%' : '10%',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      top_rhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: '100%',
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkerRedPurple,
        opacity: 0.6,
        transform: [{ rotate: '45deg' }],
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      mid_rhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: '70%',
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkerRedPurple,
        opacity: 0.6,
        transform: [{ rotate: '45deg' }],
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      bottom_rhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: '35%',
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkerRedPurple,
        opacity: 0.6,
        transform: [{ rotate: '45deg' }],
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      base_rhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: 0.55 * screenHeight,
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkerRedPurple,
        opacity: 0.6,
        transform: [{ rotate: '45deg' }],
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      topR_circle: {
        width: 0.1 * screenWidth,
        height: 0.1 * screenWidth,
        borderRadius: 25,
        backgroundColor: themeColors.BB_darkPink,
        opacity: 0.2,
        position: 'absolute',
        top: 0.03 * screenHeight,
        right: 0.06 * screenWidth,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      topL_circle: {
        width: 0.1 * screenWidth,
        height: 0.1 * screenWidth,
        borderRadius: 25,
        backgroundColor: themeColors.BB_darkPink,
        opacity: 0.2,
        position: 'absolute',
        top: 0.03 * screenHeight,
        left: 0.06 * screenWidth,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      priceContainer: {
        position: 'absolute',
        zIndex: 5,
        width: '60%',
        height: 0,
        bottom: 0,
        left: -70,
        borderBottomWidth: 50,
        borderBottomColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        borderLeftWidth: 50,
        borderLeftColor: 'transparent',
        borderRightWidth: 50,
        borderRightColor: 'transparent',
        borderStyle: 'solid',
        alignSelf: 'center',
      },
      image: {
        height: '100%',
        width: '100%',
      },
      title: {
        alignSelf: 'center',
        position: 'absolute',
        top: '5.5%',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 0.02 * screenHeight,
      },
      sellerInfoBox: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        top: '11%',
        width: '90%',
        height: '20%',
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        marginBottom: 0.1 * screenHeight,
      },
      sellerPic: {
        alignSelf: 'center',
        height: '80%',
        bottom: -10,
        aspectRatio: 1,
        borderRadius: 20,
      },
      sellerName: {
        alignSelf: 'center',
        alignContent: 'center',
        textAlign: 'center',
        width: '300%',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        bottom: 5,
      },
      locationPin: {
        position: 'absolute',
        alignSelf: 'center',
        width: '40%',
        height: '60%',
        borderRadius: 20,
      },
      city: {
        alignSelf: 'center',
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        top: '50%',
      },
      distance: {
        alignSelf: 'center',
        fontSize: 12,
        color: 'white',
        position: 'absolute',
        top: '62%',
        marginTop: 0.01 * screenHeight,
      },
      ratingStar: {
        alignSelf: 'center',
        position: 'absolute',
        width: '30%',
        height: '60%',
        borderRadius: 20,
      },
      rating: {
        alignSelf: 'center',
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        top: '50%',
      },
      price: {
        fontSize: (0.9 * screenWidth) / 3 / 5,
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        zIndex: 10,
        left: '20%',
        top: 0.01 * screenHeight,
      },
      lowerRow: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        width: '90%',
        height: '20%',
        top: '31.5%',
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      },
      conditionText: {
        top: '35%',
        fontSize: 14,
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        width: '70%',
      },
      transactionText: {
        top: '20%',
        fontSize: 12,
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        width: '100%',
      },
      tagColumn: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'column',
        bottom: '0%',
        width: '100%',
        height: '70%',
      },
      tagText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        width: '100%',
        marginBottom: '2%',
      },
      descriptionContainer: {
        position: 'absolute',
        alignSelf: 'center',
        height: '40%',
        width: '90%',
        bottom: '8%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 5,
        borderRadius: 20,
      },
      description: {
        fontSize: 16,
        color: 'white',
      },
      likeButton: {
        position: 'absolute',
        height: 0.15 * screenWidth,
        width: 0.15 * screenWidth,
        bottom: '1%',
        right: '2%',
        zIndex: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
        borderRadius: 80,
      },
      deleteButton: {
        position: 'absolute',
        height: 0.15 * screenWidth,
        width: 0.15 * screenWidth,
        top: 10,
        left: '5%',
        zIndex: 1,
      },
      modalContainer: {
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        padding: 20,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
        alignSelf: 'center',
        marginTop: '80%',
        ...Platform.select({
          ios: {
            shadowColor: themeColors.black,
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.6,
            shadowRadius: 5,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      modalText: {
        fontSize: 18,
        marginBottom: 15,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
      },
      confirmButton: {
        flex: 1,
        backgroundColor: theme === 'dark' ? Colors.BB_violet : Colors.BB_red,
        padding: 10,
        borderRadius: 5,
      },
      cancelButton: {
        flex: 1,
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
      },
      timeSinceContainer: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 20,
        position: 'absolute',
        right: '1%',
        top: '0.5%',
        height: '5%',
        width: 'auto',
      },
      timeSinceText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
        marginRight: '2%',
        marginLeft: '2%',
      },
      backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.1,
      },
    },
    ////////////////////////////////////////////
    TopBarGeneric: {
      logo: {
        height: 0.1 * screenWidth,
        width: 0.55 * screenWidth,
        top: 0.025 * screenHeight,
        right: 0.01 * screenWidth,
      },
      topBar: {
        position: 'absolute',
        height: 0.09 * screenHeight,
        width: screenWidth,
        backgroundColor: themeColors.BB_darkRedPurple,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderColor:
          Platform.OS == 'ios' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)',
        zIndex: 10,
      },
    },
    ////////////////////////////////////////////
    CustomRefreshControl: {
      bouncePulseContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: -0.04 * screenHeight,
        alignItems: 'center',
      },
    },
    ////////////////////////////////////////////
    BouncePulse: {
      container: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        height: 0.1 * screenHeight,
      },
      dot: {
        top: 0.08 * screenHeight,
        backgroundColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 4,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          },
          android: {
            elevation: 5,
          },
        }),
      },
    },
    ////////////////////////////////////////////
    BottomNavOverlay: {
      tabButtonContainer: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        borderTopWidth: 3,
        borderColor:
          Platform.OS == 'ios' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)',
        height: Platform.OS === 'ios' ? '200%' : null,
      },
      tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        bottom: Platform.OS === 'ios' ? '25%' : null,
      },
      outerRhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: '85%',
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkPink,
        opacity: 0.1,
        transform: [{ rotate: '45deg' }],
        ...Platform.select({
          ios: {
            bottom: 0,
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      innerRhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: '45%',
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkPink,
        opacity: 0.1,
        transform: [{ rotate: '45deg' }],
        ...Platform.select({
          ios: {
            bottom: 0.03 * screenHeight,
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
    },
    ////////////////////////////////////////////
    ContactInfoScreen: {
      safeareaview: {
        flex: 1,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
      container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      topBar: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: themeColors.BB_darkRedPurple,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 2,
        paddingTop: Platform.OS == 'android' ? 20 : 0,
        borderBottomColor: themeColors.black,
      },
      topBarContainer: {
        justifyContent: 'center',
        width: '100%',
      },
      headerText: {
        color: Colors.BB_bone,
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingLeft: 10,
      },
      iconContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      },
      itemContainer: {
        paddingVertical: 10,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      data: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
        padding: 8,
        backgroundColor:
          theme === 'dark' ? themeColors.BB_darkRedPurple : Colors.white,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      thinHorizontalBar: {
        height: 10,
        top: 2,
        backgroundColor: themeColors.BB_darkRedPurple,
        width: '100%',
        borderRadius: 5,
        alignContent: 'center',
      },
      circleContainer: {
        position: 'absolute',
        top: 15,
        left: Platform.OS == 'ios' ? 15 : 0,
        backgroundColor: theme === 'dark' ? Colors.BB_violet : Colors.BB_bone,
      },
      circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme === 'dark' ? Colors.BB_violet : Colors.BB_bone,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
      },
      thinHorizontalBar: {
        height: 10,
        top: 2,
        backgroundColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        width: '100%',
        borderRadius: 5,
        alignContent: 'center',
      },
      buttonText: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 15,
        color: themeColors.white,
      },
      button: {
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 20,
        marginVertical: 10,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
    },
    ////////////////////////////////////////////
    CreateListing: {
      wrapper: {
        flex: 1,
        width: '100%',
        marginTop: 0,
        backgroundColor: themeColors.BB_bone,
      },
      scrollfield: {
        top: 0.08 * screenHeight,
        height: 'auto',
        backgroundColor: themeColors.BB_bone,
      },
      buttonText2: {
        marginTop: 10,
        color: themeColors.black,
        fontSize: 22,
        alignSelf: 'center',
        fontWeight: 'bold',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.BB_bone,
      },
      minorLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
      imageField: {
        alignSelf: 'center',
        width: '95%',
        height: 0.95 * screenWidth,
        backgroundColor: themeColors.white,
        borderRadius: 20,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.9,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      deleteButton: {
        position: 'absolute',
        alignContent: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        top: 2,
        right: 2,
        backgroundColor:
          theme === 'dark'
            ? themeColors.BB_darkRedPurple
            : 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        zIndex: 2,
        textAlign: 'center',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      deleteButtonText: {
        color: theme === 'dark' ? Colors.BB_violet : Colors.BB_red,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
      },
      tagField: {
        alignSelf: 'center',
        width: '95%',
        height: 0.4 * screenHeight,
        backgroundColor: themeColors.white,
        borderRadius: 20,
        top: 30,
        marginBottom: 50,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      tagRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        marginTop: 10,
      },
      tagContainer: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: 0.075 * screenHeight,
        width: 0.3 * screenWidth,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.9,
            shadowRadius: 2,
          },
        }),
      },
      tagText: {
        color: themeColors.white,
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      rhombus: {
        alignSelf: 'center',
        position: 'absolute',
        width: 0.055 * screenHeight,
        aspectRatio: 1,
        backgroundColor: themeColors.BB_darkPink,
        opacity: 0.15,
        transform: [{ rotate: '45deg' }],
      },
      tagSelected: {
        alignSelf: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        borderRadius: 20,
        height: '100%',
        width: '100%',
        position: 'absolute',
      },
      innerField: {
        margin: 10,
        marginTop: 20,
        width: '95%',
        height: '95%',
      },
      itemContainer: {
        width: '33%',
        height: '33%',
        alignContent: 'center',
        justifyContent: 'center',
      },
      item: {
        marginTop: 10,
        width: 0.25 * screenWidth,
        height: 0.25 * screenWidth,
        borderRadius: 8,
        borderColor: themeColors.BB_darkRedPurple,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.9,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
      },
      image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
      },
      container: {
        flex: 1,
        paddingTop: 50, //top of page
        padding: 30, //all around
        backgroundColor: '#D6447F',
      },
      createButton: {
        marginTop: 20,
        alignSelf: 'center',
        width: screenWidth * 0.4,
        backgroundColor: themeColors.BB_darkRedPurple,
        padding: 5,
        borderRadius: 10,
        fontWeight: 'bold',
        height: 36,
        width: 150,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.9,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },

      label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: themeColors.black,
        marginTop: 20,
        left: 0.05 * screenWidth,
      },
      asterisk: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme === 'dark' ? Colors.BB_violet : Colors.BB_red,
        left: 0.05 * screenWidth,
      },
      errorMessage: {
        fontSize: 12,
        color: theme === 'dark' ? Colors.BB_violet : Colors.BB_red,
        marginLeft: 10,
        top: 0.008 * screenHeight,
        left: 0.05 * screenWidth,
      },

      input: {
        height: 40,
        borderColor: themeColors.BB_black,
        borderRadius: 10,
        backgroundColor: 'white',
        opacity: 0.9,
        //marginBottom: 10,
        width: '90%',
        left: '5%',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.9,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
        textAlign: 'center',
        color: 'black',
      },
      multilineInput: {
        height: 120,
      },
      pickerStyle: {
        //bottomMargin: 10,
        height: 50,
        left: 0.05 * screenWidth,
        width: '45%',
        color: themeColors.white,
        justifyContent: 'center',
      },
      button: {
        width: 150,
        height: 36,
        backgroundColor: themeColors.BB_darkRedPurple,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        borderColor: themeColors.black,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.9,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
      },

      rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      characterCounter: {
        fontSize: 12,
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
        position: 'absolute',
        right: 0.05 * screenWidth,
        bottom: 13,
      },
      loading: {
        height: screenHeight,
        width: screenWidth,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      },
      spacer: {
        height: 0.15 * screenHeight,
      },
      currencyButtonContainer: {
        alignItems: 'center',
        zIndex: 2,
        //marginTop: 20,
      },
      currencyButton: {
        width: 100,
        height: 40,
        backgroundColor: themeColors.BB_darkRedPurple,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'black',
        //marginTop: -29.5
      },
      currencyButtonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
      },
      modalHeader: {
        backgroundColor: themeColors.BB_darkRedPurple,
        height: 0.1 * screenHeight,
        top: 0,
        width: screenWidth,
        zIndex: -1,
      },
      modalContent: {
        flex: 1,
        alignItems: 'center',
        marginTop: 0.05 * screenHeight,
        width: '40%',
        height: 'auto',
        alignSelf: 'center',
        borderRadius: 20,
        backgroundColor:
          theme === 'dark' ? themeColors.BB_darkRedPurple : Colors.BB_bone,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      currencyOptionsContainer: {
        height: 'auto',
        width: '100%',
        alignItems: 'center',
      },
      currencyOption: {
        fontSize: 24,
        color: theme === 'dark' ? Colors.BB_violet : Colors.black,
        marginVertical: 10,
      },
      closeButtonContainer: {
        top: 0.7 * screenHeight,
        alignSelf: 'center',
        zIndex: 2,
        marginTop: 20,
        borderRadius: 20,
      },
      closeButton: {
        borderRadius: 20,
        alignSelf: 'center',
        backgroundColor: themeColors.BB_darkRedPurple,
        padding: 10,
        paddingRight: 15,
        paddingLeft: 15,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: { height: 2, width: 2 },
          },
          android: {
            elevation: 10,
          },
        }),
      },
      closeButtonText: {
        fontSize: 20,
        color: theme === 'dark' ? Colors.BB_violet : Colors.BB_bone,
        alignSelf: 'center',
      },
      currencyScrollView: {
        position: 'absolute',
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        width: '100%',
        height: '100%',
        top: Platform.OS === 'ios' ? 0.1 * screenHeight : 0,
      },
      modalFooter: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 0.15 * screenHeight,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
      //Image Select Modal
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor:
          theme === 'dark' ? themeColors.BB_darkRedPurple : Colors.BB_bone,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
          android: {
            elevation: 5,
          },
        }),
      },
      imagePickerButton: {
        flexDirection: 'row',
        width: 200,
        height: 50,
        marginBottom: 10,
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        borderRadius: 10,
        borderColor: themeColors.black,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.6,
            shadowRadius: 4,
          },
          android: {
            elevation: 5,
          },
        }),
      },
      imagePickerButtonText: {
        fontSize: 18,
        color: 'black',
        alignSelf: 'center',
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      pickerBackground: {
        position: 'absolute',
        width: 0.9 * screenWidth,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.white,
        shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
    },
    ////////////////////////////////////////////
    EditProfileScreen: {
      safeareaview: {
        flex: 1,
        backgroundColor: themeColors.BB_darkRedPurple,
      },
      modalHeader: {
        fontSize: 30,
        textAlign: 'center',
        marginVertical: 5,
        color: theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
      },
      modalContainer: {
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        padding: 20,
        borderRadius: 10,
        borderColor: themeColors.BB_darkRedPurple,
        borderWidth: 3,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
          },
          android: {
            elevation: 5,
          },
        }),
      },
      modalTitle: {
        fontSize: 12,
        marginBottom: 10,
        color: themeColors.BB_darkRedPurple,
        textAlign: 'center',
      },
      button: {
        width: 130,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
          theme === 'dark' ? Colors.violet : Colors.BB_darkRedPurple,
        borderRadius: 10,
        marginHorizontal: 10,
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
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
      topBar: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: themeColors.BB_darkRedPurple,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderBottomColor: themeColors.black,
      },
      topBarContainer: {
        justifyContent: 'center',
        width: '100%',
      },
      headerText: {
        color: Colors.BB_bone,
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
      },
      input: {
        height: 44,
        width: '100%',
        borderColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: 'center',
        paddingLeft: 8,
        marginBottom: 10,
      },
      thinHorizontalBar: {
        height: 10,
        top: 2,
        backgroundColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        width: '100%',
        borderRadius: 5,
        alignContent: 'center',
      },
      itemTitle: {
        color: theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        fontWeight: 'bold',
        fontSize: 18,
        paddingBottom: 5,
        paddingLeft: 5,
      },
      itemTextField: {
        height: 45,
        borderColor:
          theme === 'dark' ? Colors.BB_violet : Colors.BB_darkRedPurple,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        paddingLeft: 20,
        backgroundColor:
          theme === 'dark' ? themeColors.BB_darkRedPurple : Colors.white,
      },
      itemContainer: {
        paddingVertical: 5,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
      },
      confirmButton: {
        backgroundColor: themeColors.BB_red,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      cancelButton: {
        padding: 10,
      },
      confirmButtonText: {
        color: themeColors.white,
        textAlign: 'center',
      },
      cancelButtonText: {
        color: themeColors.BB_darkRedPurple,
        textAlign: 'center',
      },
      circleContainer: {
        position: 'absolute',
        top: 15,
        left: Platform.OS == 'ios' ? 15 : 0,
      },
      circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme === 'dark' ? Colors.BB_violet : Colors.BB_bone,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
      },
      deleteAccountButton: {
        width: 150,
        height: 36,
        backgroundColor: themeColors.BB_red,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor:
          theme === 'dark' ? themeColors.BB_darkRedPurple : Colors.BB_bone,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
          android: {
            elevation: 5,
          },
        }),
      },
      imagePickerButton: {
        flexDirection: 'row',
        width: 200,
        height: 50,
        marginBottom: 10,
        backgroundColor: theme === 'dark' ? Colors.black : Colors.BB_bone,
        borderRadius: 10,
        borderColor: themeColors.black,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        ...Platform.select({
          ios: {
            shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.6,
            shadowRadius: 4,
          },
          android: {
            elevation: 5,
          },
        }),
      },
      imagePickerButtonText: {
        fontSize: 18,
        color: 'black',
        alignSelf: 'center',
        color: theme === 'dark' ? Colors.BB_bone : Colors.black,
      },
      pickerBackground: {
        position: 'absolute',
        width: 0.9 * screenWidth,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.white,
        shadowColor: theme === 'dark' ? Colors.BB_violet : Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
      },
    },
    ////////////////////////////////////////////
    LoginScreen: {
      container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.BB_darkRedPurple,
        alignItems: 'center',
        padding: 16,
      },
      loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BB_pink,
        padding: 20,
        borderRadius: 10,
        ...Platform.select({
          ios: {
            shadowColor: Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      input: {
        width: screenWidth * 0.45,
        height: screenHeight * 0.04,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 7,
        backgroundColor: 'white',
        ...Platform.select({
          ios: {
            shadowColor: Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      loginTextContainer: {
        width: screenWidth * 0.2,
        backgroundColor: Colors.BB_rangeYellow,
        padding: 5,
        width: '100%',
        borderColor: Colors.black,
        borderRadius: 10,
        fontWeight: 'bold',
        ...Platform.select({
          ios: {
            shadowColor: Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      loginText: {
        fontSize: 15,
      },
      createAccountTextContainer: {
        marginTop: 10,
        padding: 5,
        borderColor: Colors.black,
        borderRadius: 10,
        color: 'black',
        fontWeight: 'bold',
      },
      createAccountText: {
        fontSize: 8,
        color: 'white',
      },
      logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        shadowRadius: 3,
        ...Platform.select({
          ios: {
            shadowColor: Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
    },
    ////////////////////////////////////////////
    CreateAccountScreen: {
      container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.BB_darkRedPurple,
        alignItems: 'center',
        padding: 16,
      },
      loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BB_pink,
        width: screenWidth * 0.8,
        height: 'auto',
        padding: 20,
        borderRadius: 10,
        ...Platform.select({
          ios: {
            shadowColor: Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      createAccountTextContainer: {
        width: screenWidth * 0.4,
        backgroundColor: Colors.BB_rangeYellow,
        padding: 5,
        borderColor: Colors.black,
        borderRadius: 10,
        fontWeight: 'bold',
        ...Platform.select({
          ios: {
            shadowColor: Colors.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
          android: {
            elevation: 10,
          },
        }),
      },
      createAccountText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
      },
      loginTextContainer: {
        marginTop: 10,
        padding: 5,
        borderColor: Colors.black,
        borderRadius: 10,
        color: 'black',
        fontWeight: 'bold',
      },
      loginText: {
        fontSize: 10,
        color: 'white',
      },
      input: {
        width: screenWidth * 0.75,
        height: screenHeight * 0.03,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 7,
        backgroundColor: 'white',
      },
      logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
      },
      passwordRequirements: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: screenWidth * 0.4,
        height: 'auto',
        marginBottom: 15,
      },
      passwordRequirement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12,
        color: 'white',
      },
    },
    ////////////////////////////////////////////
    Authentication: {
      container: {
        flex: 1,
        backgroundColor: Colors.BB_darkRedPurple,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  });
};
