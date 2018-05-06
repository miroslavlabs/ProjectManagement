import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { Neo4jDriver, Neo4jConnector, Neo4jBoardsDataProvider } from '../database';

import { EntityRouterProvider } from './EntityRouterProvider';
import { Record } from 'neo4j-driver/types/v1';
import { Board } from '../model';
import { CallbackUtil } from "../util/CallbackUtil";

var config = require('../../resources/server-config');

export class BoardRouterProvider implements EntityRouterProvider {
    private neo4jBoardsDataProvider: Neo4jBoardsDataProvider;

    constructor(private neo4jDriver: Neo4jDriver) {
        this.neo4jBoardsDataProvider = new Neo4jBoardsDataProvider(neo4jDriver);
    }

    /**
     * Creates the routes for the Project REST ednpoints.
     */
    public getRouter(): Router {
        let router = Router();
        
        let boardEndpoint = config.routes.board;
        router.get(`${boardEndpoint}`, this.getAllBoards());
        router.post(`${boardEndpoint}`, this.createBoard());
        router.put(`${boardEndpoint}/:id`, this.updateBoard());
        router.get(`${boardEndpoint}/:id`, this.getBoard());

        return router;
    }

    private getAllBoards() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jBoardsDataProvider.getAllBoards(
                +req.query["projectId"],
                CallbackUtil.simpleRestSuccessCallback<Board[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private getBoard() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jBoardsDataProvider.getBoard(
                +req.params["id"],
                CallbackUtil.simpleRestSuccessCallback<Board[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private createBoard() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jBoardsDataProvider.createBoard(
                +req.query["projectId"],
                req.body /*board JSON data*/,
                CallbackUtil.simpleRestSuccessCallback<Board[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private updateBoard() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jBoardsDataProvider.updateBoard(
                +req.params["id"] /*board ID*/,
                req.body /*board data*/,
                CallbackUtil.simpleRestSuccessCallback<Board[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }
}