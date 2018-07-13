export class Neo4jConnectionOptions {
    neo4jProtocol: string = undefined;
    neo4jAddress: string = undefined;
    neo4jPort: number = undefined;

    public toStringUri(): string {
        return `${this.neo4jProtocol}://${this.neo4jAddress}:${this.neo4jPort}`;
    }
}