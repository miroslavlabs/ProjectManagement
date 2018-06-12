import * as server from 'express-server';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Request, Response } from 'express';
import { Neo4jConnector } from './app/database';
import { CompositeRouterProvider } from './app/routes';
import { setupCleanup } from './app/util/CleanupUtil';
import { Objects } from './app/util/Objects';

import { LogFactory } from './app/log';

var config = require('./resources/server-config');

let init = () => {
    Objects.addProrortypesToExistingObjects();
    LogFactory.initialize();
}

/**
 * Normalize a port into a number, string, or false.
 */
let normalizePort = (val) => {
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

let main = () => {
    init();

    let httpPort = normalizePort(process.env.PORT || config.server.conf.port);
    let neo4jConnector = new Neo4jConnector();
    
    let neo4jDriver = neo4jConnector.connect();
    let routerProvider = new CompositeRouterProvider(neo4jDriver);
    let logger = LogFactory.createLogger("root");

    let app = express();
    app.use(cors(config.server.conf.cors));
    app.use(bodyParser.json());
    app.use(routerProvider.getRouter()); // All Endpoints

    let server = app.listen(httpPort, () => {
        if (logger["isInfoEnabled"]()) {
            logger.info(`Listening on port ${httpPort} for requests.`)
        }
    });
    setupCleanup(server, neo4jConnector);
}

// Start the application;
main();
