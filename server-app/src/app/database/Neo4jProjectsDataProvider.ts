import { Session, Transaction, Record, Node } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from './Neo4jDriver';
import { Neo4jBaseDataProvider } from './Neo4jBaseDataProvider';
import { Project } from '../components/Project';

/**
 * This class retrives and maintains information on projects from the Neo4j database.
 */
class Neo4jProjectsDataProvider extends Neo4jBaseDataProvider {
    private readonly PROJECT_CYPHER_VARIABLE = "project";
    constructor(driver: Neo4jDriver) {
        super(driver);
    }

    /**
     * The method retrieves information on all of the projects' data stored in the database.
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getAllProjects(
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

        let getAllProjectsQuery =
            `MATCH (${this.PROJECT_CYPHER_VARIABLE}:Project) 
            RETURN ${this.PROJECT_CYPHER_VARIABLE}`;

        super.executeQuery(
            getAllProjectsQuery,
            this.createRecordToProjectCallbackInterceptor(successCallback),
            errorCallback);
    }

    /**
     * Acquire data about a project, given the ID of the project data Node.
     * @param projectId The ID of the Node which contains the requested project data.
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getProject(
        projectId: number,
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

        let getProjectQuery =
            `MATCH (project:Project) WHERE ID(project)=${projectId} RETURN project`;

        super.executeQuery(
            getProjectQuery,
            this.createRecordToProjectCallbackInterceptor(successCallback),
            errorCallback);
    }

    /**
     * Create a project Node in the database.
     * @param project The project object to be stored in the database.
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public createProject(
        project: Project,
        successCallback: (result: Project[]) => void,
        errorCallback: (result: Error) => void): void {

        let createProjectQuery =
            `CREATE (${this.PROJECT_CYPHER_VARIABLE}:Project {
                title:"${project.title}",
                shortDescription:"${project.shortDescription}",
                fullDescription:"${project.fullDescription}"})
            RETURN ${this.PROJECT_CYPHER_VARIABLE}`;

        super.executeQuery(
            createProjectQuery,
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

        let project = new Project(
            projectNode.properties["title"],
            projectNode.properties["fullDescription"],
            projectNode.properties["shortDescription"],
            projectNode.identity.toNumber()
        );

        return project;
    }
}

export { Neo4jProjectsDataProvider };