import { DeployUtil, RuntimeArgs, CLPublicKey, CLValueBuilder } from 'casperdash-js-sdk';
import { NETWORK_NAME, ENTRY_POINT_DELEGATE, ENTRY_POINT_REDELEGATE } from '../constants/key';
import { contractHashes } from '../constants/stack';
import { toMotes } from '../helpers/currency';
import { BigNumber } from '@ethersproject/bignumber';

/**
 * It creates a deploy that deploys the auction contract.
 * @param baseAccount - The account that will pay for the deploy.
 * @param entryPoint - The name of the function to be called.
 * @param args - The arguments to pass to the entry point.
 * @param paymentAmount - The amount of tokens to send to the contract.
 * @returns The deploy object.
 */
const buildStakeDeploy = (baseAccount: any, entryPoint: string, args: any, paymentAmount: BigNumber) => {
  const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
  const runTimeArgs = RuntimeArgs.fromMap(args);
  const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
    contractHashes.auction,
    entryPoint,
    runTimeArgs,
  );
  const payment = DeployUtil.standardPayment(paymentAmount);
  return DeployUtil.makeDeploy(deployParams, session, payment);
};

/**
 * It builds a StakeDeploy transaction with the given parameters
 * @returns The `StakeDeploy` transaction.
 */
export const getStakeDeploy = ({
  fromAddress,
  validator,
  fee,
  amount,
  newValidator,
  entryPoint = ENTRY_POINT_DELEGATE,
}: {
  fromAddress: string;
  validator: string;
  fee: number;
  amount: number;
  entryPoint: string;
  newValidator?: string;
}) => {
  try {
    const fromAccPk = CLPublicKey.fromHex(fromAddress);
    const validatorPk = CLPublicKey.fromHex(validator);
    let args: any = {
      delegator: fromAccPk,
      validator: validatorPk,
      amount: CLValueBuilder.u512(toMotes(amount)),
    };
    if (entryPoint === ENTRY_POINT_REDELEGATE) {
      args = {
        ...args,
        new_validator: CLPublicKey.fromHex(newValidator!),
      };
    }

    return buildStakeDeploy(fromAccPk, entryPoint, args, toMotes(fee));
  } catch (error) {
    console.log('err: ', error);

    throw new Error('Failed to get stake deploy.');
  }
};
