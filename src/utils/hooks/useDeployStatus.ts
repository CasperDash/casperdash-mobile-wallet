import { useQuery } from 'react-query';
import { getDeployStatus } from 'services/Deploy/deployApis';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { toastError } from 'utils/helpers/errorHandler';

export const useDeployStatus = (deployHashes: string[]) => {
  const query = useQuery({
    queryKey: [ERequestKeys.deploysStatus, deployHashes],
    queryFn: () => getDeployStatus(deployHashes),
    enabled: !!deployHashes.length,
    cacheTime: 10 * 1000,
    onError: (error: any) => {
      toastError(error?.response?.data?.message);
    },
  });

  return { ...query };
};
