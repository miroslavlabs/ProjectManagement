import { LogFactory } from '../../src/app/log';
import { LoggerInstance } from 'winston';
import { Project } from '../../src/app/model';

import { 
    CommonSpecsHelper,
    ProjectsCommonSpecsHelper,
    verifySingleModelEntityCreated,
    verifySingleModelEntityCreatedAndUpdated,
    verifySingleModelEntityCreatedAndSuccessfullyRetrieved,
    verifyMultipleModelEntitiesCreatedAndSuccessfullyRetrieved } from '../common';

import { ConfigurationUtil } from '../../src/app/util';

describe('ProjectItSpec', () => {
    let commonSpecsHelper: ProjectsCommonSpecsHelper;

    beforeEach((done: DoneFn) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = CommonSpecsHelper.DEFAULT_JASMINE_TIMEOUT_INTERVAL_MILLIS;

        commonSpecsHelper = new ProjectsCommonSpecsHelper();
        commonSpecsHelper.prepare();
        done();
    });

    let createSingleProjectTestName = 'Create a single project';
    it(createSingleProjectTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createSingleProjectTestName);

        verifySingleModelEntityCreated(commonSpecsHelper, done);
    });

    let createAndUpdateSingleProjectTestName = "Create Single Project and Update It";
    it(createAndUpdateSingleProjectTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createAndUpdateSingleProjectTestName);

        let updatedProjectData = new Project();
        updatedProjectData.title = 'New Title';
        updatedProjectData.fullDescription = 'New Description';

        verifySingleModelEntityCreatedAndUpdated(commonSpecsHelper, updatedProjectData, done);
    });

    let createAndRetrieveSingleProjectTestName = 'Create Single Project and Retrieve It';
    it(createAndRetrieveSingleProjectTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createAndRetrieveSingleProjectTestName);

        verifySingleModelEntityCreatedAndSuccessfullyRetrieved(commonSpecsHelper, done);
    });

    let createAndRetrieveMultipleProjectsTestName = "Create Multiple Projects and Retrieve All Of Them";
    it(createAndRetrieveMultipleProjectsTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createAndRetrieveMultipleProjectsTestName);

        verifyMultipleModelEntitiesCreatedAndSuccessfullyRetrieved(commonSpecsHelper, done);
    });

    afterEach((done: DoneFn) => {
        let neo4jPromise = commonSpecsHelper.clearDatabase();

        neo4jPromise.then((value: any) => {
            commonSpecsHelper.getLogger().info("Database cleaned.");
            done();

        }).catch((reason: string) => {
            commonSpecsHelper.logErrorAndFailStep(reason);
            done();
        });
    });
});