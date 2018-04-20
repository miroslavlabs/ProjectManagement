import { Priority } from "../model/Priority";

export class Story {
    id?: number;
    createdDateTimestamp: number;
    title: string;
    description: string;
    startDateTimestamp: number;
    completionDateTimestamp: number;
    estimatedTime: number;
    remainingTime: number;
    actualTime: number;
    priority: Priority;
}