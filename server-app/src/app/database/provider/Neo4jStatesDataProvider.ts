import { Neo4jDriver } from '../core/Neo4jDriver';
import { Neo4jDataReader } from "../data/Neo4jDataReader";
import { Neo4jRecordToObjectTypeConverter } from '../data/Neo4jRecordToObjectTypeConverter'
import { State } from '../../model';

const STATE_CYPHER_VARIABLE = "state";

export class Neo4jStatesDataProvider {
    private dataReader: Neo4jDataReader<State>;
    
    constructor(driver: Neo4jDriver) {
        this.dataReader =
            new Neo4jDataReader<State>(
                driver,
                new Neo4jRecordToObjectTypeConverter(State, STATE_CYPHER_VARIABLE));
    }

    public getAllStates() {

    }

    public getState(): void {

    }

    public createState(
        boardIdParam: number,
        state: State,
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void): void {
        
        // The first part of the query finds the board. Then, the new state is created.
        // After that, the last state in the states list is acquired. If there is such a
        // state, add a NEXT relationship from the last state to the new one.
        let createBoardQuery =
            `OPTIONAL MATCH (board:Board)
            WHERE ID(board)=$boardIdParam
            WITH board
            CREATE (board)-[:HAS_STATE]->(${STATE_CYPHER_VARIABLE}:State $stateProperties)
            WITH board, ${STATE_CYPHER_VARIABLE}
            OPTIONAL MATCH (board)-[:HAS_STATE*0]->(s:State)-[:NEXT*0]->(:State)
            WITH board, ${STATE_CYPHER_VARIABLE}, head(collect(s)) as last_state
            FOREACH (ls IN (CASE WHEN last_state IS NOT NULL THEN [last_state] ELSE [] END) | CREATE (ls)-[:NEXT]->${STATE_CYPHER_VARIABLE})
            RETURN ${STATE_CYPHER_VARIABLE}`

        delete state.id;
        let createBoardQueryProperties = {
            boardIdParam: boardIdParam,
            stateProperties: state
        }

        this.dataReader.write(
            createBoardQuery,
            createBoardQueryProperties,
            successCallback,
            errorCallback);
    }

    public updateState(): void {

    }
}