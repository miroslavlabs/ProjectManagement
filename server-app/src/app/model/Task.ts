import { DataModel } from './DataModel';

export class Task extends DataModel {
    description: string = undefined;
    completed: boolean = undefined;
}