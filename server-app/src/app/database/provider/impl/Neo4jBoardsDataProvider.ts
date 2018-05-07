import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReader } from "../../data/Neo4jDataReader";
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import { Board } from "../../../model"
import { CRUDDataProvider } from '../CRUDDataProvider';

const BOARD_CYPHER_VARIABLE = "board";

/**
 * This class retrives/modifies information on project boards from a Neo4j database.
 */
export class Neo4jBoardsDataProvider implements CRUDDataProvider<Board> {
    private dataReader: Neo4jDataReader<Board>;

    constructor(driver: Neo4jDriver) {
        this.dataReader =
            new Neo4jDataReader<Board>(
                driver,
                new Neo4jRecordToObjectTypeConverter(Board, BOARD_CYPHER_VARIABLE));
    }

    public getAllEntities(
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number): void {
        
        let getAllBoardsQuery =
            `MATCH (project:Project)-[:HAS_BOARD]->(${BOARD_CYPHER_VARIABLE}:Board)
            WHERE ID(project)=$projectId
            RETURN ${BOARD_CYPHER_VARIABLE}`;

        this.dataReader.read(
            getAllBoardsQuery,
            { projectId: projectIdParam },
            successCallback,
            errorCallback);
    }

    public getEntity(
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void,
        boardIdParam: number): void {
        
        let getBoardQuery =
            `MATCH (${BOARD_CYPHER_VARIABLE}:Board)
            WHERE ID(${BOARD_CYPHER_VARIABLE})=$boardId
            RETURN ${BOARD_CYPHER_VARIABLE}`;

        this.dataReader.read(
            getBoardQuery,
            { boardId: boardIdParam },
            successCallback,
            errorCallback);
    }

    public createEntity(
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void,
        board: Board,
        projectIdParam: number): void {
    
        let createBoardQuery =
            `OPTIONAL MATCH (project:Project)
            WHERE ID(project)=$projectId
            WITH project
            CREATE (project)-[:HAS_BOARD]->(${BOARD_CYPHER_VARIABLE}:Board $boardProperties)
            RETURN ${BOARD_CYPHER_VARIABLE}`;

        delete board.id;
        board.createdDateTimestamp = new Date().getTime();

        let createBoardQueryProperties = {
            projectId: projectIdParam,
            boardProperties: board
        };

        this.dataReader.write(
            createBoardQuery,
            createBoardQueryProperties,
            successCallback,
            errorCallback);
    }

    public updateEntity(
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void,
        boardIdParam: number,
        board: Board): void {
        
        let updateBoardQuery =
            `MATCH (${BOARD_CYPHER_VARIABLE}:Board)
            WHERE ID(${BOARD_CYPHER_VARIABLE})=$boardId
            WITH ${BOARD_CYPHER_VARIABLE}
            SET ${BOARD_CYPHER_VARIABLE}=$boardProperties
            RETURN ${BOARD_CYPHER_VARIABLE}`;

        delete board.id;
        let updateBoardQueryProperties = {
            boardId: boardIdParam,
            boardProperties: board
        };

        this.dataReader.write(
            updateBoardQuery,
            updateBoardQueryProperties,
            successCallback,
            errorCallback);
    }

    public deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        boardIdParam: number): void {
        
        throw new Error("Operation not supported.");
    }
}