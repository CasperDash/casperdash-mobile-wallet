import { Alert,Platform,Linking } from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const ROOT_HTTP = 'https://geneza.techzeus.co/';
const ROOT_IMAGE='https://geneza.techzeus.co';
const ROOT_SOCKET = 'https://socket.weshops.trade';

let token = null;

const transCodeError = (message: string) => {
  if (message === 'Phone is exist') {
    return 'Số điện thoại đã được đăng ký';
  }
  if (message === 'Phone or password is not correct') {
    return 'Số điện thoại hoặc mật khẩu không chính xác';
  }
  if (message === 'This device using max 2 account') {
    return 'Thiết bị này đã đăng ký tối đa 2 tài khoản';
  }
  if (message === 'This device using max 1 account') {
    return 'Thiết bị này đã đăng ký tối đa 1 tài khoản';
  }
  if (message === 'You need update password level 2') {
    return 'Bạn chưa có mật khẩu cấp 2. Vui lòng thêm mới';
  }
  if (message === 'Password level 2 is not correct') {
    return 'Mật khẩu cấp 2 không chính xác';
  }

  return message.toString();
};

const hideBankCardNumber = (num: string) => {
  let threeLastDigits = num.substr(num.length - 3);
  let coveredDigits = num
    .substr(0, num.length - 3)
    .replace(/\d+/g, '**** **** ***  ');
  return coveredDigits + threeLastDigits;
};

const hidePhoneNumber = (tel = '') => {
  let threeDigits = tel.substr(0, 3);
  let lastTwoDigits = tel.substr(tel.length - 2);
  let coveredDigits = tel.substr(3, tel.length - 2).replace(/\d+/g, '*****');
  return threeDigits + coveredDigits + lastTwoDigits;
};

const hideWalletBalance = (money = '') => {
  let m = money.replace(/\.|,/gi, '');
  return m.replace(/\d+/g, '*****');
};

const formatPrice = (price = '', type = ',') => {
  if (price?.length) {
    return price.replace(/\./gi, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${type}`);
  }
  return price;
};

const formatDecimalNumber = function (string: any, format: number) {
  if(!string) {
    return '';
  }
  let val = '';
  let newFormat = format ? format : 0;
  let newString = string.toFixed(newFormat);
  let newStringBeforString = newString.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let newStringAfterString = newString.split('.')[1];

  val = newStringBeforString;

  if (newStringAfterString && newStringAfterString.length > 0) {
    val = newStringBeforString + '.' + newStringAfterString;
  }
  return val;
};

const sumValues = (arr: any[], key: string): number => {
  return arr.reduce((a, b) => a + (b[key] || 0), 0);
}

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
      !!messAlert ? messAlert : '',
      arrayButton,
      {cancelable: (!(cb || cbCancel))},
  );
};

const validateEmail = (email:any) => {
  const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return emailRegex.test(email);
}

const requestPermission = (permissions: any, callback: () => void) => {
    check(permissions)
      .then((result: any) => {
        if (result == RESULTS.BLOCKED || result == RESULTS.UNAVAILABLE) {
          Alert.alert(
            'Please grant permissions to continue',
            '',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  return;
                },
              },
              {
                text: 'Ok',
                onPress: () => {
                  return Linking.openSettings();
                },
              },
            ],
          );
          return;
        }
        if (result == RESULTS.DENIED) {
          request(permissions).then((r: any) => {
            if (
              r == RESULTS.BLOCKED ||
              r == RESULTS.UNAVAILABLE ||
              r == RESULTS.DENIED
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

const getImageURL = (url: string) => {
    if(url){
      if (url.indexOf('http') < 0) {
        if(url.charAt(0) === '/'){
          return ROOT_IMAGE + url;
        }
        else{
          return ROOT_IMAGE + '/' + url;
        }
      }
      return url;
    }
    return null
};

const validate = (text:string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(text);
}

export default {
  ROOT_HTTP,
  alertMess,
  hideBankCardNumber,
  hidePhoneNumber,
  hideWalletBalance,
  formatPrice,
  formatDecimalNumber,
  sumValues,
  ROOT_SOCKET,
  ROOT_IMAGE,
  token,
  validateEmail,
  requestPermission,
  getImageURL,
  validate
};
