export interface IPagination {
  itemCount: number;
  pageCount: number;
  pages: { number: number; url: string }[];
  page: number;
}
export interface ICommonListResponse<T> extends IPagination {
  data: T[];
}
