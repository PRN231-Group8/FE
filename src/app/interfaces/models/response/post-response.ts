import { Post } from '../post';

export interface PostResponse {
  isSucceed: boolean;
  result?: Post;
  results?: Post[];
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
