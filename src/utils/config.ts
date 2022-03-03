import {Alert, Linking} from 'react-native';
import {check, request, RESULTS} from 'react-native-permissions';
import SInfo from 'react-native-sensitive-info';
import * as RNLocalize from 'react-native-localize';
import {EXPLORER_URL} from 'utils/constants/key';

const ROOT_HTTP = __DEV__ ? 'https://testnet-api.casperdash.io' : 'https://api.casperdash.io';

const locales = RNLocalize.getLocales();
const defaultLocale = locales && locales[0] && locales[0].languageTag;

const alertMess = function (data: any, title?: any, cb?: Function, cbCancel?: Function) {
    let messAlert = data && data.message ? data.message : 'System error';
    let titleAlert = data && data.title ? data.title : 'Message';
    const arrayButton: any = [];
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

const saveItem = async (key: string, value: any, options?: any) => {
    await SInfo.setItem(key, JSON.stringify(value), Object.assign({
        sharedPreferencesName: 'casperdashSharedPrefs',
        keychainService: 'casperdashKeychain',
    }, options));
};

const getItem = async (key: string, options?: any) => {
    let data = await SInfo.getItem(key, Object.assign({
        sharedPreferencesName: 'casperdashSharedPrefs',
        keychainService: 'casperdashKeychain',
    }, options));
    return data ? JSON.parse(data) : null;
};

const deleteItem = async (key: string, options?: any) => {
    return SInfo.deleteItem(key, Object.assign({
        sharedPreferencesName: 'casperdashSharedPrefs',
        keychainService: 'casperdashKeychain',
    }, options));
};

const getViewExplorerURL = (type: string, value: string) => {
    return `${EXPLORER_URL}/${type}/${value}`;

};
export default {
    ROOT_HTTP,
    alertMess,
    requestPermission,
    saveItem,
    getItem,
    deleteItem,
    getViewExplorerURL,
    defaultLocale,
};
