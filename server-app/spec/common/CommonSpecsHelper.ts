import { LogFactory } from '../../src/app/log';
import { LoggerInstance } from 'winston';

import { ServerAppHttpHelper, Neo4jHttpTransactionHelper } from '../common';
import { ConfigurationUtil } from '../../src/app/util';

export abstract class CommonSpecsHelper<T> {
    public static DEFAULT_JASMINE_TIMEOUT_INTERVAL_MILLIS: number = 25000; //25 seconds

    public static MODEL_ENTITIES_FOR_CREATION_COUNT: number = 3;

    private logger: LoggerInstance;
    private config: any;
    private serverAppHttpHelper: ServerAppHttpHelper<T>;
    private neo4jHttpTransactionHelper: Neo4jHttpTransactionHelper<T>;

    constructor(private loggerName: string, private objectTypeCtor: new () => T) {
        this.logger = LogFactory.createLogger(loggerName);
    }

    public prepare() {
        if (!this.config) {
            this.config = ConfigurationUtil.readConfigurationData(process.argv);
        }

        let endpointPath: string = this.getEndpointPath(this.config);
        this.serverAppHttpHelper = new ServerAppHttpHelper<T>(
            'localhost',
            this.config.app.port,
            endpointPath,
            this.objectTypeCtor
        );

        this.neo4jHttpTransactionHelper = new Neo4jHttpTransactionHelper<T>(
            this.config.neo4j.conn.address,
            this.config.neo4j.conn.borwser.port,
            this.config.neo4j.conn.username,
            this.config.neo4j.conn.password,
            this.objectTypeCtor
        );
    }

    protected abstract getEndpointPath(config: any);

    public abstract createSingleModelEntity(): Promise<[T, T[]]>;

    public abstract createMultipleModelEntities(): Promise<[T, T[]][]>;

    public abstract verifyModelEntityCreatedCorrectly(modelEntity: T, createdModelEnetity: T);

    public getLogger(): LoggerInstance {
        return this.logger;
    }

    public getServerAppHttpHelper(): ServerAppHttpHelper<T> {
        return this.serverAppHttpHelper;
    }

    public verifyNodeExistsInDb(node: T, callback?: (error?: any) => void): Promise<T[]> {
        
        let nodeRetrievalPromise: Promise<T[]> = 
            this.neo4jHttpTransactionHelper.getNodeById(node['id']);

        nodeRetrievalPromise.then((returnedNodes: T[]) => {
            expect(returnedNodes[0]).toEqual(node, "The provided node does not match the database entry.");

            if (callback) {
                callback();
            }

        }).catch((error: any) => {
            if (callback) {
                callback(error);
            }
        });

        return nodeRetrievalPromise;
    }

    public clearDatabase(): Promise<any> {
        return this.neo4jHttpTransactionHelper.clearDatabase();
    }

    public logExecutionStep(stepName: string) {
        this.logger.info(`Executing step: ${stepName}`);
    }

    public logErrorAndFailStep(error: string) {
        this.logger.error(error);
        fail(error);
    }
}