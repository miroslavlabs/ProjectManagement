import { Router } from "express";

import { 
    Neo4jDriver,
    CRUDDataProviderFactory
} from '../../database/';

import { EntityRouterProvider } from '../EntityRouterProvider';
import { CRUDEntityRouterProvider } from "./CRUDEntityRouterProvider";
import { LogFactory } from "../../log";

var config = require('../../../resources/server-config');

/**
 * This class registers all of REST the endpoints which will be supported by the application.
 */
export class CompositeRouterProvider implements EntityRouterProvider {
    private crudDataProviderFactory: CRUDDataProviderFactory;
    private logger = LogFactory.createLogger(CompositeRouterProvider.name);

    constructor(neo4jDriver: Neo4jDriver) {
        this.crudDataProviderFactory = new CRUDDataProviderFactory(neo4jDriver);
    }

    public getRouter(): Router {
        let compositeRouter = Router();
        let requestRouters = new Array<Router>();

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getProjectsDataProvider(),
                config.routes.project)
            .getRouter());
        
        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getBoardsDataProvider(),
                config.routes.board,
                "projectId")
            .getRouter());

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getBacklogAndArchiveDataProvider(),
                config.routes.bckarch,
                "projectId")
            .getRouter());
        
        requestRouters.push( 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStateDataProvider(),
                config.routes.state,
                "boardId")
            .getRouter());

        requestRouters.push( 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInStateDataProvider(),
                config.routes.storyInState,
                "stateId")
            .getRouter());

        requestRouters.push( 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInArchiveDataProvider(),
                config.routes.storyInArchive,
                "archiveId")
            .getRouter());

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInBacklogDataProvider(),
                config.routes.storyInBacklog,
                "backlogId")
            .getRouter());

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getTaskDataProvider(),
                config.routes.task,
                "storyId")
            .getRouter());

        compositeRouter.use(requestRouters);

        this.logRegisteredPaths(requestRouters);

        return compositeRouter;
    }

    private logRegisteredPaths(routers: Router[]): void {
        if (!this.logger["isInfoEnabled"]()) {
            return;
        }

        routers.forEach(
            endpointRouter => {
                endpointRouter.stack.forEach(router => {
                    this.logger.info(
                        "Registered endpoint path %s for methods %s",
                        router.route.path,
                        JSON.stringify(router.route.methods)) ;
                });
            });
    }
}