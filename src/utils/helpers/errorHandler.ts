import Toast from 'react-native-toast-message';

export const toastError = (message?: string) => {
  Toast.show({ type: 'error', text1: 'Oops!', text2: message || 'Something went wrong. Please try again later.' });
};
