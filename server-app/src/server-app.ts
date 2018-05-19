import * as server from 'express-server';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Request, Response } from 'express';
import { Neo4jConnector } from './app/database';
import { CompositeRouterProvider } from './app/routes';
import { setupCleanup } from './app/util/CleanupUtil';

var config = require('./resources/server-config');

let httpPort = normalizePort(process.env.PORT || config.server.conf.port);
let neo4jConnector = new Neo4jConnector();
let app = express();

let neo4jDriver = neo4jConnector.connect();
let routerProvider = new CompositeRouterProvider(neo4jDriver);

app.use(cors(config.server.conf.cors));
app.use(bodyParser())

// All Endpoints
app.use(routerProvider.getRouter());

let server = app.listen(httpPort, () => console.log(`Listening on port ${httpPort} for requests.`));
setupCleanup(server, neo4jConnector);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    throw new Error("Invalid port number.");
}

