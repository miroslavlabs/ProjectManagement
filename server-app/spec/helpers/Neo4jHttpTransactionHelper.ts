import * as request from 'request';

export class Neo4jHttpTransactionHelper {
    private neo4jTransactionUri: string;

    constructor(neo4jUri: string, neo4jBrowserPort: string) {
        this.neo4jTransactionUri = `http://${neo4jUri}:${neo4jBrowserPort}/db/data/transaction`;
    }

    public executeStatements(statements: [{ statement: string, parameters?: { props: any } }]) {

    }

    private createAuthorizationHeader() {

    }
}