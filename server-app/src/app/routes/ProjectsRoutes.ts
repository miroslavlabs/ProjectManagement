import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { Neo4jDriver, Neo4jConnector, Neo4jProjectsDataProvider } from '../database/';
import { Record } from 'neo4j-driver/types/v1';
import { Project } from "pm-shared-components";

/**
 * This class provides methods which define the different REST endpoint functions for 
 * performing CRUD opertations on the projects' data.
 */
class ProjectsRoutes {
    private neo4jProjectsDataProvider: Neo4jProjectsDataProvider;

    constructor(private neo4jDriver: Neo4jDriver) {
        this.neo4jProjectsDataProvider = new Neo4jProjectsDataProvider(neo4jDriver);
    }

    /**
     * Creates the routes for the Project REST ednpoints.
     */
    public createProjectRoutes(): Router {
        let router = Router();

        router.get('/', this.getAllProjects());
        router.post('/', this.createProject());
        router.put('/', this.updateProject());
        
        router.get('/:id', this.getProject());

        return router;
    }

    private getAllProjects(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.getAllProjects(
                (projects: Project[]) => {
                    res.send(projects);
                    next();
                },
                (error: Error) => {
                    res.send(error);
                    next();
                });
        }
    }

    private getProject(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.getProject(
                +req.params["id"],
                (projects: Project[]) => {
                    res.send(projects[0]);
                    next();
                },
                (error: Error) => {
                    res.send(error);
                    next();
                });
        }
    }

    private createProject(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.createProject(
                req.body,
                (projects: Project[]) => {
                    res.send(projects[0]);
                    next();
                },
                (error: Error) => {
                    res.send(error);
                    next();
                });
        }
    }

    private updateProject(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.neo4jProjectsDataProvider.updateProject(
                req.body,
                (projects: Project[]) => {
                    res.send(projects[0]);
                    next();
                },
                (error: Error) => {
                    res.send(error);
                    next();
                });
        }
    }
}

export { ProjectsRoutes };