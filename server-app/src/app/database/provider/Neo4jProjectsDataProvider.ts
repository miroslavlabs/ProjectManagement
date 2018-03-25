import { Session, Transaction, Record, Node } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../core/Neo4jDriver';
import { Neo4jBaseDataProvider } from './Neo4jBaseDataProvider';
import { Project } from 'pm-shared-components';

/**
 * This class retrives and maintains information on projects from the Neo4j database.
 */
export class Neo4jProjectsDataProvider extends Neo4jBaseDataProvider {
    private readonly PROJECT_CYPHER_VARIABLE = "project";
    constructor(driver: Neo4jDriver) {
        super(driver);
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
            `MATCH (${this.PROJECT_CYPHER_VARIABLE}:Project) 
            RETURN ${this.PROJECT_CYPHER_VARIABLE}`;

        super.executeReadQuery(
            getAllProjectsQuery,
            {} /*parameters*/,
            this.createRecordToProjectCallbackInterceptor(successCallback),
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
            `MATCH (${this.PROJECT_CYPHER_VARIABLE}:Project)
            WHERE ID(${this.PROJECT_CYPHER_VARIABLE})=$projectId
            RETURN ${this.PROJECT_CYPHER_VARIABLE}`;

        super.executeReadQuery(
            getProjectQuery,
            { projectId: projectIdParam },
            this.createRecordToProjectCallbackInterceptor(successCallback),
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
            `CREATE (${this.PROJECT_CYPHER_VARIABLE}:Project $projectProperties)
            RETURN ${this.PROJECT_CYPHER_VARIABLE}`;

        delete project.id;
        let createProjectQueryProperties = {
            projectProperties: project
        };

        super.executeWriteQuery(
            createProjectQuery,
            project,
            this.createRecordToProjectCallbackInterceptor(successCallback),
            errorCallback);
    }

    /**
     * Updates the project Node data in the database. The {@link Project.id} property will not be used. Instead, the projectIdParam will be used to determine the node ID.
     * 
     * @param projectIdParam The ID of the project Node that will be updated.
     * @param project The project properties to be stored.
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public updateProject(
        projectIdParam: number,
        project: Project,
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

        let updateProjectQuery =
            `MATCH (${this.PROJECT_CYPHER_VARIABLE}:Project)
            WHERE ID(${this.PROJECT_CYPHER_VARIABLE})=$projectId
            WITH ${this.PROJECT_CYPHER_VARIABLE}
            SET ${this.PROJECT_CYPHER_VARIABLE}=$projectProperties
            RETURN ${this.PROJECT_CYPHER_VARIABLE}`;

        delete project.id;
        let updateProjectQueryProperties = {
            projectProperties: project,
            projectId: projectIdParam
        };

        super.executeWriteQuery(
            updateProjectQuery,
            updateProjectQueryProperties,
            this.createRecordToProjectCallbackInterceptor(successCallback),
            errorCallback);
    }

    private createRecordToProjectCallbackInterceptor(
        interceptedCallback: (result: Project[]) => void): (result: Record[]) => void {
        return (result: Record[]) => {
            let projects: Project[] = new Array<Project>();

            for (let i: number = 0; i < result.length; i++) {
                projects.push(this.convertRecordToProject(result[i]));
            }

            interceptedCallback(projects);
        };
    }

    private convertRecordToProject(record: Record): Project {
        let projectNode: Node =
            record.get(this.PROJECT_CYPHER_VARIABLE);

        let project = new Project();
        project.id = projectNode.identity.toNumber();
        project.title = projectNode.properties["title"];
        project.shortDescription = projectNode.properties["shortDescription"];
        project.fullDescription = projectNode.properties["fullDescription"];

        return project;
    }
}