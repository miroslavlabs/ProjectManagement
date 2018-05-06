import { Neo4jDriver } from '../core/Neo4jDriver';
import { Neo4jDataReader } from "../data/Neo4jDataReader";
import { Neo4jRecordToObjectTypeConverter } from '../data/Neo4jRecordToObjectTypeConverter'
import { State } from '../../model';

const STATE_CYPHER_VARIABLE = "state";

/**
 * This class retrives/modifies information on states from a Neo4j database.
 */
export class Neo4jStatesDataProvider {
    private dataReader: Neo4jDataReader<State>;

    constructor(driver: Neo4jDriver) {
        this.dataReader =
            new Neo4jDataReader<State>(
                driver,
                new Neo4jRecordToObjectTypeConverter(State, STATE_CYPHER_VARIABLE));
    }

    /**
     * The method retrieves information on all of the states for a specific board.
     * 
     * @param boardIdParam The ID of the board to which the states belong to.
     * @param successCallback This callback is invoked with the retrieved state data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getAllStates(
        boardIdParam: number,
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void): void {

        let createStateQuery =
            `OPTIONAL MATCH (board:Board)
            WHERE ID(board)=$boardId
            WITH board
            OPTIONAL MATCH (board)-[:HAS_STATE]->(${STATE_CYPHER_VARIABLE}:State)-[:NEXT*0]->(:State)
            RETURN ${STATE_CYPHER_VARIABLE}`;

        this.dataReader.read(
            createStateQuery,
            { boardId: boardIdParam },
            this.successCallbackReverseResultInterceptor(successCallback),
            errorCallback);
    }

    /**
     * The method retrieves information for a specific state.
     * 
     * @param stateIdParam The ID of the state.
     * @param successCallback This callback is invoked with the retrieved state data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public getState(
        stateIdParam: number,
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void): void {
        
        let getStateQuery =
            `OPTIONAL MATCH (${STATE_CYPHER_VARIABLE}:State)
            WHERE ID(${STATE_CYPHER_VARIABLE})=$stateId
            RETURN ${STATE_CYPHER_VARIABLE}`;

        this.dataReader.read(
            getStateQuery,
            { stateId: stateIdParam },
            successCallback,
            errorCallback);
    }

    /**
     * The method creates a state for a specific board.
     * 
     * @param boardIdParam The ID of the board to which the state will be created.
     * @param state The state object to be stored in the database.
     * @param successCallback This callback is invoked with the retrieved state data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public createState(
        boardIdParam: number,
        state: State,
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void): void {

        // The first part of the query finds the board. Then, the new state is created.
        // After that, the last state in the states list is acquired. If there is such a
        // state, add a NEXT relationship from the last state to the new one.
        let createStateQuery =
            `OPTIONAL MATCH (board:Board)
            WHERE ID(board)=$boardIdParam
            WITH board
            OPTIONAL MATCH (board)-[:HAS_STATE]->(s:State)-[:NEXT*0]->(:State)
            WITH board, head(collect(s)) as last_state
            CREATE (board)-[:HAS_STATE]->(${STATE_CYPHER_VARIABLE}:State $stateProperties)
            WITH board, last_state, ${STATE_CYPHER_VARIABLE}
            FOREACH (ls IN (CASE WHEN last_state IS NOT NULL THEN [last_state] ELSE [] END) | CREATE (ls)-[:NEXT]->(${STATE_CYPHER_VARIABLE}))
            RETURN ${STATE_CYPHER_VARIABLE}`;

        delete state.id;
        let createStateQueryProperties = {
            boardIdParam: boardIdParam,
            stateProperties: state
        };

        this.dataReader.write(
            createStateQuery,
            createStateQueryProperties,
            successCallback,
            errorCallback);
    }

    /**
     * Updates the state Node data in the database. The {@link State.id} property will not be used. Instead, the stateIdParam will be used for the node ID.
     * 
     * @param stateIdParam The ID of the state Node which will be updated.
     * @param state The state object to be stored in the database.
     * @param successCallback This callback is invoked with the retrieved state data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public updateState(
        stateIdParam: number,
        state: State,
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void): void {
        
        let updateStateQuery =
            `MATCH (${STATE_CYPHER_VARIABLE}:State)
            WHERE ID(${STATE_CYPHER_VARIABLE})=$stateId
            WITH ${STATE_CYPHER_VARIABLE}
            SET ${STATE_CYPHER_VARIABLE}=$stateProperties
            RETURN ${STATE_CYPHER_VARIABLE}`;

        delete state.id;
        let updateStateQueryProperties = {
            stateId: stateIdParam,
            stateProperties: state
        };

        this.dataReader.write(
            updateStateQuery,
            updateStateQueryProperties,
            successCallback,
            errorCallback);
    }

    /**
     * Deletes the specified state Node from the database. The relevant relationships are updated.
     * 
     * @param stateIdParam The ID of the state Node which will be deleted.
     * @param successCallback This callback is invoked with the retrieved state data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    public deleteState(
        stateIdParam: number,
        successCallback: () => void,
        errorCallback: (result: Error) => void): void {
        
        // Deletes the state Node and updated the relationships between the previous and next state nodes,
        // if such exist.
        let deleteStateQuery = 
            `OPTIONAL MATCH (state:State)
            WHERE ID(state)=$statedId
            WITH state
            OPTIONAL MATCH (:Board)-[board_rel:HAS_STATE]->(state)
            OPTIONAL MATCH (prev_state:State)-[prev_state_rel:NEXT]->(state)
            OPTIONAL MATCH (state)-[next_state_rel:NEXT]->(next_state:State)
            DELETE prev_state_rel, next_state_rel
            DELETE board_rel
            DELETE state
            WITH prev_state, next_state WHERE (prev_state iS NOT NULL) AND (next_state iS NOT NULL)
            CREATE (prev_state)-[:NEXT]->(next_state)`;
        
        this.dataReader.write(
            deleteStateQuery,
            { statedId: stateIdParam },
            successCallback,
            errorCallback);
    }

    private successCallbackReverseResultInterceptor(
        sucessCallback: (result: State[]) => void): (result: State[]) => void {

        // Reverse the order of the elements.
        return (result: State[]) => {
            sucessCallback(result.reverse());
        };
    }
}