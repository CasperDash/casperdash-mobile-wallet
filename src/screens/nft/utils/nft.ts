import { CLKeyParameters, CLPublicKey, CLValueBuilder, RuntimeArgs } from 'casperdash-js-sdk';
import { NETWORK_NAME } from 'utils/constants/key';
import { callEntrypoint, callSessionWasm } from 'utils/services/casperServices';

export interface TokenArgs {
  tokenId?: string;
  tokenHash?: string;
}

export type TransferArgs = {
  target: CLKeyParameters;
  source: CLKeyParameters;
  contractHash: string;
} & TokenArgs;

export interface CallConfig {
  useSessionCode: boolean;
}

enum ERRORS {
  CONFLICT_CONFIG = 'Conflicting arguments provided',
}

const convertHashStrToHashBuff = (hashStr: string) => {
  let hashHex = hashStr;
  if (hashStr.startsWith('hash-')) {
    hashHex = hashStr.slice(5);
  }
  return Buffer.from(hashHex, 'hex');
};

export const transferCEP78 = (
  args: TransferArgs,
  config: CallConfig,
  paymentAmount: string,
  deploySender: CLPublicKey,
  wasm?: Uint8Array,
) => {
  const { contractHash } = args;
  const contractHashKey = CLValueBuilder.key(CLValueBuilder.byteArray(convertHashStrToHashBuff(contractHash)));

  if (config.useSessionCode === false && !!wasm) throw new Error(ERRORS.CONFLICT_CONFIG);

  const runtimeArgs = RuntimeArgs.fromMap({
    target_key: CLValueBuilder.key(args.target),
    source_key: CLValueBuilder.key(args.source),
  });

  if (args.tokenId) {
    runtimeArgs.insert('is_hash_identifier_mode', CLValueBuilder.bool(false));
    runtimeArgs.insert('token_id', CLValueBuilder.u64(args.tokenId));
  }

  if (args.tokenHash) {
    runtimeArgs.insert('is_hash_identifier_mode', CLValueBuilder.bool(true));
    runtimeArgs.insert('token_id', CLValueBuilder.u64(args.tokenHash));
  }

  if (config.useSessionCode) {
    if (!wasm) {
      throw new Error('Missing wasm argument');
    }
    if (!contractHashKey) {
      throw new Error('Missing contractHashKey argument');
    }
    runtimeArgs.insert('nft_contract_hash', contractHashKey);
    const wasmToCall = wasm;

    const preparedDeploy = callSessionWasm(wasmToCall, runtimeArgs, paymentAmount, deploySender, NETWORK_NAME);

    return preparedDeploy;
  }

  const preparedDeploy = callEntrypoint(
    'transfer',
    runtimeArgs,
    deploySender,
    NETWORK_NAME,
    paymentAmount,
    contractHash,
  );

  return preparedDeploy;
};

export const transferCEP47 = (
  recipient: CLKeyParameters,
  owner: CLKeyParameters,
  ids: string[],
  contractHash: string,
  paymentAmount: string,
  deploySender: CLPublicKey,
) => {
  const runtimeArgs = RuntimeArgs.fromMap({
    recipient: CLValueBuilder.key(recipient),
    sender: CLValueBuilder.key(owner),
    token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
  });

  return callEntrypoint('transfer_from', runtimeArgs, deploySender, NETWORK_NAME, paymentAmount, contractHash);
};
