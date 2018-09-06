import { CommonSpecsHelper } from '../CommonSpecsHelper';
import { Project } from '../../../src/app/model';

export class ProjectsCommonSpecsHelper extends CommonSpecsHelper<Project> {

    constructor() {
        super(ProjectsCommonSpecsHelper.name, Project);
    }

    public createSingleModelEntity(): Promise<[Project, Project[]]> {
        let project = this.createStandardProjectObject();

        return this.getServerAppHttpHelper().create(project);
    }

    public createMultipleModelEntities(): Promise<[Project, Project[]][]> {
        this.getLogger().info("Creating multiple projects.");

        let createProjectPromises: Promise<[Project, Project[]]>[] = new Array<Promise<[Project, Project[]]>>();
        for (let i = 0; i < CommonSpecsHelper.MODEL_ENTITIES_FOR_CREATION_COUNT; i++) {
            let project = this.createStandardProjectObject(i);

            let projectPromise = this.getServerAppHttpHelper().create(project);
            
            createProjectPromises.push(projectPromise);
        }

        return Promise.all(createProjectPromises);
    }

    public verifyModelEntityCreatedCorrectly(modelEnetity: Project, createdModelEnetity: Project) {
        expect(createdModelEnetity.id).toBeDefined();
        expect(createdModelEnetity.createdDateTimestamp).toBeDefined();

        expect(createdModelEnetity.title).toEqual(
            modelEnetity.title,
            `The created project title ${createdModelEnetity.title} differs from the actual project title ${modelEnetity.title}`);

        expect(createdModelEnetity.fullDescription).toEqual(
            modelEnetity.fullDescription,
            `The created project description ${createdModelEnetity.fullDescription} differs from the actual project description ${modelEnetity.fullDescription}`);
    };

    protected getEndpointPath(config: any) {
        return config.app.route.project;
    }

    private createStandardProjectObject(projectNumber?: number) {
        if (projectNumber == null || projectNumber == undefined) {
            projectNumber = 0;
        }

        let project = new Project();
        project.title = `Title for Poject ${projectNumber}.`;
        project.fullDescription = `Description for Poject ${projectNumber}.`;

        this.getLogger().info(`Created test project ${JSON.stringify(project)}.`);

        return project;
    }
}