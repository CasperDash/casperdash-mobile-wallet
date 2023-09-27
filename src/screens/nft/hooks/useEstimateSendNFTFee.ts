import { UseQueryOptions } from 'react-query';
import { transferNFT } from 'screens/nft/utils/nft';
import { getContractPackageInfo } from 'services/ContractPackages/contractPackagesApis';
import { TokenStandards } from 'screens/nft/utils/token';
import { useSelector } from 'react-redux';
import { getSelectedWallet } from 'utils/selectors/user';
import { useEstimateFee } from 'utils/hooks/useEstimateFee';
import { useSelectedAccountInfo } from 'utils/hooks/useAccountInfo';
import { toMotes } from 'utils/helpers/currency';

type Params = {
  contractAddress: string;
  tokenId: string | number;
  toPublicKeyHex: string;
  tokenStandardId: TokenStandards;
  image?: string;
  name?: string;
  isUsingSessionCode?: boolean;
  wasmName?: string;
};

export const useEstimateSendNFTFee = (
  { contractAddress, tokenId, toPublicKeyHex, tokenStandardId, isUsingSessionCode, wasmName }: Params,
  options?: UseQueryOptions<any, unknown, any, any>,
) => {
  const selectedWallet = useSelector(getSelectedWallet);
  const accountInfo = useSelectedAccountInfo();
  const balance = accountInfo?.balance?.displayBalance ?? 0;

  return useEstimateFee(
    {
      buildFn: async () => {
        const { contract_hash: contractHash } = await getContractPackageInfo(contractAddress);

        const deploy = await transferNFT({
          tokenStandardId,
          contractHash,
          fromPublicKeyHex: selectedWallet.publicKey,
          toPublicKeyHex,
          tokenId,
          isUsingSessionCode,
          wasmName,
          paymentAmount: toMotes(Math.min(balance, 100)),
        });

        return deploy;
      },
      key: [contractAddress, tokenStandardId, selectedWallet.publicKey],
    },
    {
      ...options,
      enabled: !!selectedWallet && !!toPublicKeyHex,
    },
  );
};
