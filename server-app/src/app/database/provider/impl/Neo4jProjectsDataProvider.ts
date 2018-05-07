import { Session, Transaction, Record, Node } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReader } from '../../data/Neo4jDataReader';
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import { Project } from '../../../model';
import { CRUDDataProvider } from '../CRUDDataProvider';

const PROJECT_CYPHER_VARIABLE: string = "project";

/**
 * This class retrives/modifies information on projects from a Neo4j database.
 */
export class Neo4jProjectsDataProvider implements CRUDDataProvider<Project> {
    private dataReader: Neo4jDataReader<Project>;

    constructor(driver: Neo4jDriver) {
        this.dataReader =
            new Neo4jDataReader<Project>(
                driver,
                new Neo4jRecordToObjectTypeConverter(Project, PROJECT_CYPHER_VARIABLE));
    }

    public getAllEntities(
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

        let getAllProjectsQuery =
            `MATCH (${PROJECT_CYPHER_VARIABLE}:Project) 
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        this.dataReader.read(
            getAllProjectsQuery,
            {} /*parameters*/,
            successCallback,
            errorCallback);
    }

    public getEntity(
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number): void {

        let getProjectQuery =
            `MATCH (${PROJECT_CYPHER_VARIABLE}:Project)
            WHERE ID(${PROJECT_CYPHER_VARIABLE})=$projectId
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        this.dataReader.read(
            getProjectQuery,
            { projectId: projectIdParam },
            successCallback,
            errorCallback);
    }

    public createEntity(
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void,
        project: Project): void {

        let createProjectQuery =
            `CREATE (${PROJECT_CYPHER_VARIABLE}:Project $projectProperties),
            (backlog: Backlog),
            (archive: Archive),
            (${PROJECT_CYPHER_VARIABLE})-[:HAS_BACKLOG]->(backlog),
            (${PROJECT_CYPHER_VARIABLE})-[:HAS_ARCHIVE]->(archive)
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        delete project.id;
        project.createdDateTimestamp = new Date().getTime();

        let createProjectQueryProperties = {
            projectProperties: project
        };

        this.dataReader.write(
            createProjectQuery,
            createProjectQueryProperties,
            successCallback,
            errorCallback);
    }

    public updateEntity(
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number,
        project: Project): void {

        let updateProjectQuery =
            `MATCH (${PROJECT_CYPHER_VARIABLE}:Project)
            WHERE ID(${PROJECT_CYPHER_VARIABLE})=$projectId
            WITH ${PROJECT_CYPHER_VARIABLE}
            SET ${PROJECT_CYPHER_VARIABLE}=$projectProperties
            RETURN ${PROJECT_CYPHER_VARIABLE}`;

        delete project.id;
        let updateProjectQueryProperties = {
            projectProperties: project,
            projectId: projectIdParam
        };

        this.dataReader.write(
            updateProjectQuery,
            updateProjectQueryProperties,
            successCallback,
            errorCallback);
    }

    public deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number): void {
        
        throw new Error("Operation not supported.");
    }
}