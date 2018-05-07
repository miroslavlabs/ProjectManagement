import { Router } from "express";

import { 
    Neo4jDriver,
    Neo4jStatesDataProvider,
    Neo4jBoardsDataProvider,
    Neo4jProjectsDataProvider
} from '../../database/';

import { EntityRouterProvider } from '../EntityRouterProvider';
import { CRUDEntityRouterProvider } from "./CRUDEntityRouterProvider";

var config = require('../../../resources/server-config');

export class CompositeRouterProvider implements EntityRouterProvider {

    constructor(private neo4jDriver: Neo4jDriver) {
    }

    public getRouter(): Router {
        let compositeRouter = Router();

        let projectRouterProvider =
            new CRUDEntityRouterProvider(
                new Neo4jProjectsDataProvider(this.neo4jDriver),
                config.routes.project)
        
        let boardRouterProvider = 
            new CRUDEntityRouterProvider(
                new Neo4jBoardsDataProvider(this.neo4jDriver),
                config.routes.board,
                ["projectId"]);
        
        let stateRouterProivder = 
            new CRUDEntityRouterProvider(
                new Neo4jStatesDataProvider(this.neo4jDriver),
                config.routes.state,
                ["boardId"]);

        compositeRouter.use(
            projectRouterProvider.getRouter(),
            boardRouterProvider.getRouter(),
            stateRouterProivder.getRouter());

        return compositeRouter;
    }
}