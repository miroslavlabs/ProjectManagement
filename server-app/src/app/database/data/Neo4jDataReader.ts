import { Session, Transaction, Record, ResultSummary } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../core/Neo4jDriver';
import { Neo4jRecordToObjectTypeConverter } from '../data/Neo4jRecordToObjectTypeConverter'

/**
 * This a superclass to all subclasses which will access the data sored in the 
 * Neo4j database.
 */
export class Neo4jDataReader<T> {
    constructor(
        private driver: Neo4jDriver,
        private recordToObjectTypeConverter: Neo4jRecordToObjectTypeConverter<T>) {
    }

    /**
     * The method retrieves data from the Neo4j database by executing the read query with the specified parameters.
     * @param query The query to be executed against the Neo4j database.
     * @param parameters The parameters for the query.
     * @param successCallback The callback to be invoked when the data is retrieved successfully.
     * @param errorCallback The callback to be invoked when an error occurs while retrieving the data.
     */
    public read(
        query: string,
        parameters: object,
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void): void {

        this.executeReadQuery(
            query,
            parameters,
            this.createRecordToObjectTypeInterceptor(successCallback),
            errorCallback);
    }

    /**
     * The method deletes data in the Neo4j database by executing the delete query with the specified parameters.
     * @param query The query to be executed against the Neo4j database.
     * @param parameters The parameters for the query.
     * @param successCallback The callback to be invoked when the data is retrieved successfully.
     * @param errorCallback The callback to be invoked when an error occurs while retrieving the data.
     */
    public write(
        query: string,
        parameters: object,
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void): void {

        this.executeWriteQuery(
            query,
            parameters,
            this.createRecordToObjectTypeInterceptor(successCallback),
            errorCallback);
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
    private executeReadQuery(
        query: string,
        parameters: object,
        successCallback: (result: Record[]) => void,
        errorCallback: (result: Error) => void): void {

        let session: Session = this.driver.session;
        let writeTxPromise =
            session.readTransaction(tx => tx.run(query, parameters));

        writeTxPromise
            .then((result) => {
                successCallback(result.records);
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
    private executeWriteQuery(
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

    /**
     * 
     * @param interceptedCallback 
     */
    private createRecordToObjectTypeInterceptor(
        interceptedCallback: (result: T[]) => void): (result: Record[]) => void {
        return (result: Record[]) => {
            let projects: T[] = new Array<T>();

            for (let i = 0; i < result.length; i++) {
                let convertedResult =
                    this.recordToObjectTypeConverter.convertRecord(result[i]);
                projects.push(convertedResult);
            }

            interceptedCallback(projects);
        };
    }
}