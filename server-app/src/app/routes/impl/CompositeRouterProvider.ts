import { Router } from "express";

import { Neo4jDriver, Neo4jStatesDataProvider } from '../../database/';
import { EntityRouterProvider } from '../EntityRouterProvider';
import { ProjectRouterProvider } from '../ProjectRouterProvider';
import { BoardRouterProvider } from '../BoardRouterProvider';
import { CRUDEntityRouterProvider } from "./CRUDEntityRouterProvider";

var config = require('../../resources/server-config');

export class CompositeRouterProvider implements EntityRouterProvider {

    constructor(private neo4jDriver: Neo4jDriver) {
    }

    public getRouter(): Router {
        let compositeRouter = Router();

        let projectRouterProvider = new ProjectRouterProvider(this.neo4jDriver);
        
        let boardRouterProvider = new BoardRouterProvider(this.neo4jDriver);

        let stateRouterProivder = 
            new CRUDEntityRouterProvider(
                new Neo4jStatesDataProvider(this.neo4jDriver),
                config.routes.state,
                "boardId");

        compositeRouter.use(
            projectRouterProvider.getRouter(),
            boardRouterProvider.getRouter(),
            stateRouterProivder.getRouter());

        return compositeRouter;
    }
}