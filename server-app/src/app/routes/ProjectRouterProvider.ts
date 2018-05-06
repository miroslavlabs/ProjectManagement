import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { Neo4jDriver, Neo4jConnector, Neo4jProjectsDataProvider } from '../database/';

import { EntityRouterProvider } from './EntityRouterProvider';
import { Record } from 'neo4j-driver/types/v1';
import { Project } from '../model';
import { CallbackUtil } from "../util/CallbackUtil";

var config = require('../../resources/server-config');

/**
 * This class provides methods which define the different REST endpoint functions for 
 * performing CRUD opertations on the projects' data.
 */
export class ProjectRouterProvider implements EntityRouterProvider {
    private neo4jProjectsDataProvider: Neo4jProjectsDataProvider;

    constructor(private neo4jDriver: Neo4jDriver) {
        this.neo4jProjectsDataProvider = new Neo4jProjectsDataProvider(neo4jDriver);
    }

    /**
     * Creates the routes for the Project REST ednpoints.
     */
    public getRouter(): Router {
        let router = Router();

        let projectEndpoint = config.routes.project;
        router.get(`${projectEndpoint}/`, this.getAllProjects());
        router.post(`${projectEndpoint}/`, this.createProject());
        router.put(`${projectEndpoint}/:id`, this.updateProject());
        router.get(`${projectEndpoint}/:id`, this.getProject());

        return router;
    }

    private getAllProjects() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.getAllProjects(
                CallbackUtil.simpleRestSuccessCallback<Project[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private getProject() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.getProject(
                +req.params["id"],
                CallbackUtil.simpleRestSuccessCallback<Project[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private createProject() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.createProject(
                req.body,
                CallbackUtil.simpleRestSuccessCallback<Project[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }

    private updateProject() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.updateProject(
                +req.params["id"],
                req.body,
                CallbackUtil.simpleRestSuccessCallback<Project[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next));
        }
    }
}