import { DataModel } from './DataModel';

export class Story implements DataModel {
    id?: number = undefined;
    createdDateTimestamp: number = undefined;
    title: string = undefined;
    description: string = undefined;
    estimatedTime: number = undefined;
    remainingTime: number = undefined;
    actualTime: number = undefined;
    priority: string = undefined;
}