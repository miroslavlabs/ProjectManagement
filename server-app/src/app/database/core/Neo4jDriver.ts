import { Driver, Session } from 'neo4j-driver/types/v1';

interface Neo4jDriver {
    session: Session;

    closeSession(session: Session);
}

class Neo4jDriverImpl implements Neo4jDriver {
    constructor(private driver: Driver) {

    }

    get session(): Session {
        return this.driver.session();
    }

    closeSession(session: Session): void {
        session.close();
    }
}

export { Neo4jDriver, Neo4jDriverImpl };