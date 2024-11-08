import { Guid } from 'guid-typescript';

export interface Photo {
  id?: Guid;
  url?: string;
  alt?: string;
}
