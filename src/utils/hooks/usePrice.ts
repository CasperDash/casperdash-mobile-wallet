import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getLatestPrice, getPriceHistory } from 'services/Price/price';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { toastError } from 'utils/helpers/errorHandler';

export const usePrice = () => {
  const query = useQuery({
    queryKey: [ERequestKeys.latestPrice],
    queryFn: () => getLatestPrice(),
    onError: (error: any) => {
      toastError(error?.response?.data?.message);
    },
  });
  return { ...query, currentPrice: query.data?.price || 0 };
};

export const usePriceHistory = () => {
  const query = useQuery({
    queryKey: [ERequestKeys.priceHistory],
    queryFn: () => getPriceHistory(),
    onError: (error: any) => {
      toastError(error?.response?.data?.message);
    },
  });

  const massagedData = useMemo(() => {
    if (query.data) {
      return query.data?.map((price: any) => ({
        x: price[0],
        y: parseFloat(parseFloat(price[1]).toFixed(4)),
      }));
    }
    return [];
  }, [query.data]);
  return { ...query, massagedData };
};
