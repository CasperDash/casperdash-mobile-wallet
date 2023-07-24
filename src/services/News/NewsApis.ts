import { request } from 'services/request';

export interface INewsResponse {
  label: string;
  title: string;
  url?: string;
  bannerUrl?: string;
  isActive: boolean;
}

export const getNews = async (): Promise<INewsResponse[]> => {
  const response = await request.get<{ news: INewsResponse[] }>('/news');

  return response.data?.news;
};
