import { Guid } from 'guid-typescript';

export interface Mood {
    id?: Guid;
    moodTag: string;
    iconName: string;
}