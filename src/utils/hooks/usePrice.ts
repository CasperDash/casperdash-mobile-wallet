import { useQuery } from 'react-query';
import { getLatestPrice, getPriceHistory } from 'services/Price/price';
import { ERequestKeys } from 'utils/constants/requestKeys';

export const usePrice = () => {
  const { data, isLoading } = useQuery({
    queryKey: [ERequestKeys.latestPrice],
    queryFn: () => getLatestPrice(),
  });
  return { data, isLoading, currentPrice: data?.price || 0 };
};

export const usePriceHistory = () => {
  const { data, isLoading } = useQuery({
    queryKey: [ERequestKeys.priceHistory],
    queryFn: () => getPriceHistory(),
  });
  return { data, isLoading };
};
