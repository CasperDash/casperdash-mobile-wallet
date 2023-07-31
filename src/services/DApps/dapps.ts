import { request } from 'services/request';

export interface IDApp {
  name: string;
  logo: string;
  description: string;
  url: string;
}

export const getDApps = async (): Promise<IDApp[]> => {
  const { data } = await request.get<IDApp[]>('/dapps');

  return data;
};
