import { QueryKey, UseQueryOptions, useQuery } from 'react-query';
import { ISpeculativeDeployResponse, speculativeDeploy } from 'services/Network/networkApis';
import useSigner from './useSigner';
import { DeployUtil } from 'casperdash-js-sdk';

type Params = {
  buildFn: () => DeployUtil.Deploy | Promise<DeployUtil.Deploy>;
  key?: QueryKey;
};

export const useEstimateFee = (
  { buildFn, key }: Params,
  options?: UseQueryOptions<ISpeculativeDeployResponse, unknown, ISpeculativeDeployResponse, any>,
) => {
  const signer = useSigner();

  return useQuery(
    ['estimateFee', key],
    async () => {
      const deploy = await buildFn();
      const signedDeployJson = await signer.sign(deploy);

      const result = await speculativeDeploy(signedDeployJson);

      return result;
    },
    {
      ...options,
    },
  );
};
