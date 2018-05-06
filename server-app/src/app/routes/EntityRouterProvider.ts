import { Router } from "express";

/**
 * The base interface for all calles which provide a route to a an entity (e.g. project, board, story, etc).
 */
export interface EntityRouterProvider {

    /**
     * Returns a {@link Router} which contains all the HTTP routes for perfroming an opration on an entity.
     */
    getRouter(): Router;
}