import { Project } from '../../src/app/model'
import { LogFactory } from '../../src/app/log'
import { LoggerInstance } from 'winston'
import * as request from 'request';

export class ProjectsHttpHelper {
    private projectsUri: string;
    private logger:LoggerInstance = LogFactory.createLogger("root");

    constructor(localServerAddress:string, projectPath:string, localServerPort:string) {
        this.projectsUri = `http://${localServerAddress}:${localServerPort}/${projectPath}`;
    }

    public create(project: Project, projectCallback: (project:Project) => void): void {
        request.post(this.projectsUri, null /*options*/, (error: any, response: request.Response, body: any) => {
            if (error) {
                this.logger.error(`A project could not be created. ${error}`);
                projectCallback(null);

            } else if (response.statusCode != 200) {
                this.logger.warn(`The response status code is ${response.statusCode} with body ${body}`);
                projectCallback(null);

            } else {
                this.logger.info("A project was successfully created.")
                projectCallback(body);
            }
        });
    }
}