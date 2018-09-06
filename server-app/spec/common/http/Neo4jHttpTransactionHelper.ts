import * as request from 'request';

import { HttpUtils } from './HttpUtils';

/**
 * Perfroms HTTP transactions against the Neo4j database. This is suitable only for testing purposes.
 */
export class Neo4jHttpTransactionHelper<V> {
    private neo4jTransactionUri: string;
    private neo4jAhutorizationHeader: string;

    constructor(
        neo4jAddress: string,
        neo4jBrowserPort: string,
        private neo4jUsername: string,
        private neo4jPassword: string,
        private objectTypeCtor: new () => V) {

        this.neo4jTransactionUri = `http://${neo4jAddress}:${neo4jBrowserPort}/db/data/transaction/commit`;
    }

    /**
     * Executes a transaction against the Neo4j HTTP Transaction REST API.
     * 
     * @param neo4jRequest The statements to be executed against the Neo4j instance.
     */
    public executeStatements(neo4jRequest: { statements: [{ statement: string, parameters?: { props: any } }] }) {
        let requestPromise: Promise<V[]> = new Promise((resolve, reject) => {
            request.post(
                this.neo4jTransactionUri,
                {
                    json: neo4jRequest,
                    headers: {
                        // Using Basic authorizstion.
                        "Authorization": this.createAuthorizationHeader()
                    }
                },
                (error: any, response: request.Response, body: any) => {
                    if (error) {
                        reject(`Failed to execute neo4j transaction: ${JSON.stringify(neo4jRequest)}`)
                    }

                    if (response != undefined && response.statusCode != 200) {
                        reject(`The response status code is ${response.statusCode} with body ${JSON.stringify(response)}`);
                    }

                    let nodeData: V[] = this.createModelObjectFromTranactionResponse(body);
                    if (nodeData) {
                        resolve(nodeData);
                    } else {
                        resolve(body);
                    }
                })
        });

        return requestPromise;
    }

    public getNodeById(nodeId: number): Promise<V[]> {
        return this.executeStatements(
            { statements: [
                { statement: `OPTIONAL MATCH (n) WHERE ID(n)=${nodeId} RETURN n` }]
            });
    }

    /**
     * The method clears the database from any previously created nodes and relationships.
     */
    public clearDatabase() {
        return this.executeStatements(
            { statements: [
                { statement: "MATCH (n) DETACH DELETE n" }]
            });
    }

    private createModelObjectFromTranactionResponse(body: any) {
        if (body.results[0].data.length == 0 || body.results[0].data[0].row == null) {
            return null;
        }

        let modelObject = body.results[0].data[0].row[0];
        modelObject.id = body.results[0].data[0].meta[0].id;

        modelObject = HttpUtils.convertReponseBodyToObjectsOfType([modelObject], this.objectTypeCtor);

        return modelObject;
    }

    private createAuthorizationHeader() {
        return "Basic " + Buffer.from(this.neo4jUsername + ":" + this.neo4jPassword).toString("base64");
    }
}