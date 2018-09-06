import { LogFactory } from '../../../src/app/log';
import { LoggerInstance } from 'winston';

import { DataModel } from '../../../src/app/model';
import { CommonSpecsHelper } from '../CommonSpecsHelper';

function verifyMultipleModelEntitiesCreatedAndSuccessfullyRetrieved<T extends DataModel>(
    specsHelper: CommonSpecsHelper<T>,
    done: DoneFn) {
    
    let logger: LoggerInstance = LogFactory.createLogger(verifyMultipleModelEntitiesCreatedAndSuccessfullyRetrieved.name);

    logger.info("Create multiple entities and verify they can be retrieved correctly.");
    specsHelper.createMultipleModelEntities().then((createdModelEntities: [T, T[]][]) => {
        expect(createdModelEntities.length).toEqual(CommonSpecsHelper.MODEL_ENTITIES_FOR_CREATION_COUNT);

        logger.info("Verify model entities were created correctly and in the same order.");
        for(let i = 0; i < createdModelEntities.length; i++) {
            let originalModelEntity = createdModelEntities[i][0];
            let createdModelEntity = createdModelEntities[i][1][0];
            specsHelper.verifyModelEntityCreatedCorrectly(originalModelEntity, createdModelEntity);
        }

        logger.info("Verify model entities data in Neo4j.");
        let verifyModelEntityInDbPromises: Promise<T[]>[] = new Array<Promise<T[]>>();

        for(let createdModelEntity of createdModelEntities) {
            let verifyProjectInDbPromise = specsHelper.verifyNodeExistsInDb(createdModelEntity[1][0]);

            verifyModelEntityInDbPromises.push(verifyProjectInDbPromise);
        }

        Promise.all(verifyModelEntityInDbPromises).then(() => {
            logger.info("Model entities data are correctly stored in Neo4j.");
            done();

        }).catch((reason) => {
            logger.error(reason);
            fail(reason);

            done();
        });

    }).catch((reason) => {
        specsHelper.logErrorAndFailStep(reason);

        done();
    });
};

export { verifyMultipleModelEntitiesCreatedAndSuccessfullyRetrieved };