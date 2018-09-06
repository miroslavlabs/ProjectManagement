import { DataModel } from './DataModel';

export class Archive implements DataModel {
    id?: number = undefined;
    name: string = "Archive";
    createdDateTimestamp: number = undefined;
}