"use strict"

import * as server from 'express-server';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Request, Response } from 'express';
import { Neo4jConnector } from './app/database';
import { ProjectsRoutes } from './app/routes/ProjectsRoutes';
import { setupCleanup } from './app/util/CleanupUtil';

// FIXME: move the port number to a configuration file.
let httpPort = normalizePort(process.env.PORT || 8080);
let neo4jConnector = new Neo4jConnector();
let app = express();

let neo4jDriver = neo4jConnector.connect();
let projectsRoutes = new ProjectsRoutes(neo4jDriver);

const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: false,
    methods: "GET,HEAD,PUT,POST,DELETE",
    origin: "http://localhost:4200"
  };

app.use(cors(options));
app.use(bodyParser())
app.get('/', (req: Request, res: Response) => res.send('Hello World!'))
// Projects
app.use('/api/v1/project', projectsRoutes.createProjectRoutes());

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

