# casperdash-mobile-wallet

# Welcome to first Casper Mobile Wallet 👋

![](https://i.imgur.com/uP2uMfc.jpeg)

## Features / Road map

- [x] Connect with Ledger

- [x] View mode

- [x] Send/Receive CSPR

- [x] Display custom tokens

- [x] Display NFT

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

You can also follow our below quick guide setup.

## Quick setup guide

### macOS & Android

**Node & Watchman**

We recommend installing Node and Watchman using Homebrew. Run the following commands in a Terminal after installing Homebrew:

```bash
brew install node
brew install watchman
```

**Java Development Kit**

We recommend installing JDK using Homebrew. Run the following commands in a Terminal after installing Homebrew:

```
brew install --cask adoptopenjdk/openjdk/adoptopenjdk11
```

**Android development environment**

**1. Install Android Studio**

Download and install Android Studio. While on Android Studio installation wizard, make sure the boxes next to all of the following items are checked:

- Android SDK
- Android SDK Platform
- Android Virtual Device

**2. Install the Android SDK**

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 11 (R) SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

To do that, open Android Studio, click on "Configure" button and select "SDK Manager".
Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 11 (R) entry, then make sure the following items are checked:

Android SDK Platform 30
Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image
Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that 30.0.2 is selected and check the "Android SDK Command-line Tools (latest)".

Finally, click "Apply" to download and install the Android SDK and related build tools.

You can also run the following command after setting ANDROID_HOME.

```bash
sdkmanager "platforms;android-30" "system-images;android-30;default;x86_64" "system-images;android-30;google_apis;x86"
sdkmanager "cmdline-tools;latest" "build-tools;30.0.2"
```

**3. Configure the ANDROID_HOME environment variable**

Add the following lines to your $HOME/.bash_profile or $HOME/.bashrc (if you are using zsh then ~/.zprofile or ~/.zshrc) config file:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### macOS & iOS

**Node & Watchman**

We recommend installing Node and Watchman using Homebrew. Run the following commands in a Terminal after installing Homebrew:

```bash
brew install node
brew install watchman
```

**Xcode**

The easiest way to install Xcode is via the Mac App Store. Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is version 10 or newer.

**CocaPods**

CocoaPods is built with Ruby and it will be installable with the default Ruby available on macOS. You can use a Ruby Version manager, however we recommend that you use the standard Ruby available on macOS unless you know what you're doing.

Using the default Ruby install will require you to use sudo when installing gems. (This is only an issue for the duration of the gem installation, though.)

```bash
sudo gem install cocoapods
```

### Windows & Android

**Node, JDK**

We recommend installing Node via Chocolatey, a popular package manager for Windows.

It is recommended to use an LTS version of Node. If you want to be able to switch between different versions, you might want to install Node via nvm-windows, a Node version manager for Windows.

React Native also requires Java SE Development Kit (JDK), which can be installed using Chocolatey as well.

Open an Administrator Command Prompt (right click Command Prompt and select "Run as Administrator"), then run the following command:

```bash
choco install -y nodejs-lts openjdk11
```

**Android development environment**

**1. Install Android Studio**

Download and install Android Studio. While on Android Studio installation wizard, make sure the boxes next to all of the following items are checked:

- Android SDK
- Android SDK Platform
- Android Virtual Device
- If you are not already using Hyper-V: Performance (Intel ® HAXM) (See here for AMD or Hyper-V)

**2. Install the Android SDK**

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 11 (R) SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

To do that, open Android Studio, click on "Configure" button and select "SDK Manager".

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 11 (R) entry, then make sure the following items are checked:

- Android SDK Platform 30
- Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that 30.0.2 is selected.

Finally, click "Apply" to download and install the Android SDK and related build tools.

**3. Configure the ANDROID_HOME environment variable**

The React Native tools require some environment variables to be set up in order to build apps with native code.

a. Open the Windows Control Panel.

b. Click on User Accounts, then click User Accounts again

c. Click on Change my environment variables

d. Click on New... to create a new ANDROID_HOME user variable that points to the path to your Android SDK:

![](https://i.imgur.com/gak5SWC.png)

The SDK is installed, by default, at the following location:

```bash
%LOCALAPPDATA%\Android\Sdk
```

You can find the actual location of the SDK in the Android Studio "Settings" dialog, under Appearance & Behavior → System Settings → Android SDK.

Open a new Command Prompt window to ensure the new environment variable is loaded before proceeding to the next step.

a. Open powershell

b. Copy and paste Get-ChildItem -Path Env:\ into powershell

c. Verify ANDROID_HOME has been added

4. Add platform-tools to Path

a. Open the Windows Control Panel

b. Click on User Accounts, then click User Accounts again

c. Click on Change my environment variables

d. Select the Path variable

e. Click Edit

f. Click New and add the path to platform-tools to the list

The default location for this folder is:

```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

## Quick start

Assuming you have all the requirements installed, you can run the project by running:

- `yarn setup-env` to setup the environment files for mainnet and testnet
- `yarn start` to start the metro bundler, in a dedicated terminal
- `cd ios && pod install` to run the pod installation
- go to the project root and run `yarn <platform>` to run the _platform_ application (remember to start a simulator or connect a device). Platform should be `ios` or `android`.

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

## Workflow and contributions

Development workflow: https://github.com/CasperDash/casperdash-client/wiki/Development-Workflow

Project: https://github.com/orgs/CasperDash/projects/2

## License

[MIT](https://raw.githubusercontent.com/CasperDash/casperdash-api/master/LICENSE)
