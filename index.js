/**
 * @format
 */
import 'react-native-gesture-handler';
import './polyfill';
import './shim';
import './shim-legacy';

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreLogs(['EventEmitter.removeListener']);

AppRegistry.registerComponent(appName, () => App);
