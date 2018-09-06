import { LogFactory } from '../../../src/app/log';
import { LoggerInstance } from 'winston';

import { DataModel } from '../../../src/app/model';
import { CommonSpecsHelper } from '../CommonSpecsHelper';

function verifySingleModelEntityCreated<T extends DataModel>(
    specsHelper: CommonSpecsHelper<T>,
    done: DoneFn) {

    let logger: LoggerInstance = LogFactory.createLogger(verifySingleModelEntityCreated.name);

    logger.info("Veriy single entity can be created correclty correctly.");
    specsHelper.createSingleModelEntity().then(([originalModelEntity, returnedModelEntities]) => {
        let createdModelEntity = returnedModelEntities[0];

        specsHelper.verifyModelEntityCreatedCorrectly(originalModelEntity, createdModelEntity);
        specsHelper.verifyNodeExistsInDb(createdModelEntity, (error?: any) => {
            if (error) {
                logger.error(error);
                fail(error);
            }

            done();
        });

    }).catch((reason: string) => {
        logger.error(reason);
        fail(reason);

        done();
    });
};

export { verifySingleModelEntityCreated };