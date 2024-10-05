export interface BaseResponse<T> {
  isSucceed: boolean;
  result?: T;
  data?: T;
  results?: T[];
  message: string;
}
