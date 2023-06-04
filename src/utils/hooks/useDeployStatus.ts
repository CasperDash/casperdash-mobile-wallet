import { useQuery } from 'react-query';
import { getDeployStatus } from 'services/Deploy/deployApis';
import { ERequestKeys } from 'utils/constants/requestKeys';

export const useDeployStatus = (deployHashes: string[]) => {
  const query = useQuery({
    queryKey: [ERequestKeys.deploysStatus, deployHashes],
    queryFn: () => getDeployStatus(deployHashes),
    enabled: !!deployHashes.length,
    cacheTime: 10 * 1000,
  });

  return { ...query };
};
