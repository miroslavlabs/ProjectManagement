import { Priority } from "../model/Priority";

export class Story {
    id?: number;
    title: string;
    description: string;
    creationDate: Date;
    startDate: Date;
    completionDate: Date;
    estimatedTime: number;
    remainingTime: number;
    actualTime: number;
    priority: Priority;
}