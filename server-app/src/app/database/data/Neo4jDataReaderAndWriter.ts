import { Session, Transaction, Record, ResultSummary } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../core/Neo4jDriver';
import { Neo4jRecordToObjectTypeConverter } from '../data/Neo4jRecordToObjectTypeConverter'

/**
 * This a superclass to all classes which will access the data sored in the 
 * Neo4j database.
 */
export class Neo4jDataReaderAndWriter<T> {
    private driver: Neo4jDriver;
    private recordToObjectTypeConverters: Neo4jRecordToObjectTypeConverter<T>[];

    constructor(driver: Neo4jDriver);
    constructor(
        driver: Neo4jDriver,
        recordToObjectTypeConverters?: Neo4jRecordToObjectTypeConverter<T>[]);
    constructor(
        driver: Neo4jDriver,
        recordToObjectTypeConverters?: Neo4jRecordToObjectTypeConverter<T>[]) {

        this.driver = driver;
        this.recordToObjectTypeConverters = recordToObjectTypeConverters;
    }

    /**
     * The method retrieves data from the Neo4j database by executing the read query with the specified parameters.
     * @param query The query to be executed against the Neo4j database.
     * @param parameters The parameters of the query.
     * @param successCallback The callback to be invoked when the data is retrieved successfully.
     * @param errorCallback The callback to be invoked when an error occurs while retrieving the data.
     */
    public read(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        query: string,
        parameters?: object): void {

        this.executeReadTransaction(
            this.createRecordToObjectTypeInterceptor(successCallback),
            errorCallback,
            query,
            parameters);
    }

    /**
     * The method writes data in the Neo4j database by executing the query with the specified parameters.
     * @param query The query to be executed against the Neo4j database.
     * @param parameters The parameters of the query.
     * @param successCallback The callback to be invoked when the data is stored successfully.
     * @param errorCallback The callback to be invoked when an error occurs while storing the data.
     */
    public write(
        successCallback: (result?: T[]) => void,
        errorCallback: (result: Error) => void,
        query: string,
        parameters?: object): void {

        this.executeWriteTransaction(
            this.createRecordToObjectTypeInterceptor(successCallback),
            errorCallback,
            query,
            parameters);
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
    private executeReadTransaction(
        successCallback: (result: Record[]) => void,
        errorCallback: (result: Error) => void,
        query: string,
        parameters: object): void {

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
    private executeWriteTransaction(
        successCallback: (result: Record[]) => void,
        errorCallback: (result: Error) => void,
        query: string,
        parameters?: object): void {

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

    private createRecordToObjectTypeInterceptor(interceptedCallback: () => void);
    private createRecordToObjectTypeInterceptor(interceptedCallback: (result: T[]) => void)
    private createRecordToObjectTypeInterceptor(
        interceptedCallback: (result?: T[]) => void): (result: Record[]) => void {
        return (result: Record[]) => {
            let convertedObjects: T[] = new Array<T>();

            for (let i = 0; i < result.length; i++) {
                for (let converter of this.recordToObjectTypeConverters) {
                    let convertedObject = converter.convertRecord(result[i]);

                    if (convertedObject != null) {
                        convertedObjects.push(convertedObject);
                        break;
                    }
                }
            }

            interceptedCallback(convertedObjects);
        };
    }
}