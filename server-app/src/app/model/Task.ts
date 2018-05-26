import { DataModel } from './DataModel';

export class Task implements DataModel {
    id?: number = undefined;
    description: string = undefined;
    completed: boolean = undefined;
}