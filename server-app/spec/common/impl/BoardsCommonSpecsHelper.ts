import { Board } from '../../../src/app/model';
import { CommonSpecsHelper } from '../CommonSpecsHelper';
import { ProjectsCommonSpecsHelper } from './ProjectsCommonSpecsHelper'; 

export class BoardsCommonSpecsHelper extends CommonSpecsHelper<Board> {

    constructor() {
        super(BoardsCommonSpecsHelper.name, Board);
    }

    public createSingleModelEntity(): Promise<[Board, Board[]]> {
        return new Promise<[Board, Board[]]>((resolve, reject) => {
            let projectCommonSpecsHelper = new ProjectsCommonSpecsHelper();
            projectCommonSpecsHelper.prepare();
            projectCommonSpecsHelper.createSingleModelEntity().then(([originalProject, returnedProjects]) => {
                let parentProject = returnedProjects[0];
  
                this.getServerAppHttpHelper().create(
                    this.createStandardBoardObject(),
                    "projectId",
                    parentProject.id).then(([originalBoard, returnedBoards]) => {
                        resolve([originalBoard, returnedBoards]);
                    }).catch((reason) => {
                        reject(reason);
                    });

            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    public createMultipleModelEntities(): Promise<[Board, Board[]][]> {
        return new Promise<[Board, Board[]][]>((resolve, reject) => {
            let projectCommonSpecsHelper = new ProjectsCommonSpecsHelper();
            projectCommonSpecsHelper.prepare();
            projectCommonSpecsHelper.createSingleModelEntity().then(([originalProject, returnedProjects]) => {
                let parentProject = returnedProjects[0];
  
                let boardsCreatePromises: Promise<[Board, Board[]]>[] = new Array<Promise<[Board, Board[]]>>();
                for (let i = 0; i < CommonSpecsHelper.MODEL_ENTITIES_FOR_CREATION_COUNT; i++) {
                    let boardCreatePromise = this.getServerAppHttpHelper().create(
                        this.createStandardBoardObject(i),
                        "projectId",
                        parentProject.id)
                    
                    boardsCreatePromises.push(boardCreatePromise);
                }

                this.getLogger().debug("Sent multiple boards' data to the backend.");
        
                Promise.all(boardsCreatePromises).then(value => resolve(value)).catch(reason => reject(reason));

            }).catch((reason) => {
                reject(reason);
            });
        });
    }

    public verifyModelEntityCreatedCorrectly(modelEntity: Board, createdModelEntity: Board) {
        expect(createdModelEntity.id).toBeDefined();
        expect(createdModelEntity.createdDateTimestamp).toBeDefined();

        expect(createdModelEntity.name).toEqual(
            modelEntity.name,
            `The created board name ${createdModelEntity.name} differs from the actual board ${modelEntity.name}`);
    };

    protected getEndpointPath(config: any) {
        return config.app.route.board;
    }

    private createStandardBoardObject(boardNumber?: number) {
        if (boardNumber == null || boardNumber == undefined) {
            boardNumber = 0;
        }

        let board = new Board();
        board.name = `Title for Board ${boardNumber}.`;
        this.getLogger().info(`Creating test board ${JSON.stringify(board)}.`);

        return board;
    }
}