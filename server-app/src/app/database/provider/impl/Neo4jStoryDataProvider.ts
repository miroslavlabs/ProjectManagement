import * as Models from '../../../model';

import { DefaultDeleteSubtreeOfNodesDataProvider } from './DefaultDeleteSubtreeOfNodesDataProvider';
import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jConnectedNodeDataProvider } from './Neo4jConnectedNodeDataProvider';
import { Story } from '../../../model';

/**
 * This class extends {@link Neo4jConnectedNodeDataProvider} and it overrides the way stories are deleted. When a story
 * is deleted, all of its tasks must be deleted as well.
 */
export class Neo4jStoryDataProvider<P> extends Neo4jConnectedNodeDataProvider<Models.Story, P> {
    constructor(
        driver: Neo4jDriver,
        parentNodeModelCtr: new () => P,
        parentToConnectedNodeRelationshipName: string) {

        super(driver, Story, parentNodeModelCtr, parentToConnectedNodeRelationshipName);
    }

    deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number): void {

        // Delete a story and all of its tasks.
        new DefaultDeleteSubtreeOfNodesDataProvider(
            this.driver,
            Models.Story,
            this.parentNodeModelCtr,
            this.parentToConnectedNodeRelationshipName).deleteEntity(
                successCallback,
                errorCallback,
                projectIdParam);
    }
}