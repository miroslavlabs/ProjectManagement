import { Router } from "express";

import { Neo4jDriver } from '../database/';
import { EntityRouterProvider } from './EntityRouterProvider';
import { ProjectRouterProvider } from './ProjectRouterProvider';
import { BoardRouterProvider } from './BoardRouterProvider';
import { StateRouterProvider } from "./StateRouterProvider";

export class CompositeRouterProvider implements EntityRouterProvider {

    constructor(private neo4jDriver: Neo4jDriver) {
    }

    public getRouter(): Router {
        let compositeRouter = Router();

        let projectRouterProvider = new ProjectRouterProvider(this.neo4jDriver);
        let boardRouterProvider = new BoardRouterProvider(this.neo4jDriver);
        let stateRouterProivder = new StateRouterProvider(this.neo4jDriver);

        compositeRouter.use(
            projectRouterProvider.getRouter(),
            boardRouterProvider.getRouter(),
            stateRouterProivder.getRouter());

        return compositeRouter;
    }
}