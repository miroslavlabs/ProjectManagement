import { Neo4jConnector } from "../database";

export function setupCleanup(server: any, neo4jConnector: Neo4jConnector) {
    process.on('exit', function () {
        close(server, neo4jConnector);
        console.log('exit: Disconnected from the Neo4j database.');
    });

    process.on('SIGINT', function () {
        close(server, neo4jConnector);
        console.log('SIGINT: Disconnected from the Neo4j database.');
    });

    // Process being killed
    process.on('SIGUSR1', function () {
        close(server, neo4jConnector);
        console.log('SIGUSR1: Disconnected from the Neo4j database.');
    });

    process.on('SIGUSR2', function () {
        close(server, neo4jConnector);
        console.log('SIGUSR2: Disconnected from the Neo4j database.');
    });

    process.on('uncaughtException', function (err) {
        close(server, neo4jConnector);
        console.log('uncaughtException: Disconnected from the Neo4j database.');
        console.log(`The following error occurred: ${err}`);
    });
}

function close(server: any, neo4jConnector: Neo4jConnector): void {
    neo4jConnector.disconnect();
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(function () {
        console.error('Could not close connections in time, forcefully shutting down.');
        process.exit(0)
    }, 5 * 1000);
}