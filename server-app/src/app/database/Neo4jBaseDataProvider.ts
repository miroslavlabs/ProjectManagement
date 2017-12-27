import { Session, Transaction, Record, ResultSummary } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from './Neo4jDriver';

/**
 * This a superclass to all subclasses which will access the data sored in the 
 * Neo4j database.
 */
abstract class Neo4jBaseDataProvider {
    constructor(protected driver: Neo4jDriver) {
    }

    /**
     * The method executes a query against the database and passes the result of the 
     * execution to the appropriate callback.
     * 
     * @param query The query to be executed.
     * @param successCallback The callback to invoke when the query executes successfully.
     * @param errorCallback The callback to invoke when the query execution fails.
     */
    protected executeQuery(
        query: string,
        successCallback: (result: Record[]) => void,
        errorCallback: (result: Error) => void): void {

        let session: Session = this.driver.session;
        let records: Record[] = null;

        session
            .run(query)
            .then((result) => {
                successCallback(result.records);
                this.driver.closeSession(session);
            })
            .catch((error) => {
                errorCallback(error);
            });
    }
}

export { Neo4jBaseDataProvider };