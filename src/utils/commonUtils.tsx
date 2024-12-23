import { ToastAndroid } from 'react-native';

export const showToast = (message: string) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER, // You can also use ToastAndroid.BOTTOM or ToastAndroid.TOP
  );
};

export const STATUS = {
  Done: 'Done',
  Pending: 'Pending',
  Cancelled: 'Cancelled',
};
