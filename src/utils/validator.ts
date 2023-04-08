import { CLPublicKey } from 'casperdash-js-sdk';

const MAX_METADATA_ATTRIBUTES = 5;

/**
 * Check value is public key.
 * @return {Boolean} - Is valid public key
 * @param publicKey
 */
export const isValidPublicKey = (publicKey: string) => {
  try {
    const pbKey = CLPublicKey.fromHex(publicKey);
    return !!pbKey;
  } catch (error) {
    return false;
  }
};

/**
 * validate NFT Mint Form
 * @param {object} values
 */
export const validateNFTMintForm = (values: any) => {
  let errors: any = {};
  if (!values.nftContract) {
    errors.nftContract = 'Required';
  }
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.image) {
    errors.image = 'Required';
  }
  if (values.image && values.image.type && !values.image.type.includes('image')) {
    errors.image = 'Should be image.';
  }
  if (values.toAddress && !isValidPublicKey(values.toAddress)) {
    errors.toAddress = 'Invalid address.';
  }

  new Array(MAX_METADATA_ATTRIBUTES).fill(undefined).forEach((value, index) => {
    const attrName = `attribute${index}`;
    const attrValue = `value${index}`;
    if (values[attrName] && values[attrName].length > 20) {
      errors[attrName] = 'Max is 20 chars.';
    }
    if (values[attrValue] && values[attrValue].length > 20) {
      errors[attrValue] = 'Max is 20 chars.';
    }
  });

  return errors;
};

const COMMON_ERROR_MESSAGE = {
  MORE_THAN_ZERO: (tokenSymbol: string) => `Amount must be more than 0 ${tokenSymbol}.`,
  NOT_ENOUGH_BALANCE: 'Not enough balance.',
  NOT_ENOUGH_FEE: (fee: number) =>
    `Sorry, you do not have sufficient funds in your active balance to perform the undelegation process. Please make sure you have at least ${fee} CSPR in your active balance before attempting to undelegate.`,
  NOT_ENOUGH_STAKED_AMOUNT: 'Not enough staked amount.',
};

/**
 * "If the send amount is less than the minimum amount, or less than or equal to zero, or greater than
 * the display balance, or greater than the display balance plus the transfer fee, return an error
 * message, otherwise return an empty string."
 *
 * The function is a bit long, but it's not too bad. It's a bit hard to read because it's all on one
 * line, but it's not too bad
 * @param  - sendAmount: number;
 * @returns A string.
 */
const getSendAmountError = ({
  sendAmount,
  minAmount,
  tokenSymbol,
  displayBalance,
  transferFee,
}: {
  sendAmount: number;
  minAmount: number;
  tokenSymbol: string;
  displayBalance: number;
  transferFee: number;
}) => {
  if (minAmount && sendAmount < minAmount) {
    return `Amount must be at least ${minAmount} ${tokenSymbol}.`;
  }
  if (sendAmount <= 0) {
    return `Amount must be more than 0 ${tokenSymbol}.`;
  }
  if (sendAmount > displayBalance) {
    return 'Not enough balance.';
  }
  if (tokenSymbol === 'CSPR' && sendAmount + transferFee > displayBalance) {
    return 'Not enough balance.';
  }
  return '';
};

/**
 * Validate transfer form.
 * @param {Object}  - Transfer object.
 * @return {Object} - Error object
 */
export const validateTransferForm = ({
  displayBalance,
  toAddress,
  sendAmount,
  tokenSymbol,
  minAmount,
  csprBalance,
  transferFee,
}: {
  displayBalance: number;
  toAddress: string;
  sendAmount: number;
  tokenSymbol: string;
  minAmount: number;
  csprBalance: number;
  transferFee: number;
}) => {
  let errors: any = {};
  // to address
  if (!toAddress) {
    errors.toAddress = 'Required.';
  }
  if (toAddress && !isValidPublicKey(toAddress)) {
    errors.toAddress = 'Invalid address.';
  }
  // send amount
  const sendAmountError = getSendAmountError({
    sendAmount,
    minAmount,
    tokenSymbol,
    displayBalance,
    transferFee,
  });
  if (sendAmountError) {
    errors.sendAmount = sendAmountError;
  }
  //cspr balance
  if (csprBalance < transferFee) {
    errors.transferFee = COMMON_ERROR_MESSAGE.NOT_ENOUGH_FEE(transferFee);
  }
  return errors;
};

/**
 * Validate stake form
 * @param {object} stake
 */
export const validateStakeForm = ({
  amount,
  tokenSymbol,
  balance,
  fee,
  minAmount,
}: {
  amount: number;
  tokenSymbol: string;
  balance: number;
  fee: number;
  minAmount: number;
}) => {
  let errors: any = {};
  if (amount <= 0) {
    errors.amount = COMMON_ERROR_MESSAGE.MORE_THAN_ZERO(tokenSymbol);
  } else if (amount + fee > balance) {
    errors.amount = COMMON_ERROR_MESSAGE.NOT_ENOUGH_BALANCE;
  }

  if (balance <= minAmount) {
    errors.amount = `Insufficient balance. System requires ${minAmount} ${tokenSymbol} minimum balance.`;
  }

  return errors;
};
