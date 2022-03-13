# casperdash-mobile-wallet

# Welcome to first Casper Mobile Wallet 👋

Development workflow: https://github.com/CasperDash/casperdash-client/wiki/Development-Workflow

Project: https://github.com/orgs/CasperDash/projects/2


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
