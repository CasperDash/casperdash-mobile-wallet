import { getConfigurations } from 'services/Configurations/configurationApis';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { useQuery } from 'react-query';

export const useConfigurations = () => {
  return useQuery({
    queryKey: [ERequestKeys.configurations],
    queryFn: () => getConfigurations(),
  });
};
