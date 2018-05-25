import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReader } from "../../data/Neo4jDataReader";
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import { State } from '../../../model';
import { CRUDDataProvider } from '../CRUDDataProvider';

const STATE_CYPHER_VARIABLE = "state";

/**
 * This class retrives/modifies information on states from a Neo4j database.
 */
export class Neo4jStatesDataProvider implements CRUDDataProvider<State> {
    private dataReader: Neo4jDataReader<State>;

    constructor(driver: Neo4jDriver) {
        this.dataReader =
            new Neo4jDataReader<State>(
                driver,
                new Neo4jRecordToObjectTypeConverter(State, STATE_CYPHER_VARIABLE));
    }

    public getAllEntities(
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void,
        boardIdParam: number): void {

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

    public getEntity(
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void,
        stateIdParam: number): void {
        
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

    public createEntity(
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void,
        state: State,
        boardIdParam: number): void {

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

    public updateEntity(
        successCallback: (result: State[]) => void,
        errorCallback: (result: Error) => void,
        stateIdParam: number,
        state: State): void {
        
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

    public deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        stateIdParam: number): void {
        
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