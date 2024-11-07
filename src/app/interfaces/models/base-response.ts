export interface BaseResponse<T> {
  isSucceed: boolean;
  result?: T;
  results?: T[];
  message: string;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  size?: number;
  number?: number;
  sort?: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements?: number;
  first?: boolean;
  empty?: boolean;
}
