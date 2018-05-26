import { DataModel } from './DataModel';

export class Project implements DataModel {
    id?: number = undefined;
    createdDateTimestamp: number = undefined;
    title: string = undefined;
    fullDescription: string = undefined;
}