import { State } from '../../../src/app/model';
import { CommonSpecsHelper } from '../CommonSpecsHelper';
import { BoardsCommonSpecsHelper } from './BoardsCommonSpecsHelper'; 

export class StatesCommonSpecsHelper extends CommonSpecsHelper<State> {

    constructor() {
        super(StatesCommonSpecsHelper.name, State);
    }

    public createSingleModelEntity(): Promise<[State, State[]]> {
        return new Promise<[State, State[]]>((resolve, reject) => {
            let boardsCommonSpecsHelper = new BoardsCommonSpecsHelper();
            boardsCommonSpecsHelper.prepare();
            boardsCommonSpecsHelper.createSingleModelEntity().then(([originalBoard, returnedBoards]) => {
                let parentBoard = returnedBoards[0];
  
                this.getServerAppHttpHelper().create(
                    this.createStandardStateObject(),
                    "boardId",
                    parentBoard.id).then(([originalBoard, returnedBoards]) => {
                        resolve([originalBoard, returnedBoards]);
                    }).catch((reason) => {
                        reject(reason);
                    });

            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    public createMultipleModelEntities(): Promise<[State, State[]][]> {
        return new Promise<[State, State[]][]>((resolve, reject) => {
            let boardsCommonSpecsHelper = new BoardsCommonSpecsHelper();
            boardsCommonSpecsHelper.prepare();
            boardsCommonSpecsHelper.createSingleModelEntity().then(([originalBoard, returnedBoards]) => {
                let parentBoard = returnedBoards[0];
  
                let statesCreatePromises: Promise<[State, State[]]>[] = new Array<Promise<[State, State[]]>>();
                for (let i = 0; i < CommonSpecsHelper.MODEL_ENTITIES_FOR_CREATION_COUNT; i++) {
                    let stateCreatePromise = this.getServerAppHttpHelper().create(
                        this.createStandardStateObject(i),
                        "boardId",
                        parentBoard.id)
                    
                    statesCreatePromises.push(stateCreatePromise);
                }

                this.getLogger().debug("Sent multiple states' data to the backend.");
        
                Promise.all(statesCreatePromises).then(value => resolve(value)).catch(reason => reject(reason));

            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    public verifyModelEntityCreatedCorrectly(modelEntity: State, createdModelEntity: State) {
        expect(createdModelEntity.id).toBeDefined();
        expect(createdModelEntity.createdDateTimestamp).toBeDefined();

        expect(createdModelEntity.name).toEqual(
            modelEntity.name,
            `The created state name ${createdModelEntity.name} differs from the actual name ${modelEntity.name}`);
    };

    protected getEndpointPath(config: any) {
        return config.app.route.board;
    }

    private createStandardStateObject(boardNumber?: number) {
        if (boardNumber == null || boardNumber == undefined) {
            boardNumber = 0;
        }

        let state = new State();
        state.name = `State ${boardNumber}.`;
        this.getLogger().info(`Creating test state ${JSON.stringify(state)}.`);

        return state;
    }
}