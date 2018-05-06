import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { Neo4jDriver, Neo4jConnector, Neo4jStatesDataProvider } from '../database';

import { EntityRouterProvider } from './EntityRouterProvider';
import { State } from '../model';
import { CallbackUtil } from "../util/CallbackUtil";

var config = require('../../resources/server-config');

export class StateRouterProvider implements EntityRouterProvider {
    private neo4jStatesDataProvider: Neo4jStatesDataProvider;

    constructor(private neo4jDriver: Neo4jDriver) {
        this.neo4jStatesDataProvider = new Neo4jStatesDataProvider(neo4jDriver);
    }

    /**
     * Creates the routes for the Project REST ednpoints.
     */
    public getRouter(): Router {
        let router = Router();
        
        let stateEndpoint = config.routes.state;
        router.get(`${stateEndpoint}`, this.getAllStates());
        router.post(`${stateEndpoint}`, this.createState());
        router.get(`${stateEndpoint}/:id`, this.getState());
        router.put(`${stateEndpoint}/:id`, this.updateState());
        router.delete(`${stateEndpoint}/:id`, this.deleteState());

        return router;
    }

    private getAllStates() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jStatesDataProvider.getAllStates(
                +req.query["boardId"],
                CallbackUtil.simpleRestSuccessCallback<State[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private getState() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jStatesDataProvider.getState(
                +req.params["id"],
                CallbackUtil.simpleRestSuccessCallback<State[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private createState() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jStatesDataProvider.createState(
                +req.query["boardId"],
                req.body /*state JSON data*/,
                CallbackUtil.simpleRestSuccessCallback<State[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private updateState() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jStatesDataProvider.updateState(
                +req.params["id"] /*state ID*/,
                req.body /*state data*/,
                CallbackUtil.simpleRestSuccessCallback<State[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private deleteState() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jStatesDataProvider.deleteState(
                +req.params["id"],
                CallbackUtil.simpleRestSuccessCallback(res, next, { success: true }),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }
}