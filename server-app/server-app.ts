import * as server from 'express-server';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Request, Response } from 'express';
import { Neo4jConnector, Neo4jDriver, Neo4jConnectionOptions, Neo4jAuthenticationOptions } from './src/app/database/core';
import { CRUDDataProviderFactory } from './src/app/database/provider';
import { CompositeRouterProvider } from './src/app/routes';
// FIXME take out some of the classes from the util package and put them
// at application level
import { Objects, ClassUtils, CommandLineUtil, IniToJsonParser, setupCleanup } from './src/app/util';
import { LogFactory } from './src/app/log';

// FIXME !!!
var corsSettings = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: false,
    methods: "GET,HEAD,PUT,POST,DELETE",
    origin: "http://localhost:4200"
}

class ServerApp {

    public main() {
        Objects.addProrortypesToExistingObjects();
        LogFactory.initialize();

        let config = this.readConfigurationData();

        let httpPort = this.normalizePort(process.env.PORT || config.app.port);
        let neo4jConnector = new Neo4jConnector();
        let neo4jDriver = this.createNeo4jDriver(neo4jConnector, config);

        let routerProvider = new CompositeRouterProvider(new CRUDDataProviderFactory(neo4jDriver), config.app.route);
        let logger = LogFactory.createLogger("root");

        let app = express();
        app.use(cors(corsSettings));
        app.use(bodyParser.json());
        app.use(routerProvider.getRouter()); // All Endpoints

        let server = app.listen(httpPort, () => {
            if (logger["isInfoEnabled"]()) {
                logger.info(`Listening on port ${httpPort} for requests.`)
            }
        });
        setupCleanup(server, neo4jConnector);
    }

    private readConfigurationData(): any {
        let commandLineArgumentValues = CommandLineUtil.parseCommandLineArgumentValues(process.argv);
        let configurationFileLoation = commandLineArgumentValues["configPath"];
        if (!configurationFileLoation) {
            throw new Error("Missing configuration path.");
        }

        let config = IniToJsonParser.convertIniToJson(configurationFileLoation);

        return config;
    }

    private createNeo4jDriver(neo4jConnector: Neo4jConnector, config: any): Neo4jDriver {
        let neo4jConnectionOptions = this.getNeo4jConnectionOptions(config);
        let neo4jAuthenticationOptions = this.getNeo4jAuthenticationOptions(config);

        let neo4jDriver = neo4jConnector.connect(neo4jConnectionOptions, neo4jAuthenticationOptions);

        return neo4jDriver;
    }

    private getNeo4jConnectionOptions(config: any) {
        let neo4jConnectionOptions: Neo4jConnectionOptions = new Neo4jConnectionOptions();

        if (!config.neo4j.conn.bolt.port) {
            throw new Error("Missing value for Neo4j port.");
        } else {
            neo4jConnectionOptions.neo4jPort = config.neo4j.conn.bolt.port;
        }

        if (!config.neo4j.conn.protocol) {
            throw new Error("Missing value for Neo4j protocol.");
        } else {
            neo4jConnectionOptions.neo4jProtocol = config.neo4j.conn.protocol;
        }

        if (!config.neo4j.conn.address) {
            throw new Error("Missing value for Neo4j URI.");
        } else {
            neo4jConnectionOptions.neo4jAddress = config.neo4j.conn.address;
        }

        return neo4jConnectionOptions;
    }

    private getNeo4jAuthenticationOptions(config: any) {
        let neo4jAuthenticationOptions: Neo4jAuthenticationOptions = new Neo4jAuthenticationOptions();

        if (!config.neo4j.conn.username) {
            throw new Error("Missing value for Neo4j login username.");
        } else {
            neo4jAuthenticationOptions = config.neo4j.conn.username;
        }

        if (!config.neo4j.conn.password) {
            throw new Error("Missing value for Neo4j login password.");
        } else {
            neo4jAuthenticationOptions = config.neo4j.conn.password;
        }

        return neo4jAuthenticationOptions;
    }
    /**
     * Normalize a port into a number, string, or false.
     */
    private normalizePort(val) {
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

}

(function main() {
    let serverApp = new ServerApp;
    
    serverApp.main();
}())