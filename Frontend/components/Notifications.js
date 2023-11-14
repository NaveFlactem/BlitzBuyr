import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";

export async function scheduleNotification() {
  await Permissions.askAsync(Permissions.NOTIFICATIONS);

  const userScheduledKey = `scheduledNotification_${SecureStore.getItemAsync("username")}`;
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
    const schedulingOptions = {
      content: {
        title: 'New Listings!',
        body: `There are _ new listings since your last login!`,
      },
      trigger: {
        seconds: 0, // Start immediately
        repeats: true, // Set to repeat
        seconds: 60 * 60, // 60 seconds * 60 minutes = 1 hour
      },
    };

    await Notifications.scheduleNotificationAsync(schedulingOptions);
    await AsyncStorage.setItem(userScheduledKey, 'true');
  }
}

export async function likedNotification() {
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