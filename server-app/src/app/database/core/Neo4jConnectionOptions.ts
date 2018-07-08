export class Neo4jConnectionOptions {
    neo4jProtocol: string = undefined;
    neo4jUri: string = undefined;
    neo4jPort: number = undefined;

    public toStringUri(): string {
        return `${this.neo4jProtocol}://${this.neo4jUri}:${this.neo4jPort}`;
    }
}