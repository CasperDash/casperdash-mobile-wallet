# casperdash-mobile-wallet

# Welcome to first Casper Mobile Wallet 👋

Development workflow: https://github.com/CasperDash/casperdash-client/wiki/Development-Workflow

Project: https://github.com/orgs/CasperDash/projects/2

## Prerequisites

- [Watchman](https://facebook.github.io/watchman)
- [Xcode 12](https://developer.apple.com/xcode)
- [Cocoapods 1.10.1](https://cocoapods.org)
- [JDK > 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio and Android SDK](https://developer.android.com/studio)

## Requirements

Node 14 or 15 required. Development for iOS requires a Mac and Xcode 10 or up, and will target iOS 11 and up.

You also need to install the dependencies required by React Native.  
Go to the [React Native environment setup](https://reactnative.dev/docs/environment-setup), then select `React Native CLI Quickstart` tab.  
Follow instructions for your given `development OS` and `target OS`.

## Quick start

Assuming you have all the requirements installed, you can run the project by running:

- `yarn setup-env` to setup the environment files for mainnet and testnet
- `yarn start` to start the metro bundler, in a dedicated terminal
- `cd ios && pod install` to run the pod installation
- go to the project root and run `yarn <platform>` to run the *platform* application (remember to start a simulator or connect a device). Platform should be `ios` or `android`.

## Setup environments

To define which env you want to use, just keep the structure `yarn env:[environment]`

testnet: `yarn env:testnet`
mainnet: `yarn env:mainnet`

Modify the environment variables files in `scripts/configs/env.[environment].js` and run the above commands.

## Folder structure

- `src`: This folder is the main container of all the code inside your application.
  - `assets`: Asset folder to store all images, vectors, etc.
  - `components`: Folder to store any common component that you use through your app (such as a generic button).
  - `device`: Folder to store any kind of constant that you have.
  - `navigation`: Folder to store the navigators.
  - `redux_manager`: Folder to manage redux state.
  - `screens`: Folder to store the languages files.
  - `services`: This folder should have all your reducers, and expose the combined result using its `index.js`
  - `utils`: Folder to contains utility and helper functions.