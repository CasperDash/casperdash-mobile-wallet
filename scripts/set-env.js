#!/bin/node
const fs = require('fs');
const path = require('path');

// Get the environment string passed to the node script
const environment = process.argv[2];
const envFile = path.join(__dirname, `./configs/env.${environment}.js`);
if (!fs.existsSync(envFile)) {
  console.warn(`Cannot find the env file for ${environment}`);
  exit;
}

const isProdEnv = environment === 'mainnet';

const appDevEnvFile = isProdEnv
  ? path.join(__dirname, '../src/utils/config/env.mainnet.js')
  : path.join(__dirname, '../src/utils/config/env.testnet.js');

try {
  fs.copyFileSync(envFile, appDevEnvFile);
} catch (e) {
  console.warn(`Cannot create the evn.${environment}.js.`, e);
}
