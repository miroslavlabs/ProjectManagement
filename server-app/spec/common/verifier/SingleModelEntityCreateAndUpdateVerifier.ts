import { LogFactory } from '../../../src/app/log';
import { LoggerInstance } from 'winston';

import { DataModel } from '../../../src/app/model';
import { CommonSpecsHelper } from '../CommonSpecsHelper';

function verifySingleModelEntityCreatedAndUpdated<T extends DataModel>(
    specsHelper: CommonSpecsHelper<T>,
    modelEntityUpdateData: T,
    done: DoneFn) {
    
    let logger: LoggerInstance = LogFactory.createLogger(verifySingleModelEntityCreatedAndUpdated.name);

    logger.info("Create single entity and verify it can be updated correctly.");
    specsHelper.createSingleModelEntity().then(([originalModelEntity, returnedModelEntities]) => {
        let createdModelEntity = returnedModelEntities[0];
        
        modelEntityUpdateData.id = createdModelEntity.id;
        modelEntityUpdateData.createdDateTimestamp = createdModelEntity.createdDateTimestamp;

        logger.info(`Updating the created model entity with data ${JSON.stringify(createdModelEntity)}.`);
        let updateModelEntityPromise: Promise<[T, T[]]> = 
                specsHelper.getServerAppHttpHelper().update(createdModelEntity.id, modelEntityUpdateData);

        updateModelEntityPromise.then(([modelEntityUpdateData, returnedModelEntities]) => {
            let requestedModelEntity: T = returnedModelEntities[0];

            expect(modelEntityUpdateData).toEqual(requestedModelEntity);
            specsHelper.verifyNodeExistsInDb(requestedModelEntity, (error?: any) => {
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

    }).catch((reason: string) => {
        specsHelper.logErrorAndFailStep(reason);

        done();
    });
};

export { verifySingleModelEntityCreatedAndUpdated };