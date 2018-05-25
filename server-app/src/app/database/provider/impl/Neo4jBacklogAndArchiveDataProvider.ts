import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReaderAndWriter } from "../../data/Neo4jDataReaderAndWriter";
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import * as Models from "../../../model"
import { CRUDDataProvider } from '../CRUDDataProvider';

const BCKARCH_CYPHER_VARIABLE = "bckarch";

export class Neo4jBacklogAndArchiveDataProvider implements CRUDDataProvider<Models.Archive|Models.Backlog> {
    private dataReaderAndWriter: Neo4jDataReaderAndWriter<Models.Archive|Models.Backlog>;
    
    constructor(driver: Neo4jDriver) {
        this.dataReaderAndWriter =
            new Neo4jDataReaderAndWriter<Models.Archive|Models.Backlog>(
                driver,
                [
                    new Neo4jRecordToObjectTypeConverter(
                        Models.Archive,
                        BCKARCH_CYPHER_VARIABLE),

                    new Neo4jRecordToObjectTypeConverter(
                        Models.Backlog,
                        BCKARCH_CYPHER_VARIABLE)
                ]);
    }

    public getAllEntities(
        successCallback: (result: (Models.Archive|Models.Backlog)[]) => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number): void {

        let getBacklogAndArhiveQuery =
            `MATCH (project:Project)-[:HAS_ARCHIVE|:HAS_BACKLOG]->(${BCKARCH_CYPHER_VARIABLE})
            WHERE ID(project)=$projectId
            RETURN ${BCKARCH_CYPHER_VARIABLE}`;

        this.dataReaderAndWriter.read(
            successCallback,
            errorCallback,
            getBacklogAndArhiveQuery,
            { projectId: projectIdParam });
    }
}