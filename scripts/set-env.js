#!/bin/node
const fs = require('fs');
const path = require('path');
const { isConstructorDeclaration } = require('typescript');

// Get the environment string passed to the node script
const environment = process.argv[2] === 'beta' ? 'testnet' : process.argv[2];

const envFile = path.join(__dirname, `./configs/env.${environment}.js`);

if (!fs.existsSync(envFile)) {
  console.warn(`Cannot find the env file for ${environment}`);
  exit;
}

const isLocalEnv = process.argv[2] === 'local';

let appDevEnvFile;
if (isLocalEnv) {
  appDevEnvFile = path.join(__dirname, '../src/utils/config/env.testnet.js');
} else {
  const isProdEnv = process.argv[2] === 'mainnet' || process.argv[2] === 'beta';
  appDevEnvFile = isProdEnv
    ? path.join(__dirname, '../src/utils/config/env.mainnet.js')
    : path.join(__dirname, '../src/utils/config/env.testnet.js');
}

console.log('appDevEnvFile', appDevEnvFile);
console.log('envFile', envFile);

try {
  fs.copyFileSync(envFile, appDevEnvFile);
} catch (e) {
  console.warn(`Cannot create the evn.${environment}.js.`, e);
}
