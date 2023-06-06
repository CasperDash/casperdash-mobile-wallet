import { useQuery } from 'react-query';
import { getConfigurations } from 'services/Configurations/configurationApis';
import { ERequestKeys } from 'utils/constants/requestKeys';

export const useConfigurations = () => {
  return useQuery({
    queryKey: [ERequestKeys.configurations],
    queryFn: () => getConfigurations(),
  });
};
