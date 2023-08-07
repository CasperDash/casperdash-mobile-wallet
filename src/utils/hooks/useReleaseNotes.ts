import DeviceInfo from 'react-native-device-info';
import { UseQueryOptions, useQuery } from 'react-query';

import { isIos } from 'device';
import { IReleaseNotes, getReleaseNotes } from 'services/ReleaseNotes/releaseNotes';
import { ERequestKeys } from 'utils/constants/requestKeys';

export const useReleaseNotes = (
  options: Omit<UseQueryOptions<unknown, any, IReleaseNotes[], any>, 'queryKey' | 'queryFn'>,
) => {
  const platform = isIos() ? 'ios' : 'android';
  const version = DeviceInfo.getVersion();
  const query = useQuery({
    queryKey: [ERequestKeys.releaseNotes],
    queryFn: () => getReleaseNotes(platform, version),
    ...options,
  });

  return { ...query };
};
