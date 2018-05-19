import { Session, Transaction, Record, Node } from 'neo4j-driver/types/v1';
import { Neo4jDriver } from '../core/Neo4jDriver';
import { Neo4jDataReader } from "../data/Neo4jDataReader";
import { Neo4jRecordToObjectTypeConverter } from '../data/Neo4jRecordToObjectTypeConverter'
import { Board } from "../../model"

const BOARD_CYPHER_VARIABLE = "board";

/**
 * This class retrives/modifies information on project boards from a Neo4j database.
 */
export class Neo4jBoardsDataProvider {
    private dataReader: Neo4jDataReader<Board>;

    constructor(driver: Neo4jDriver) {
        this.dataReader =
            new Neo4jDataReader<Board>(
                driver,
                new Neo4jRecordToObjectTypeConverter(Board, BOARD_CYPHER_VARIABLE));
    }

    /**
     * The method retrieves information on all of the projects' boards.
     * 
     * @param projectIdParam The ID of the project to which the board belongs to.
     * @param successCallback This callback is invoked with the retrieved boards data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getAllBoards(
        projectIdParam: number,
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void): void {
        
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

    /**
     * Acquire data about a board, given the ID of the board data Node.
     * 
     * @param projectIdParam The ID of the Node which contains the requested board data.
     * @param successCallback This callback is invoked with the retrieved board data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getBoard(
        boardIdParam: number,
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void): void {
        
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

     /**
     * Create a board Node in the database for a specfic project.
     * 
     * @param projectIdParam The ID of the project for which the board will be created.
     * @param board The board object to be stored in the database.
     * @param successCallback This callback is invoked with the retrieved project data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public createBoard(
        projectIdParam: number,
        board: Board,
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void): void {
    
        let createBoardQuery =
            `OPTIONAL MATCH (project:Project)
            WHERE ID(project)=$projectId
            WITH project
            CREATE (${BOARD_CYPHER_VARIABLE}:Board $boardProperties),
            (project)-[:HAS_BOARD]->(${BOARD_CYPHER_VARIABLE})
            RETURN ${BOARD_CYPHER_VARIABLE}`

        delete board.id;
        board.createdDateTimestamp = new Date().getTime();

        let createBoardQueryProperties = {
            projectId: projectIdParam,
            boardProperties: board
        }

        this.dataReader.write(
            createBoardQuery,
            createBoardQueryProperties,
            successCallback,
            errorCallback);
    }

    /**
     * Updates the board Node data in the database. The {@link Board.id} property will not be used. Instead, the boardIdParam will be used for the node ID.
     * 
     * @param boardIdParam The ID of the board Node that will be updated.
     * @param board The board data to be stored.
     * @param successCallback This callback is invoked with the updated board data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public updateBoard(
        boardIdParam: number,
        board: Board,
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void): void {
        
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
}