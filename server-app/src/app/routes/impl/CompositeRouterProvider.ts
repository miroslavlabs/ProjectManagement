import { Router } from "express";

import { 
    Neo4jDriver,
    CRUDDataProviderFactory
} from '../../database/';

import { EntityRouterProvider } from '../EntityRouterProvider';
import { CRUDEntityRouterProvider } from "./CRUDEntityRouterProvider";

var config = require('../../../resources/server-config');

export class CompositeRouterProvider implements EntityRouterProvider {
    private crudDataProviderFactory: CRUDDataProviderFactory;

    constructor(neo4jDriver: Neo4jDriver) {
        this.crudDataProviderFactory = new CRUDDataProviderFactory(neo4jDriver);
    }

    public getRouter(): Router {
        let compositeRouter = Router();

        let projectRouterProvider =
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getProjectsDataProvider(),
                config.routes.project)
        
        let boardRouterProvider = 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getBoardsDataProvider(),
                config.routes.board,
                "projectId");

        let bckarchRouterProvider = 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getBacklogAndArchiveDataProvider(),
                config.routes.bckarch,
                "projectId");
        
        let stateRouterProivder = 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStateDataProvider(),
                config.routes.state,
                "boardId");

        let storyInStateRouterProivder = 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInStateDataProvider(),
                config.routes.storyInState,
                "stateId");

        let storyInArchiveRouterProivder = 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInArchiveDataProvider(),
                config.routes.storyInArchive,
                "archiveId");

        let storyInBacklogRouterProivder = 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInBacklogDataProvider(),
                config.routes.storyInBacklog,
                "backlogId");

        let taskRouterProivder = 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getTaskDataProvider(),
                config.routes.task,
                "storyId");

        compositeRouter.use(
            projectRouterProvider.getRouter(),
            bckarchRouterProvider.getRouter(),
            boardRouterProvider.getRouter(),
            stateRouterProivder.getRouter(),
            storyInStateRouterProivder.getRouter(),
            storyInArchiveRouterProivder.getRouter(),
            storyInBacklogRouterProivder.getRouter(),
            taskRouterProivder.getRouter());

        return compositeRouter;
    }
}