import { useQuery } from 'react-query';
import { getConfigurations } from 'services/Configurations/configurationApis';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { toastError } from 'utils/helpers/errorHandler';

export const useConfigurations = () => {
  return useQuery({
    queryKey: [ERequestKeys.configurations],
    queryFn: () => getConfigurations(),
    onError: (error: any) => {
      toastError(error?.response?.data?.message);
    },
  });
};
