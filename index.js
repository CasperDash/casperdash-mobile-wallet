/**
 * @format
 */
import 'react-native-gesture-handler';
import "./polyfill";
import {AppRegistry, LogBox} from 'react-native';
import './shim'; // Import polyfill features
import App from './App';
import { name as appName } from './app.json';
LogBox.ignoreLogs(['new NativeEventEmitter']);
AppRegistry.registerComponent(appName, () => App);
