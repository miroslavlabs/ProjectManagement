import * as server from 'express-server';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Request, Response } from 'express';
import { Neo4jConnector, Neo4jConnectionOptions, Neo4jAuthenticationOptions } from './src/app/database/core';
import { CompositeRouterProvider } from './src/app/routes';
import { setupCleanup } from './src/app/util/CleanupUtil';
// FIXME take out some of the classes from the util package and put them
// at application level
import { Objects, ClassUtils } from './src/app/util/';

import { LogFactory } from './src/app/log';

var config = require('./resources/server-config');

function init() {
    Objects.addProrortypesToExistingObjects();
    LogFactory.initialize();
}

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

function checkCommandLineArgumentsSpecified(): boolean {
    return process.argv.length > 3;
}

function getCommandLineArgumentValues(argumentNames: string[]) {
    let argumentValues;

    for (let j = 2; j < process.argv.length; j++) {
        for (let argumentName of argumentNames) {
            if (process.argv[j].startsWith(argumentName)) {
                // Initialize only if argument values are speecified
                if (!argumentValues) {
                    argumentValues = {};
                }

                argumentValues[argumentName] = process.argv[j].split("=")[1];
                break;
            }
        }
    }

    return argumentValues;
}

function parseCommandLineArgumentsForClass<T>(classCtr: new () => T) {
    let classInstance: T = new classCtr();
    if (!checkCommandLineArgumentsSpecified()) {
        return classInstance;
    }
    
    let propertyNames: string[] = ClassUtils.getPropertiesForClass(classCtr);
    let commandLineArgumentValues = getCommandLineArgumentValues(propertyNames);

    if (commandLineArgumentValues != undefined) {
        for (let propertyName of propertyNames) {
            classInstance[propertyName] = commandLineArgumentValues[propertyName];
        }
    }

    return classInstance;
}

function getNeo4jConnectionOptions() {
    let neo4jConnectionOptions: Neo4jConnectionOptions = 
        parseCommandLineArgumentsForClass(Neo4jConnectionOptions);

    if (!neo4jConnectionOptions.neo4jPort) { 
        throw new Error("Missing value for Neo4j port.");
    }

    if (!neo4jConnectionOptions.neo4jProtocol) {
        throw new Error("Missing value for Neo4j protocol.");
    }

    if (!neo4jConnectionOptions.neo4jUri) {
        throw new Error("Missing value for Neo4j URI.");
    }

    return neo4jConnectionOptions;
}

function getNeo4jAuthenticationOptions() {
    let neo4jAuthenticationOptions: Neo4jAuthenticationOptions = 
        parseCommandLineArgumentsForClass(Neo4jAuthenticationOptions);

    if (!neo4jAuthenticationOptions.neo4jUsername) {
        throw new Error("Missing value for Neo4j login username.");
    }
    
    if (!neo4jAuthenticationOptions.neo4jPassword) {
        throw new Error("Missing value for Neo4j login password.");
    }

    return neo4jAuthenticationOptions;
}

(function main() {
    init();

    let httpPort = normalizePort(process.env.PORT || config.server.conf.port);
    let neo4jConnector = new Neo4jConnector();

    let neo4jConnectionOptions = getNeo4jConnectionOptions();
    let neo4jAuthenticationOptions = getNeo4jAuthenticationOptions();

    let neo4jDriver = neo4jConnector.connect(neo4jConnectionOptions, neo4jAuthenticationOptions);
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
}())