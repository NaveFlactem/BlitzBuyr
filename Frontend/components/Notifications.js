import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as SecureStore from 'expo-secure-store';
import { serverIp } from '../config.js';

//Still needs to be connected with backend
export async function scheduleNotification(newListings) {
  await Permissions.askAsync(Permissions.NOTIFICATIONS);

  const username = await SecureStore.getItemAsync('username');
  const userScheduledKey = `scheduledNotification_${username}`;
  const hasScheduledNotification = await AsyncStorage.getItem(userScheduledKey);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationReceivedListener((notification) => {
    console.log('Received notification: ', notification);
  });

  if (!hasScheduledNotification) {
    const messageAlternatives = [
      'New Listings!',
      "You're missing out!",
      "Check out what's new!",
    ];
    const bodyAlternatives = [
      'Check out these' + newListings + ' new listings!',
      'There are' + newListings + ' new listings since your last login!',
      '' + newListings + ' new listings have been posted!',
    ];
    const randomMessageIndex = Math.floor(
      Math.random() * messageAlternatives.length,
    );
    const selectedMessage = messageAlternatives[randomMessageIndex];

    const randomBodyIndex = Math.floor(Math.random() * bodyAlternatives.length);
    const selectedBody = bodyAlternatives[randomBodyIndex];

    const schedulingOptions = {
      content: {
        title: selectedMessage,
        body: selectedBody,
      },
      trigger: {
        seconds: 0,
        repeats: true,
        seconds: 60 * 60 * 24,
      },
    };

    await Notifications.scheduleNotificationAsync(schedulingOptions);
    await AsyncStorage.setItem(userScheduledKey, 'true');
  }
}

//Still needs to be connected with backend
export async function likedNotification(likedListings) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationReceivedListener((notification) => {
    console.log('Received notification: ', notification);
  });

  const schedulingOptions = {
    content: {
      title: 'Your post has been liked!',
      body:
        'Your post has been liked ' +
        likedListings +
        ' times in the past 24 hours',
    },
    trigger: {
      seconds: 0,
      repeats: true,
      seconds: 60 * 60 * 24,
    },
  };
  await Notifications.scheduleNotificationAsync(schedulingOptions);
}

export const checkListingExpiration = async () => {
  await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //FIXME: this needs to be worked on
  try {
    const listingsResponse = await fetch(`${serverIp}/api/listings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (listingsResponse.status === 200) {
      const listingsData = await listingsResponse.json();
      const currentTime = new Date();
      listingsData.forEach(async (listing) => {
        const postDate = new Date(listing.PostDate) - 8 * 3600000;
        const twelveDays = 1 * 24 * 60 * 60 * 12;

        if (Math.floor((currentTime - postDate) / 1000) >= twelveDays) {
          const userName = listing.Username;

          await userNotification(userName, listing.Title);
        }
      });
    } else {
      console.log('Error retrieving listings');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const userNotification = async (userName, listingTitle) => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  try {
    const currentUser = await SecureStore.getItemAsync('username');
    if (currentUser == userName) {
      const schedulingOptions = {
        content: {
          title: 'Listing Expiry!',
          body:
            "Your listing named: '" +
            listingTitle +
            "' is about to expire in 2 days!",
        },
        trigger: null,
      };

      await Notifications.scheduleNotificationAsync(schedulingOptions);
    }
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};
