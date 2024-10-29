export interface BaseResponse<T> {
  totalRecords: number;
  totalPages: number;
  isSucceed: boolean;
  result?: T;
  data?: T;
  results?: T[];
  message: string;
}
