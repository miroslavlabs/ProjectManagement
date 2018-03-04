import { Session, Transaction, Record, ResultSummary } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../core/Neo4jDriver';

/**
 * This a superclass to all subclasses which will access the data sored in the 
 * Neo4j database.
 */
abstract class Neo4jBaseDataProvider {
    constructor(protected driver: Neo4jDriver) {
    }

    /**
     * The method executes a read transaction against the database and passes the result of the 
     * execution to the appropriate callback.
     * 
     * @param query The query to be executed.
     * @param parameters The parameters to be passed to the query.
     * @param successCallback The callback to invoke when the query executes successfully.
     * @param errorCallback The callback to invoke when the query execution fails.
     */
    protected executeReadQuery(
        query: string,
        parameters: object,
        successCallback: (result: Record[]) => void,
        errorCallback: (result: Error) => void): void {

        let session: Session = this.driver.session;
        let writeTxPromise =
            session.readTransaction(tx => tx.run(query, parameters));

        writeTxPromise
            .then((result) => {
                if (result.records.length == 0) {
                    errorCallback(new Error(`Could not find projects.`));
                } else {
                    successCallback(result.records);
                }

                this.driver.closeSession(session);
            })
            .catch((error: Error) => {
                errorCallback(error);
                this.driver.closeSession(session);
            });
    }

    /**
     * The method executes a write transaction against the database and passes the result of the 
     * execution to the appropriate callback.
     * 
     * @param query The query to be executed.
     * @param parameters The parameters to be passed to the query.
     * @param successCallback The callback to invoke when the query executes successfully.
     * @param errorCallback The callback to invoke when the query execution fails.
     */
    protected executeWriteQuery(
        query: string,
        parameters: object,
        successCallback: (result: Record[]) => void,
        errorCallback: (result: Error) => void): void {

        let session: Session = this.driver.session;
        let records: Record[] = null;
        let writeTxPromise =
            session.writeTransaction(tx => tx.run(query, parameters));

        writeTxPromise
            .then((result) => {
                successCallback(result.records);
                this.driver.closeSession(session);
            })
            .catch((error) => {
                errorCallback(error);
                this.driver.closeSession(session);
            });
    }
}

export { Neo4jBaseDataProvider };