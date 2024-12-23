import PushNotification, { Importance } from 'react-native-push-notification';

export const CHANNEL_IDS = {
  ONE_DAY: 'ONE_DAY',
  TWO_HOURS: 'TWO_HOURS',
};

export const createChannel = ({
  channelId,
  date,
  message,
  title,
}: {
  channelId: string;
  message: string;
  date: Date;
  title: string;
}) => {
  PushNotification.createChannel(
    {
      channelId: channelId,
      channelName: 'Special messasge',
      channelDescription: 'Notification for special message',
      importance: Importance.HIGH,
      vibrate: true,
    },
    created => {
      console.log(`createChannel returned '${created}'`);
      schedulLocaleNotifications({
        channelId,
        date,
        message,
        title,
      });
    },
  );
};

export const schedulLocaleNotifications = ({
  channelId,
  date,
  message,
  title,
}: {
  channelId: string;
  message: string;
  date: Date;
  title: string;
}) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    message: message, // (required)
    title: title,
    date: date, // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    channelId: channelId,
    /* Android Only Properties */
    repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
  });
};

export const cancelLocalNotification = (channelId: number, time: string) => {
  PushNotification.cancelLocalNotification(
    `${CHANNEL_IDS.ONE_DAY}-${channelId}`,
  );
  PushNotification.cancelLocalNotification(
    `${CHANNEL_IDS.TWO_HOURS}-${channelId}`,
  );
  createChannel({
    channelId: 'cancel',
    date: new Date(),
    message: `Your appointment of ${time} has been cancelled. Please reschedule at your convenience.`,
    title: 'Appointment Cancelled',
  });
};
