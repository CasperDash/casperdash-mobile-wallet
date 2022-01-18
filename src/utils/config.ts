import { Alert,Linking } from 'react-native';
import {check, request, RESULTS} from 'react-native-permissions';

const ROOT_HTTP = 'https://geneza.techzeus.co/';
const ROOT_IMAGE = 'https://geneza.techzeus.co';
const ROOT_SOCKET = 'https://socket.weshops.trade';

let token = null;

const alertMess = function (data: any, title?: any, cb?: Function, cbCancel?: Function) {
  let messAlert = data && data.message ? data.message : 'System error';
  let titleAlert = data && data.title ? data.title : 'Message';
  const arrayButton :any = [];
  if (cbCancel) {
    arrayButton.push({
      text: title && title.cancel ? title.cancel : 'Cancel',
      onPress: cbCancel,
      style: 'cancel',
    });
  }
  arrayButton.push({text: title && title.submit ? title.submit : 'OK', onPress: cb});
  Alert.alert(
      titleAlert,
      messAlert ? messAlert : '',
      arrayButton,
      {cancelable: (!(cb || cbCancel))},
  );
};

const requestPermission = (permissions: any, data?: any, callback?: () => void) => {
    check(permissions)
      .then((result: any) => {
        if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
          Alert.alert(
              data && data.title ? data.title : '',
              data && data.message ? data.message : 'Please grant permissions to continue',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  return;
                },
              },
              {
                text: 'OK',
                onPress: () => {
                  return Linking.openSettings();
                },
              },
            ],
          );
          return;
        }
        if (result === RESULTS.DENIED) {
          request(permissions).then((r: any) => {
            if (
              r === RESULTS.BLOCKED ||
              r === RESULTS.UNAVAILABLE ||
              r === RESULTS.DENIED
            ) {
              return;
            }
            callback && callback();
          });
          return;
        }
        return callback && callback();
      })
      .catch((error: any) => {
        alertMess(error);
      });
  return;
};

export default {
  ROOT_HTTP,
  alertMess,
  ROOT_SOCKET,
  ROOT_IMAGE,
  token,
  requestPermission,
};
