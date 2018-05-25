import { CRUDDataProvider } from './CRUDDataProvider';
import { Neo4jDriver } from '../core/Neo4jDriver';

import * as Neo4jDataProviders from './impl';
import * as Models from '../../model';

const HAS_STATE_RELATIONSHIP_NAME = "HAS_STATE";
const HAS_STORY_RELATIONSHIP_NAME = "HAS_STORY";

export class CRUDDataProviderFactory {

    constructor(private neo4jDriver: Neo4jDriver) {
    }

    public getProjectsDataProvider(): CRUDDataProvider<Models.Project> {
        return new Neo4jDataProviders.Neo4jProjectsDataProvider(this.neo4jDriver);
    }

    public getBacklogAndArchiveDataProvider(): CRUDDataProvider<Models.Archive|Models.Backlog> {
        return new Neo4jDataProviders.Neo4jBacklogAndArchiveDataProvider(this.neo4jDriver);
    }

    public getBoardsDataProvider(): CRUDDataProvider<Models.Board> {
        return new Neo4jDataProviders.Neo4jBoardsDataProvider(this.neo4jDriver);
    }

    public getStateDataProvider(): CRUDDataProvider<Models.State> {
        return new Neo4jDataProviders.Neo4jConnectedNodeDataProvider(
            this.neo4jDriver,
            Models.State,
            Models.Board,
            HAS_STATE_RELATIONSHIP_NAME);
    }

    public getStoryInStateDataProvider(): CRUDDataProvider<Models.Story> {
        return new Neo4jDataProviders.Neo4jStoryDataProvider(
            this.neo4jDriver,
            Models.State,
            HAS_STORY_RELATIONSHIP_NAME);
    }

    public getStoryInArchiveDataProvider(): CRUDDataProvider<Models.Story> {
        return new Neo4jDataProviders.Neo4jStoryDataProvider(
            this.neo4jDriver,
            Models.Archive,
            HAS_STORY_RELATIONSHIP_NAME);
    }

    public getStoryInBacklogDataProvider(): CRUDDataProvider<Models.Story> {
        return new Neo4jDataProviders.Neo4jStoryDataProvider(
            this.neo4jDriver,
            Models.Backlog,
            HAS_STORY_RELATIONSHIP_NAME);
    }

    public getTaskDataProvider(): CRUDDataProvider<Models.Task> {
        return new Neo4jDataProviders.Neo4jConnectedNodeDataProvider(
            this.neo4jDriver,
            Models.Task,
            Models.Story,
            HAS_STORY_RELATIONSHIP_NAME);
    }
}