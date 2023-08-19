import { useQuery } from 'react-query';
import { getNews } from 'services/News/NewsApis';
import { ERequestKeys } from 'utils/constants/requestKeys';

export const useNews = () => {
  const query = useQuery({
    queryKey: [ERequestKeys.news],
    queryFn: () => getNews(),
  });
  return query;
};
