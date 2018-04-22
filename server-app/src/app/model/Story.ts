import { Priority } from "../model/Priority";

export class Story {
    id?: number = undefined;
    createdDateTimestamp: number = undefined;
    title: string = undefined;
    description: string = undefined;
    startDateTimestamp: number = undefined;
    completionDateTimestamp: number = undefined;
    estimatedTime: number = undefined;
    remainingTime: number = undefined;
    actualTime: number = undefined;
    priority: Priority = undefined;
}