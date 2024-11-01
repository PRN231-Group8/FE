import { Guid } from 'guid-typescript';
import { Location } from './location';

export interface LocationInTour {
    id?: Guid;
    locations?: Location[];
    tourId?: Guid;
}

export { Location };
