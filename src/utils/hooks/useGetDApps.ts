import { UseQueryResult, useQuery } from 'react-query';
import { IDApp, getDApps } from 'services/DApps/dapps';
import { ERequestKeys } from 'utils/constants/requestKeys';

export const useGetDApps = (): UseQueryResult<IDApp[], unknown> => {
  const query = useQuery({
    queryKey: [ERequestKeys.dapps],
    queryFn: () => getDApps(),
  });

  return query;
};
