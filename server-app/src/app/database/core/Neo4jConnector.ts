import { v1 as Neo4j } from 'neo4j-driver';
import { Driver } from 'neo4j-driver/types/v1';
import { Neo4jDriver, Neo4jDriverImpl } from './Neo4jDriver';
import { ConnectionOptions } from './ConnectionOptions';
import { AuthenticationOptions } from './AuthenticationOptions';

/**
 * This class manages the connection to the Neo4j database.
 */
export class Neo4jConnector {
    private driver: Driver;
    private driverWrapper: Neo4jDriver;

    /**
     * Establish a connection to the database.
     */
    public connect(
        connectionOptions: ConnectionOptions,
        authenticationOptions: AuthenticationOptions): Neo4jDriver {
        
        if (!this.driver) {
            this.driver = Neo4j.driver(
                this.createNeo4jUriFromConnectionOptions(connectionOptions),
                Neo4j.auth.basic(
                    authenticationOptions.username,
                    authenticationOptions.password));
            this.driverWrapper = new Neo4jDriverImpl(this.driver);
        }

        return this.driverWrapper;
    }

    /**
     * Disconnect from the database and free used resources.
     */
    public disconnect() {
        if (!this.driver) {
            this.driver.close();
            this.driver = null;
            this.driverWrapper = null;
        }
    }

    private createNeo4jUriFromConnectionOptions(connectionOptions: ConnectionOptions) {
        return `${connectionOptions.protocol}://${connectionOptions.uri}:${connectionOptions.port}`;
    }
}