import { v1 as Neo4j } from 'neo4j-driver';
import { Driver } from 'neo4j-driver/types/v1';
import { Neo4jDriver, Neo4jDriverImpl } from './Neo4jDriver';

/**
 * This class manages the connection to the Neo4j database.
 */
class Neo4jConnector {
    private driver: Driver;
    private driverWrapper: Neo4jDriver;

    /**
     * Establish a connection to the database.
     */
    connect(): Neo4jDriver {
        if (!this.driver) {
            this.driver = Neo4j.driver('bolt://localhost:11006');
            this.driverWrapper = new Neo4jDriverImpl(this.driver);
        }

        return this.driverWrapper;
    }

    /**
     * Disconnect from the database and free used resources.
     */
    disconnect() {
        if (!this.driver) {
            this.driver.close();
            this.driver = null;
            this.driverWrapper = null;
        }
    }
}

export { Neo4jConnector };