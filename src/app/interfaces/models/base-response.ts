export interface BaseResponse<T> {
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  first?: boolean;
  size?: number;
  number?: number;
  numberOfElements?: number;
  isSucceed: boolean;
  result?: T;
  data?: T;
  results?: T[];
  message: string;
}
