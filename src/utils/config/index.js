module.exports = __DEV__ ? require('./env.testnet') : require('./env.mainnet');
