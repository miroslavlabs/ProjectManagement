import { DataModel } from './DataModel';

export class Board implements DataModel {
    id?: number = undefined;
    name: string = undefined;
    createdDateTimestamp: number = undefined;
}