import React, { RefObject } from 'react';
import WebView from 'react-native-webview';

const BrowserContext = React.createContext<RefObject<WebView>>(null!);

export default BrowserContext;
