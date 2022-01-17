/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import './shim'; // Import polyfill features
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
