import { isIos } from 'device';
import { UseQueryOptions, useQuery } from 'react-query';
import { IReleaseNotes, getReleaseNotes } from 'services/ReleaseNotes/releaseNotes';
import { ERequestKeys } from 'utils/constants/requestKeys';
import DeviceInfo from 'react-native-device-info';
import { toastError } from 'utils/helpers/errorHandler';

export const useReleaseNotes = (
  options: Omit<UseQueryOptions<unknown, any, IReleaseNotes[], any>, 'queryKey' | 'queryFn'>,
) => {
  const platform = isIos() ? 'ios' : 'android';
  const version = DeviceInfo.getVersion();
  const query = useQuery({
    queryKey: [ERequestKeys.releaseNotes],
    queryFn: () => getReleaseNotes(platform, version),
    onError: (error: any) => {
      toastError(error?.response?.data?.message);
    },
    ...options,
  });

  return { ...query };
};
