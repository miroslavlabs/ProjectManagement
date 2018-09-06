import * as Models from '../../../model';

import { Session, Transaction, Record, Node } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReaderAndWriter } from '../../data/Neo4jDataReaderAndWriter';
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import { CRUDDataProvider } from '../CRUDDataProvider';
import { DefaultDeleteSubtreeOfNodesDataProvider } from './DefaultDeleteSubtreeOfNodesDataProvider';

const PROJECT_CYPHER_VARIABLE: string = "project";

/**
 * This class retrives/modifies information on projects from a Neo4j database.
 */
export class Neo4jProjectsDataProvider implements CRUDDataProvider<Models.Project> {
    private dataReaderAndWriter: Neo4jDataReaderAndWriter<Models.Project>;

    constructor(private driver: Neo4jDriver) {
        this.dataReaderAndWriter =
            new Neo4jDataReaderAndWriter<Models.Project>(
                driver,
                [new Neo4jRecordToObjectTypeConverter(Models.Project, PROJECT_CYPHER_VARIABLE)]);
    }

    public getAllEntities(
        successCallback: (result: Models.Project[]) => void,
        errorCallback: (result: Error) => void): void {

        let getAllProjectsQuery =
            `MATCH (startProjectNode:Project)
            WHERE NOT ()-[:NEXT]->(startProjectNode)
            WITH startProjectNode
            CALL apoc.path.subgraphAll(startProjectNode, {labelFilter: "Project"}) YIELD nodes as projects
            WITH projects
            UNWIND projects as ${PROJECT_CYPHER_VARIABLE}
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        this.dataReaderAndWriter.read(
            successCallback,
            errorCallback,
            getAllProjectsQuery);
    }

    public getEntity(
        successCallback: (result: Models.Project[]) => void,
        errorCallback: (result: Error) => void,
        projectId: number): void {

        let getProjectQuery =
            `MATCH (${PROJECT_CYPHER_VARIABLE}:Project)
            WHERE ID(${PROJECT_CYPHER_VARIABLE})=${projectId}
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        this.dataReaderAndWriter.read(
            successCallback,
            errorCallback,
            getProjectQuery);
    }

    public createEntity(
        successCallback: (result: Models.Project[]) => void,
        errorCallback: (result: Error) => void,
        project: Models.Project): void {

        let createProjectQuery =
            `OPTIONAL MATCH (lastConnectedProject:Project)
            WHERE NOT (lastConnectedProject)-[:NEXT]->(:Project)
            WITH lastConnectedProject
            CREATE (${PROJECT_CYPHER_VARIABLE}:Project $projectProperties),
                (backlog: Backlog $backlogProperties),
                (archive: Archive $archiveProperties),
                (${PROJECT_CYPHER_VARIABLE})-[:HAS_BACKLOG]->(backlog),
                (${PROJECT_CYPHER_VARIABLE})-[:HAS_ARCHIVE]->(archive)
            WITH lastConnectedProject, ${PROJECT_CYPHER_VARIABLE}
            FOREACH
                (ls IN (CASE WHEN lastConnectedProject IS NOT NULL THEN [lastConnectedProject] ELSE [] END) | 
                CREATE (ls)-[:NEXT]->(${PROJECT_CYPHER_VARIABLE}))
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        let createProjectQueryProperties = {
            projectProperties: project,
            backlogProperties: new Models.Archive(),
            archiveProperties: new Models.Backlog(),
        };

        delete createProjectQueryProperties.projectProperties["id"];
        delete createProjectQueryProperties.backlogProperties["id"];
        delete createProjectQueryProperties.archiveProperties["id"];

        createProjectQueryProperties.projectProperties["createdDateTimestamp"] =
            new Date().getTime();

        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            createProjectQuery,
            createProjectQueryProperties);
    }

    public updateEntity(
        successCallback: (result: Models.Project[]) => void,
        errorCallback: (result: Error) => void,
        projectId: number,
        project: Models.Project): void {

        let updateProjectQuery =
            `MATCH (${PROJECT_CYPHER_VARIABLE}:Project)
            WHERE ID(${PROJECT_CYPHER_VARIABLE})=${projectId}
            WITH ${PROJECT_CYPHER_VARIABLE}
            SET ${PROJECT_CYPHER_VARIABLE}=$projectProperties
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        delete project.id;
        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            updateProjectQuery,
            { projectProperties: project });
    }

    deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number): void {

        new DefaultDeleteSubtreeOfNodesDataProvider(this.driver, Models.Project)
            .deleteEntity(
            successCallback,
            errorCallback,
            projectIdParam);
    }
}