import { DataModel } from './DataModel';

export class Project extends DataModel {
    createdDateTimestamp: number = undefined;
    title: string = undefined;
    fullDescription: string = undefined;
}