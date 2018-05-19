import { Session, Transaction, Record, Node } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../core/Neo4jDriver';
import { Neo4jDataReader } from '../data/Neo4jDataReader';
import { Neo4jRecordToObjectTypeConverter } from '../data/Neo4jRecordToObjectTypeConverter'
import { Project } from '../../model';

const PROJECT_CYPHER_VARIABLE: string = "project";

/**
 * This class retrives/modifies information on projects from a Neo4j database.
 */
export class Neo4jProjectsDataProvider {
    private dataReader: Neo4jDataReader<Project>;

    constructor(driver: Neo4jDriver) {
        this.dataReader =
            new Neo4jDataReader<Project>(
                driver,
                new Neo4jRecordToObjectTypeConverter(Project, PROJECT_CYPHER_VARIABLE));
    }

    /**
     * The method retrieves information on all of the projects' data stored in the database.
     * 
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getAllProjects(
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

    /**
     * Acquire data about a project, given the ID of the project data Node.
     * 
     * @param projectIdParam The ID of the Node which contains the requested project data.
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getProject(
        projectIdParam: number,
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

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

    /**
     * Create a project Node in the database.
     * 
     * @param project The project object to be stored in the database.
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public createProject(
        project: Project,
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

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

    /**
     * Updates the project Node data in the database. The {@link Project.id} property will not be used. Instead, the projectIdParam will be used for the node ID.
     * 
     * @param projectIdParam The ID of the project Node that will be updated.
     * @param project The project data to be stored.
     * @param successCallback This callback is invoked with the updated project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public updateProject(
        projectIdParam: number,
        project: Project,
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

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
}