# casperdash-mobile-wallet

# Welcome to first Casper Mobile Wallet 👋

![](https://i.imgur.com/lZh9LSc.png)

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

**4. Add platform-tools to Path**

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

**Notes**

Run android might caught this issue.

> SDK location not found. Define location with sdk.dir in the local.properties file or with an ANDROID_HOME environment variable.

Sometimes, configure the ANDROID_HOME environment variables are not enough. You can resolve the issue by following these steps:

1. Go to your React-native Project -> Android
2. Create a file local.properties
3. Open the file paste your Android SDK path like below:

Windows: `sdk.dir = C:\Users\<USERNAME>\AppData\Local\Android\sdk`

macOS: `sdk.dir = /Users/<USERNAME>/Library/Android/sdk`

Linux: `sdk.dir = /home/USERNAME/Android/Sdk`

_USERNAME_ is your current user name.

### Linux & Android

**Node, JDK**

Follow the [installation instructions for your Linux distribution](https://nodejs.org/en/download/package-manager/) to install Node 14 or newer.

**Java Development Kit**

React Native currently recommends version 11 of the Java SE Development Kit (JDK). You may encounter problems using higher JDK versions. You may download and install OpenJDK from AdoptOpenJDK or your system packager.

**Android development environment**

**1. Install Android Studio**

[Download and install Android Studio](https://developer.android.com/studio/index.html). While on Android Studio installation wizard, make sure the boxes next to all of the following items are checked:

- Android SDK
- Android SDK Platform
- Android Virtual Device

Then, click "Next" to install all of these components.

> If the checkboxes are grayed out, you will have a chance to install these components later on.

Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

**2. Install the Android SDK**

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 12 (S) SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

To do that, open Android Studio, click on "Configure" button and select "SDK Manager".

> The SDK Manager can also be found within the Android Studio "Preferences" dialog, under Appearance & Behavior → System Settings → Android SDK.

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 12 (S) entry, then make sure the following items are checked:

- Android SDK Platform 31
- Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that 31.0.0 is selected.

Finally, click "Apply" to download and install the Android SDK and related build tools.

**3. Configure the ANDROID_HOME environment variable**

The React Native tools require some environment variables to be set up in order to build apps with native code.

Add the following lines to your $HOME/.bash_profile or $HOME/.bashrc (if you are using zsh then ~/.zprofile or ~/.zshrc) config file:

```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

> .bash_profile is specific to bash. If you're using another shell, you will need to edit the appropriate shell-specific config file.

Type source $HOME/.bash_profile for bash or source $HOME/.zprofile to load the config into your current shell. Verify that ANDROID_HOME has been set by running echo $ANDROID_HOME and the appropriate directories have been added to your path by running echo $PATH.

> Please make sure you use the correct Android SDK path. You can find the actual location of the SDK in the Android Studio "Preferences" dialog, under Appearance & Behavior → System Settings → Android SDK.

## Quick start

Assuming you have all the requirements installed, you can run the project by running:

- `yarn install` install packages

![Screenshot 2023-02-02 at 18 35 25](https://user-images.githubusercontent.com/4486806/216314536-e9181907-8fcd-4b0f-9af7-50874e5102e2.png)

- `yarn setup-env` to setup the environment files for mainnet and testnet

![Screenshot 2023-02-02 at 18 37 25](https://user-images.githubusercontent.com/4486806/216314735-4278b579-490e-41d1-b426-76a1ce0a987e.png)

- `yarn start` to start the metro bundler, in a dedicated terminal

![Screenshot 2023-02-02 at 18 38 01](https://user-images.githubusercontent.com/4486806/216314852-a47bbffc-956e-4061-8614-8283145a343b.png)

- `cd ios && pod install` to run the pod installation. If you have the problem on macOS M1, please have a look the [solution here](#-On-macOS-M1-cannot-build-the-project-due-to-arm64-issue.).
- Go to the project root and run `yarn <platform>` to run the _platform_ application (remember to start a simulator or connect a device). Platform should be `ios` or `android`.

## Setup environments

To define which env you want to use, just keep the structure `yarn env:[environment]`

testnet: `yarn env:testnet`

mainnet: `yarn env:mainnet`

local: `yarn env:local`

Modify the environment variables files in `scripts/configs/env.[environment].js` and run the above commands.

## Unit Testing

`yarn setup-env`
`yarn test`

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   91.41 |    84.29 |    92.3 |   91.38 |
 config             |     100 |      100 |     100 |     100 |
  env.mainnet.js    |     100 |      100 |     100 |     100 |
  index.js          |     100 |      100 |     100 |     100 |
 constants          |     100 |      100 |     100 |     100 |
  key.ts            |     100 |      100 |     100 |     100 |
  ledger.ts         |     100 |      100 |     100 |     100 |
  nft.ts            |     100 |      100 |     100 |     100 |
  stack.ts          |     100 |      100 |     100 |     100 |
 helpers            |   89.51 |    88.65 |   95.65 |   89.51 |
  balance.ts        |     100 |      100 |     100 |     100 |
  currency.ts       |     100 |      100 |     100 |     100 |
  format.ts         |   70.58 |    76.47 |    87.5 |   70.58 | 59,118,138-151
  identicon.ts      |     100 |      100 |     100 |     100 |
  key.ts            |     100 |        0 |     100 |     100 | 12
  validator.ts      |     100 |    96.72 |     100 |     100 | 13,197
 services           |   91.11 |    66.66 |    87.5 |   91.01 |
  casperServices.ts |   82.14 |      100 |   71.42 |   82.14 | 123-131,140
  ledgerServices.ts |   94.28 |    68.42 |     100 |   94.11 | 51-52
  stakeServices.ts  |     100 |      100 |     100 |     100 |
  tokenServices.ts  |    87.5 |        0 |     100 |    87.5 | 29
  userServices.ts   |     100 |      100 |     100 |     100 |
--------------------|---------|----------|---------|---------|-------------------

Test Suites: 11 passed, 11 total
Tests:       74 passed, 74 total
```

## API Server

By default, the app will connect to testnet or mainnet API server hosted in this repo https://github.com/CasperDash/casperdash-api.

You can run the local API Server and generate the environment file by running this command `yarn env:local`.

## Folder structure

- `src`: This folder is the main container of all the code inside the application.
  - `assets`: Asset folder to store all images, vectors, etc.
  - `components`: Folder to store any common component that you use through the app (such as a generic button).
  - `device`: Folder to store any kind of constant that you have.
  - `navigation`: Folder to store the navigators.
  - `redux_manager`: Folder to manage redux state.
  - `screens`: Folder to store the screens components.
  - `services`: This folder should have all services, and expose the combined result using its `index.js`
  - `utils`: Folder to contains utility and helper functions.

## Workflow and contributions

https://github.com/CasperDash/casperdash-client/wiki/Development-Workflow

## Trouble Shooting

### — On MacOS, cannot run android simulator due to the error "Unrecognized VM option 'MaxPermSize=512m' Error: Could not create the Java Virtual Machine. Error: A fatal exception has occurred. Program will exit."

**Root cause:** You seem to be using JDK version > 16. The option MaxPermSize=size was marked as obsolete in JDK version 16, and removed in JDK 17 (https://docs.oracle.com/en/java/javase/17/docs/specs/man/java.html#removed-java-options).

**Solution**

1. Install JDK 8: brew install --cask adoptopenjdk8
2. Switch to JDK 8: https://docs.oracle.com/javase/8/docs/technotes/guides/install/mac_jdk.html
3. Run yarn android in the project root

### — On macOS M1, cannot build the project due to arm64 issue.

**Solution:**

1. Open by Rosetta on XCode by enable option "Open using Rosetta"
2. Add arrm64 in "Excluded Architectures" under the Build Settings tab.

Or you could install the pod files (under ios folder) by using this command

```bash
arch -x86_64 pod instal
```

### — Cannot copy and paste on Simulator with iOS version > 14

**Solution:** install and using Simulator with iOS version < 14

## User Guides

Check out our user guides here: https://docs.casperdash.io/user-guides/casperdash-mobile-wallet.

## License

[MIT](https://raw.githubusercontent.com/CasperDash/casperdash-api/master/LICENSE)
