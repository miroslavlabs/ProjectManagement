import { Router } from "express";

export interface EntityRouterProvider {

    getRouter(): Router;
}