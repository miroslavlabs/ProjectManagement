import { Router } from "express";

import { Neo4jDriver } from '../../database/core';
import { CRUDDataProviderFactory } from '../../database/provider';

import { EntityRouterProvider } from '../EntityRouterProvider';
import { CRUDEntityRouterProvider } from "./CRUDEntityRouterProvider";
import { LogFactory } from "../../log";

/**
 * This class registers all of REST the endpoints which will be supported by the application.
 */
export class CompositeRouterProvider implements EntityRouterProvider {
    private logger = LogFactory.createLogger(CompositeRouterProvider.name);

    constructor(
        private crudDataProviderFactory: CRUDDataProviderFactory,
        private modelsRoutesConfig: any) {
    }

    public getRouter(): Router {
        let compositeRouter = Router();
        let requestRouters = new Array<Router>();

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getProjectsDataProvider(),
                this.modelsRoutesConfig.project)
            .getRouter());
        
        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getBoardsDataProvider(),
                this.modelsRoutesConfig.board,
                "projectId")
            .getRouter());

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getBacklogAndArchiveDataProvider(),
                this.modelsRoutesConfig.bckarch,
                "projectId")
            .getRouter());
        
        requestRouters.push( 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStateDataProvider(),
                this.modelsRoutesConfig.state,
                "boardId")
            .getRouter());

        requestRouters.push( 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInStateDataProvider(),
                this.modelsRoutesConfig.storyInState,
                "stateId")
            .getRouter());

        requestRouters.push( 
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInArchiveDataProvider(),
                this.modelsRoutesConfig.storyInArchive,
                "archiveId")
            .getRouter());

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getStoryInBacklogDataProvider(),
                this.modelsRoutesConfig.storyInBacklog,
                "backlogId")
            .getRouter());

        requestRouters.push(
            new CRUDEntityRouterProvider(
                this.crudDataProviderFactory.getTaskDataProvider(),
                this.modelsRoutesConfig.task,
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