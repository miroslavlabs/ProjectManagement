import { ProjectsHttpHelper } from '../helpers/ProjectsHttpHelper';

describe("Single Project IT", () => {
    var serverConfig = require('./resources/server-config');
    
    let localServerUri = 'localhost';
    let projectPath = serverConfig.routes.project;
    let localServerPort = serverConfig.server.conf.port;

    it("Create a single project", () => {
        expect(true).toBe(true);
    });

    afterAll(() => {

    });
});