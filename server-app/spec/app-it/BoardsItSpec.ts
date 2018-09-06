import { LogFactory } from '../../src/app/log';
import { LoggerInstance } from 'winston';
import { Board } from '../../src/app/model';

import { 
    CommonSpecsHelper,
    BoardsCommonSpecsHelper,
    verifySingleModelEntityCreated,
    verifySingleModelEntityCreatedAndUpdated,
    verifySingleModelEntityCreatedAndSuccessfullyRetrieved,
    verifyMultipleModelEntitiesCreatedAndSuccessfullyRetrieved } from '../common';

import { ConfigurationUtil } from '../../src/app/util';

describe('BoardsItSpec', () => {
    let commonSpecsHelper: BoardsCommonSpecsHelper;

    beforeEach((done: DoneFn) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = CommonSpecsHelper.DEFAULT_JASMINE_TIMEOUT_INTERVAL_MILLIS;

        commonSpecsHelper = new BoardsCommonSpecsHelper();
        commonSpecsHelper.prepare();
        done();
    });

    let createSingleBoardTestName = 'Create a single board';
    it(createSingleBoardTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createSingleBoardTestName);

        verifySingleModelEntityCreated(commonSpecsHelper, done);
    });

    let createAndUpdateSingleBoardTestName = "Create Single Board and Update It";
    it(createAndUpdateSingleBoardTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createAndUpdateSingleBoardTestName);

        let updatedBoardData = new Board();
        updatedBoardData.name = 'New Board';

        verifySingleModelEntityCreatedAndUpdated(commonSpecsHelper, updatedBoardData, done);
    });

    let createAndRetrieveSingleBoardTestName = 'Create Single Board and Retrieve It';
    it(createAndRetrieveSingleBoardTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createAndRetrieveSingleBoardTestName);

        verifySingleModelEntityCreatedAndSuccessfullyRetrieved(commonSpecsHelper, done);
    });

    let createAndRetrieveMultipleBoardsTestName = "Create Multiple Boards and Retrieve All Of Them";
    it(createAndRetrieveMultipleBoardsTestName, (done: DoneFn) => {
        commonSpecsHelper.logExecutionStep(createAndRetrieveMultipleBoardsTestName);

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