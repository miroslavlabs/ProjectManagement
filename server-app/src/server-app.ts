import * as server from 'express-server';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Request, Response } from 'express';
import { Neo4jConnector, ConnectionOptions, AuthenticationOptions } from './app/database/core';
import { CompositeRouterProvider } from './app/routes';
import { setupCleanup } from './app/util/CleanupUtil';
// FIXME take out some of the classes from the util package and put them
// at application level
import { Objects, ClassUtils } from './app/util/';

import { LogFactory } from './app/log';

var config = require('./resources/server-config');
var neo4j_db = require('./resources/neo4j-db');

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

    for (let j = 0; j < process.argv.length; j++) {
        for (let argumentName in argumentNames) {
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
    let classInstance: T;
    let propertyNames: string[] = ClassUtils.getPropertiesForClass(classCtr);
    let commandLineArgumentValues = getCommandLineArgumentValues(propertyNames);

    if (commandLineArgumentValues != undefined) {
        classInstance = new classCtr();
        for (let propertyName in propertyNames) {
            classInstance[propertyName] = commandLineArgumentValues[propertyName];
        }
    }

    return classInstance;
}

function getConnectionOptions() {
    let connectionOptions: ConnectionOptions;
    let hasCommandLineArguments: boolean = checkCommandLineArgumentsSpecified();
    if (hasCommandLineArguments) {
        connectionOptions = parseCommandLineArgumentsForClass(ConnectionOptions);
    }

    if (!hasCommandLineArguments || connectionOptions == undefined) {
        connectionOptions = new ConnectionOptions();

        connectionOptions.port = neo4j_db.connection.port;
        connectionOptions.protocol = neo4j_db.connection.protocol;
        connectionOptions.uri = neo4j_db.connection.uri;
    }

    return connectionOptions;
}

function getAuthenticationOptions() {
    let authenticationOptions: AuthenticationOptions;
    let hasCommandLineArguments: boolean = checkCommandLineArgumentsSpecified();
    if (hasCommandLineArguments) {
        authenticationOptions = parseCommandLineArgumentsForClass(AuthenticationOptions);
    }

    if (!hasCommandLineArguments || authenticationOptions == undefined) {
        authenticationOptions = new AuthenticationOptions();

        authenticationOptions.username = neo4j_db.authentication.username;
        authenticationOptions.password = neo4j_db.authentication.password;
    }

    return authenticationOptions;
}

function main() {
    init();

    let httpPort = normalizePort(process.env.PORT || config.server.conf.port);
    let neo4jConnector = new Neo4jConnector();

    let connectionOptions = getConnectionOptions();
    let authenticationOptions = getAuthenticationOptions();

    let neo4jDriver = neo4jConnector.connect(connectionOptions, authenticationOptions);
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