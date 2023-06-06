import { request } from 'services/request';

export interface IReleaseNotes {
  version: string;
  platform: string;
  releaseNotes: string[];
  isForceUpdate: boolean;
}

export const getReleaseNotes = async (platform: 'ios' | 'android', version: string): Promise<IReleaseNotes[]> => {
  const response = await request.get<IReleaseNotes[]>(`/releaseNotes?platform=${platform}&version=${version}`);

  return response.data;
};
