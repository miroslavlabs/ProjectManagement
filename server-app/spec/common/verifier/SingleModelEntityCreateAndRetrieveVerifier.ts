import { LogFactory } from '../../../src/app/log';
import { LoggerInstance } from 'winston';

import { DataModel } from '../../../src/app/model';
import { CommonSpecsHelper } from '../CommonSpecsHelper';

function verifySingleModelEntityCreatedAndSuccessfullyRetrieved<T extends DataModel>(
    specsHelper: CommonSpecsHelper<T>,
    done: DoneFn) {

    let logger: LoggerInstance = LogFactory.createLogger(verifySingleModelEntityCreatedAndSuccessfullyRetrieved.name);

    logger.info("Create entity and verify it can be retrieved correctly.");
    specsHelper.createSingleModelEntity().then(([originalModelEntity, returnedModelEntities]) => {
        let createdModelEntity = returnedModelEntities[0];
        
        logger.info(`Created item ${JSON.stringify(createdModelEntity)}.`);

        let retrieveModelEntityPromise: Promise<T[]> = 
            specsHelper.getServerAppHttpHelper().get(createdModelEntity.id);

        retrieveModelEntityPromise.then((retrievedModelEntities: T[]) => {
            let retrievedModelEntity = retrievedModelEntities[0];
            logger.info(`Retrieved item ${JSON.stringify(retrievedModelEntity)}.`);

            expect(retrievedModelEntity).toEqual(createdModelEntity);
            done();

        }).catch((reason: string) => {
            logger.error(reason);
            fail(reason);

            done();
        });

    }).catch((reason: string) => {
        logger.error(reason);
        fail(reason);

        done();
    });
};

export { verifySingleModelEntityCreatedAndSuccessfullyRetrieved };