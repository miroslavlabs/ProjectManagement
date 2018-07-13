import { EntityRouterProvider } from "../EntityRouterProvider";
import { CRUDDataProvider } from "../../database/provider";
import { Router, Request, Response, NextFunction } from "express";
import { CallbackUtil } from "../../util/CallbackUtil";

/**
 * This class serves as a generalized router provider for CRUD endpoints on a Neo4j database.
 * The different endpoints will handle the same types of operations. This necessitates the
 * creation of this class.
 */
export class CRUDEntityRouterProvider<T> implements EntityRouterProvider {

    constructor(
        private crudDataProvider: CRUDDataProvider<T>,
        private entityRoute: string,
        private parentQueryIdParamName?: string) {
    }

    /**
     * Creates the routes for the Project REST ednpoints.
     */
    public getRouter(): Router {
        let router = Router();
        
        router.get(`${this.entityRoute}`, this.getAllEntitiesRequestHandler());
        router.post(`${this.entityRoute}`, this.createEntityRequestHandler());

        router.get(`${this.entityRoute}/:id`, this.getEntityRequestHandler());
        router.put(`${this.entityRoute}/:id`, this.updateEntityRequestHandler());
        router.delete(`${this.entityRoute}/:id`, this.deleteEntityRequestHandler());

        return router;
    }

    private getAllEntitiesRequestHandler() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.crudDataProvider.getAllEntities(
                CallbackUtil.simpleRestSuccessCallback<T[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next),
                this.getParentIdFromRequest(req));
        }
    }

    private getEntityRequestHandler() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.crudDataProvider.getEntity(
                CallbackUtil.simpleRestSuccessCallback<T[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next),
                this.getEntityIdFromRequest(req));
        }
    }

    private createEntityRequestHandler() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.crudDataProvider.createEntity(
                CallbackUtil.simpleRestSuccessCallback<T[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next),
                req.body /*entity JSON data*/,
                this.getParentIdFromRequest(req));
        }
    }

    private updateEntityRequestHandler() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.crudDataProvider.updateEntity(
                CallbackUtil.simpleRestSuccessCallback<T[]>(res, next),
                CallbackUtil.simpleRestErrorCallback(res, next),
                this.getEntityIdFromRequest(req),
                req.body /*entity data*/);
        }
    }

    private deleteEntityRequestHandler() {
        return (req: Request, res: Response, next: NextFunction) => {
            this.crudDataProvider.deleteEntity(
                CallbackUtil.simpleRestSuccessCallback(res, next, { success: true }),
                CallbackUtil.simpleRestErrorCallback(res, next),
                this.getEntityIdFromRequest(req));
        }
    }

    private getParentIdFromRequest(req: Request): number {
        if (this.parentQueryIdParamName == undefined) {
            return undefined;
        }

        let parentId: number = undefined;
        if (this.parentQueryIdParamName != null && this.parentQueryIdParamName != undefined) {
            parentId = +req.query[this.parentQueryIdParamName];
        }

        if (!parentId) {
            throw new Error(`Missing query parameter '${this.parentQueryIdParamName}'`);
        }

        return parentId;
    }

    private getEntityIdFromRequest(req: Request): number {
        return +req.params["id"];
    }
}