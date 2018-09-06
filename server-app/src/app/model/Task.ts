import { DataModel } from './DataModel';

export class Task implements DataModel {
    id?: number = undefined;
    createdDateTimestamp: number = undefined;
    description: string = undefined;
    completed: boolean = undefined;
}