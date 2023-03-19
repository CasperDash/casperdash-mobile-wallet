import React, { useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

PushNotification.createChannel(
  {
    channelId: 'CasperDash_channel',
    channelName: 'CasperDash_channel',
    importance: Importance.HIGH,
    vibrate: true,
  },
  () => {},
);

export default function Notification() {
  const dispatch = useDispatch();

  useEffect(() => {
    requestUserPermission();
    getListenNotification();
    getNotificationToken();
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token: string) {},

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification: any) {
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification: any) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err: any) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: Platform.OS === 'ios',
    });
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission({
      alert: false,
      announcement: false,
      badge: true,
      carPlay: false,
      provisional: false,
      sound: true,
    });
  };

  const getListenNotification = () => {
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          dispatch(allActions.user.getInformation(null, null));
        }
      });

    messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage) {
        dispatch(allActions.user.getInformation(null, null));
        PushNotification.localNotification({
          channelId: 'CasperDash_channel',
          autoCancel: true,
          id: '1',
          title: remoteMessage.notification && remoteMessage.notification.title ? remoteMessage.notification.title : '',
          message: remoteMessage.notification && remoteMessage.notification.body ? remoteMessage.notification.body : '',
        });
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      dispatch(allActions.user.getInformation(null, null));
    });
  };

  const getNotificationToken = async () => {
    // Get the token
    const token = await messaging().getToken();
    dispatch(allActions.user.updateTokenFCM({ token }, null));
  };

  return (
    <View>
      <Text />
    </View>
  );
}
