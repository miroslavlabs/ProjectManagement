import { v1 as Neo4j } from 'neo4j-driver';
import { Driver } from 'neo4j-driver/types/v1';
import { Neo4jDriver, Neo4jDriverImpl } from './Neo4jDriver';
import { Neo4jConnectionOptions } from './Neo4jConnectionOptions';
import { Neo4jAuthenticationOptions } from './Neo4jAuthenticationOptions';

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
        neo4jConnectionOptions: Neo4jConnectionOptions,
        neo4jAuthenticationOptions: Neo4jAuthenticationOptions): Neo4jDriver {
        
        if (!this.driver) {
            this.driver = Neo4j.driver(
                neo4jConnectionOptions.toStringUri(),
                Neo4j.auth.basic(
                    neo4jAuthenticationOptions.neo4jUsername,
                    neo4jAuthenticationOptions.neo4jPassword)),
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
}