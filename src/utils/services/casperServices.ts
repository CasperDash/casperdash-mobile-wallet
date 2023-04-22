import {
  DeployUtil,
  Signer,
  RuntimeArgs,
  CLValueBuilder,
  CLAccountHash,
  CLKey,
  CLTypeBuilder,
  CLPublicKey,
} from 'casperdash-js-sdk';
import { NETWORK_NAME, PAYMENT_AMOUNT, MOTE_RATE, DEPLOY_TTL_MS } from '../constants/key';
import { BigNumberish } from '@ethersproject/bignumber';

/**
 * Get Transfer deploy
 * @param {CLPublicKey} fromAccount main account public key
 * @param {CLPublicKey} toAccount public key of target account
 * @param {Number} amount transfer amount
 * @param {Number} transferId transfer id. This parameter is optional
 * @param {Number} fee transfer fee
 * @returns {Deploy} transfer deploy
 */
export const buildTransferDeploy = (
  fromAccount: CLPublicKey,
  toAccount: CLPublicKey,
  amount: BigNumberish,
  transferId: BigNumberish,
  fee: any,
) => {
  const deployParams = new DeployUtil.DeployParams(fromAccount, NETWORK_NAME);
  const transferParams = DeployUtil.ExecutableDeployItem.newTransfer(amount, toAccount, null, transferId);
  const payment = DeployUtil.standardPayment(fee * MOTE_RATE);
  return DeployUtil.makeDeploy(deployParams, transferParams, payment);
};

/**
 * Build deploy for contract
 * @param {CLPublicKey} baseAccount main account public key
 * @param {Object} session hash contract content
 * @returns {Deploy} deploy of the contract
 */
export const buildContractInstallDeploy = (baseAccount: CLPublicKey, session: any) => {
  const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
  const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
  return DeployUtil.makeDeploy(deployParams, session, payment);
};

/**
 * Get Recipient address
 * @param {CLPublicKey} recipient
 */
export const createRecipientAddress = (recipient: CLPublicKey) => {
  return new CLKey(new CLAccountHash(recipient.toAccountHash()));
};

/**
 * Get Transfer Token deploy
 * @param {CLPublicKey} fromAccount from account public key
 * @param {CLPublicKey} toAccount to account public key
 * @param {Number} amount transfer amount
 * @param {String} contractHash token contract hash
 * @returns {Deploy} transfer deploy
 */
export const buildTransferTokenDeploy = (
  fromAccount: CLPublicKey,
  toAccount: CLPublicKey,
  amount: any,
  contractHash: string,
  fee: any,
) => {
  // eslint-disable-next-line no-undef
  const contractHashAsByteArray: any = [...Buffer.from(contractHash, 'hex')];
  const deployParams = new DeployUtil.DeployParams(fromAccount, NETWORK_NAME, 1, DEPLOY_TTL_MS);

  const transferParams = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
    contractHashAsByteArray,
    'transfer',
    RuntimeArgs.fromMap({
      amount: CLValueBuilder.u256(amount),
      recipient: createRecipientAddress(toAccount),
    }),
  );
  const payment = DeployUtil.standardPayment(fee * MOTE_RATE);
  return DeployUtil.makeDeploy(deployParams, transferParams, payment);
};

/**
 * Request to connect with signer
 * @returns {string} error message
 */
export const connectCasperSigner = () => {
  try {
    Signer.sendConnectionRequest();
  } catch (error: any) {
    return error.message;
  }
};

/**
 * It takes a JavaScript map and returns a CLValue of type `Map<String, String>`
 * @param map - The map to convert to a CLValue.
 * @returns A CLValue of type `Map<String, String>`
 */
export const toCLMap = (map: any) => {
  const clMap = CLValueBuilder.map([CLTypeBuilder.string(), CLTypeBuilder.string()]);
  //@ts-ignore
  for (const [key, value] of Array.from(map.entries())) {
    clMap.set(CLValueBuilder.string(key), CLValueBuilder.string(value));
  }
  return clMap;
};

/**
 * Convert a contract hash to a byte array
 * @param contractHash - The contract hash of the contract you want to get the bytecode of.
 */
export const contractHashToByteArray = (contractHash: string) =>
  // eslint-disable-next-line no-undef
  Uint8Array.from(Buffer.from(contractHash, 'hex'));
