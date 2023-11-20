import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";

export async function scheduleNotification(newListings) {
  await Permissions.askAsync(Permissions.NOTIFICATIONS);

  const username = await SecureStore.getItemAsync("username");
  const userScheduledKey = `scheduledNotification_${username}`;
  const hasScheduledNotification = await AsyncStorage.getItem(userScheduledKey);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationReceivedListener(notification => {
    console.log('Received notification: ', notification);
  });

  if (!hasScheduledNotification) {
    const messageAlternatives = [
      'New Listings!',
      "You're missing out!",
      "Check out what's new!"
    ];
    const bodyAlternatives = [
      'Check out these' + newListings + ' new listings!',
      'There are' + newListings + ' new listings since your last login!',
      '' + newListings + ' new listings have been posted!'
    ]
    const randomMessageIndex = Math.floor(Math.random() * messageAlternatives.length);
    const selectedMessage = messageAlternatives[randomMessageIndex];

    const randomBodyIndex = Math.floor(Math.random() * bodyAlternatives.length);
    const selectedBody = bodyAlternatives[randomBodyIndex];

    const schedulingOptions = {
      content: {
        title: selectedMessage,
        body: selectedBody,
      },
      trigger: {
        seconds: 0, // Start immediately
        repeats: true, // Set to repeat
        seconds: 60 * 60 * 24, // 60 seconds * 60 minutes = 1 hour
      },
    };

    await Notifications.scheduleNotificationAsync(schedulingOptions);
    await AsyncStorage.setItem(userScheduledKey, 'true');
  }
}

export async function likedNotification(likedListings) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationReceivedListener(notification => {
    console.log('Received notification: ', notification);
  });

  const schedulingOptions = {
    content: {
      title: 'Post Activity',
      body: 'Someone liked your post!',
    },
    trigger: null, // Immediate trigger
  };
  await Notifications.scheduleNotificationAsync(schedulingOptions);
}

export async function postingTimeout(days) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationReceivedListener(notification => {
    console.log('Received notification: ', notification);
  });

  const schedulingOptions = {
    content: {
      title: 'Post Expiring!',
      body: 'Your post will be deleted in' + days + ' days due to inactivity! Please take action.',
    },
    trigger: null, // Immediate trigger
  };
  await Notifications.scheduleNotificationAsync(schedulingOptions);
}