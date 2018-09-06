import { DataModel } from './DataModel';

export class Backlog implements DataModel {
    id?: number = undefined;
    name: string = "Backlog";
    createdDateTimestamp: number = undefined;
}