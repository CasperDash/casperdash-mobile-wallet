import { DeployUtil, CLPublicKey, formatMessageWithHeaders, encodeBase16 } from 'casperdash-js-sdk';
import CasperApp from '@zondax/ledger-casper';
import { SECP256k1, CONNECT_ERROR_MESSAGE } from '../constants/ledger';
import { CASPER_KEY_PATH } from '../constants/key';
import { Config, Keys } from 'utils';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { DeployTypes, getDeployType } from 'utils/helpers/parser';
import { CustomError } from 'utils/constants/requestKeys';
import { rejectAfterTimeout } from 'utils/helpers/async';

let cacheKey: Record<number | string, string> = {};

type LedgerOption = {
  keyIndex?: string | number;
  publicKey?: string;
  deviceId?: string;
};

/**
 * Initial ledger app
 */
export const initLedgerApp = async (deviceId?: string) => {
  try {
    const device = await Config.getItem(Keys.ledger);

    const transport = await rejectAfterTimeout(
      TransportBLE.open(deviceId || device?.id),
      4000,
      Error(CONNECT_ERROR_MESSAGE),
    );

    return { casperApp: new CasperApp(transport), transport };
  } catch (error: any) {
    error.name = CustomError.LedgerError;
    throw error;
  }
};

/**
 * Sign deploy by ledger
 * @param {object} deploy
 * @param {object} options
 */
export const signDeployByLedger = async (deploy: DeployUtil.Deploy, options: LedgerOption = {}) => {
  const { casperApp, transport } = await initLedgerApp(options.deviceId);

  let responseDeploy;
  const deployType = getDeployType(deploy);
  if (deployType === DeployTypes.Wasm) {
    responseDeploy = await casperApp.signWasmDeploy(
      `${CASPER_KEY_PATH}${options.keyIndex}`,
      //@ts-ignore
      DeployUtil.deployToBytes(deploy),
    );
  } else {
    responseDeploy = await casperApp.sign(
      `${CASPER_KEY_PATH}${options.keyIndex}`,
      //@ts-ignore
      DeployUtil.deployToBytes(deploy),
    );
  }

  if (!responseDeploy.signatureRS) {
    transport.close();
    throw Error(getLedgerError({ message: responseDeploy.errorMessage }, responseDeploy.returnCode));
  }

  let signedDeploy: any = DeployUtil.setSignature(
    deploy,
    responseDeploy.signatureRS,
    CLPublicKey.fromHex(options.publicKey!),
  );
  signedDeploy = DeployUtil.validateDeploy(signedDeploy);
  if (signedDeploy.ok) {
    transport.close();
    return DeployUtil.deployToJson(signedDeploy.val);
  } else {
    transport.close();
    throw new Error('Error on sign deploy with ledger.');
  }
};

export const signMessage = async (
  message: string,
  { keyIndex = '0' }: LedgerOption = { keyIndex: '0' },
): Promise<string> => {
  const { casperApp, transport } = await initLedgerApp();

  const signatureResponse = await casperApp.signMessage(
    `${CASPER_KEY_PATH}${keyIndex}`,
    formatMessageWithHeaders(message) as Buffer,
  );

  if (!signatureResponse) {
    await transport.close();

    throw new Error('Error on sign message with ledger.');
  }

  await transport.close();

  const signature = Uint8Array.from(signatureResponse.signatureRSV);

  return encodeBase16(signature.slice(0, 64));
};

/**
 * Get public key from ledger
 * @param {object} app casper app
 * @param {number} keyIndex ledger key index
 */
export const getLedgerPublicKey = async (app: any, keyIndex: string | number = 0) => {
  if (cacheKey[keyIndex]) {
    return cacheKey[keyIndex];
  }

  const { publicKey = '' } = await app.getAddressAndPubKey(`${CASPER_KEY_PATH}${keyIndex}`);

  if (!publicKey) {
    throw Error(CONNECT_ERROR_MESSAGE);
  }

  cacheKey[keyIndex] = `${SECP256k1}${publicKey.toString('hex')}`;

  return cacheKey[keyIndex];
};

/**
 * Get list public key from ledger
 * @param {object} app casper app object
 * @param {number} startPath start index
 * @param {number} numberOfKey number of keys that want to get
 */
export const getListKeys = async (app: any, startPath = 0, numberOfKey = 1) => {
  try {
    let publicKeys = [];
    for (let index = 0; index < numberOfKey; index++) {
      const keyIndex = startPath + index;
      publicKeys.push({
        publicKey: await getLedgerPublicKey(app, keyIndex),
        keyIndex,
      });
    }
    return publicKeys;
  } catch (error: any) {
    error.name = CustomError.LedgerError;
    throw error;
  }
};

/**
 * Get Ledger error message
 * @param {object} error
 * @param {number} code
 */
export const getLedgerError = (error: any, code: number) => {
  if (error.name === 'TransportInterfaceNotAvailable' || code === 27014) {
    return CONNECT_ERROR_MESSAGE;
  }
  if (code === 27012) {
    return 'Unsupported Deploy';
  }
  return error.message;
};

export const resetCache = () => {
  cacheKey = {};
};
