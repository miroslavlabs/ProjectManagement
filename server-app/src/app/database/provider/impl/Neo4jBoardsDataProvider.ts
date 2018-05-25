import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReaderAndWriter } from "../../data/Neo4jDataReaderAndWriter";
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import { Board, Project } from "../../../model"
import { CRUDDataProvider } from '../CRUDDataProvider';
import { DefaultDeleteSubtreeOfNodesDataProvider } from './DefaultDeleteSubtreeOfNodesDataProvider';

const BOARD_CYPHER_VARIABLE = "board";

/**
 * This class retrives/modifies information on project boards from a Neo4j database.
 */
export class Neo4jBoardsDataProvider implements CRUDDataProvider<Board> {
    private dataReaderAndWriter: Neo4jDataReaderAndWriter<Board>;

    constructor(private driver: Neo4jDriver) {
        this.dataReaderAndWriter =
            new Neo4jDataReaderAndWriter<Board>(
                driver,
                [new Neo4jRecordToObjectTypeConverter(Board, BOARD_CYPHER_VARIABLE)]);
    }

    public getAllEntities(
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void,
        projectIdParam: number): void {
        
        let getAllBoardsQuery =
            `MATCH (project:Project)-[:HAS_BOARD]->(${BOARD_CYPHER_VARIABLE}:Board)
            WHERE ID(project)=$projectId
            RETURN ${BOARD_CYPHER_VARIABLE}`;

        this.dataReaderAndWriter.read(
            successCallback,
            errorCallback,
            getAllBoardsQuery,
            { projectId: projectIdParam });
    }

    public getEntity(
        successCallback: (result: Board[]) => void,
        errorCallback: (result: Error) => void,
        boardIdParam: number): void {
        
        let getBoardQuery =
            `MATCH (${BOARD_CYPHER_VARIABLE}:Board)
            WHERE ID(${BOARD_CYPHER_VARIABLE})=$boardId
            RETURN ${BOARD_CYPHER_VARIABLE}`;

        this.dataReaderAndWriter.read(
            successCallback,
            errorCallback,
            getBoardQuery,
            { boardId: boardIdParam });
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

        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            createBoardQuery,
            createBoardQueryProperties);
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

        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            updateBoardQuery,
            updateBoardQueryProperties);
    }

    public deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        boardIdParam: number): void {
        
        new DefaultDeleteSubtreeOfNodesDataProvider(this.driver, Board, Project, "HAS_BOARD")
            .deleteEntity(
                successCallback,
                errorCallback,
                boardIdParam);
    }
}