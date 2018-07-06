import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReaderAndWriter } from "../../data/Neo4jDataReaderAndWriter";
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import { CRUDDataProvider } from '../CRUDDataProvider';
import { ClassUtils } from '../../../util/ClassUtils';

const CONNECTED_NODE_CYPHER_VARIABLE = "connectedNode";

/**
 * This class retrives/modifies information on conneted nodes from a Neo4j database.
 */
export class Neo4jConnectedNodeDataProvider<T, P> implements CRUDDataProvider<T> {
    private dataReaderAndWriter: Neo4jDataReaderAndWriter<T>;
    private connectedNodeModelName: string;
    private parentNodeModelName: string;

    constructor(
            protected driver: Neo4jDriver,
            private connectedNodeModelCtr: new () => T,
            protected parentNodeModelCtr: new () => P,
            protected parentToConnectedNodeRelationshipName: string) {

        this.connectedNodeModelName = ClassUtils.getClassName(connectedNodeModelCtr);
        this.parentNodeModelName = ClassUtils.getClassName(parentNodeModelCtr);

        let recordToObjectTypeConverter =
            new Neo4jRecordToObjectTypeConverter(connectedNodeModelCtr, CONNECTED_NODE_CYPHER_VARIABLE);

        this.dataReaderAndWriter =
            new Neo4jDataReaderAndWriter<T>(driver, [recordToObjectTypeConverter]);
    }

    public getAllEntities(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        parentIdParam: number): void {

        let createConnectedNodeQuery =
            `OPTIONAL MATCH (parentNode:${this.parentNodeModelName})
            WHERE ID(parentNode)=$parentId
            WITH parentNode
            OPTIONAL MATCH
               (parentNode)-[:${this.parentToConnectedNodeRelationshipName}]->
               (${CONNECTED_NODE_CYPHER_VARIABLE}:${this.connectedNodeModelName})-[:NEXT*0]->
               (:${this.connectedNodeModelName})
            RETURN ${CONNECTED_NODE_CYPHER_VARIABLE}`;

        this.dataReaderAndWriter.read(
            this.successCallbackReverseResultInterceptor(successCallback),
            errorCallback,
            createConnectedNodeQuery,
            { parentId: parentIdParam });
    }

    public getEntity(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        connectedNodeIdParam: number): void {

        let getConnectedNodeQuery =
            `OPTIONAL MATCH (${CONNECTED_NODE_CYPHER_VARIABLE}:${this.connectedNodeModelName})
            WHERE ID(${CONNECTED_NODE_CYPHER_VARIABLE})=$connectedNodeId
            RETURN ${CONNECTED_NODE_CYPHER_VARIABLE}`;

        this.dataReaderAndWriter.read(
            successCallback,
            errorCallback,
            getConnectedNodeQuery,
            { connectedNodeId: connectedNodeIdParam });
    }

    public createEntity(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        connectedNode: T,
        parentIdParam: number): void {

        // The first part of the query finds the parent node. Then, the new conncted node is created.
        // After that, the last conncted node in the conncted nodes list is acquired. If there is such a
        // node, add a NEXT relationship from the last conncted node to the new one.
        let createConnectedQuery =
            `OPTIONAL MATCH (parentNode:${this.parentNodeModelName})
            WHERE ID(parentNode)=$parentId
            WITH parentNode
            OPTIONAL MATCH 
                (parentNode)-[:${this.parentToConnectedNodeRelationshipName}]->
                (lastConnectedNode:${this.connectedNodeModelName})
            WHERE NOT (lastConnectedNode)-[:NEXT]->()
            WITH parentNode,lastConnectedNode
            CREATE
                (parentNode)-[:${this.parentToConnectedNodeRelationshipName}]->
                (${CONNECTED_NODE_CYPHER_VARIABLE}:${this.connectedNodeModelName} $connectedNodeProperties)
            WITH parentNode, lastConnectedNode, ${CONNECTED_NODE_CYPHER_VARIABLE}
            FOREACH
                (ls IN (CASE WHEN lastConnectedNode IS NOT NULL THEN [lastConnectedNode] ELSE [] END) | 
                CREATE (ls)-[:NEXT]->(${CONNECTED_NODE_CYPHER_VARIABLE}))
            RETURN ${CONNECTED_NODE_CYPHER_VARIABLE}`;

        delete connectedNode["id"];
        if (ClassUtils.checkPropertyDefinedForClass(this.connectedNodeModelCtr, "createdDateTimestamp")) {
            connectedNode["createdDateTimestamp"] = new Date().getTime();
        }

        let createconnectedNodeProperties = {
            parentId: parentIdParam,
            connectedNodeProperties: connectedNode
        };

        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            createConnectedQuery,
            createconnectedNodeProperties);
    }

    public updateEntity(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        connectedNodeIdParam: number,
        connectedNode: T): void {

        let updateConnectedNodeQuery =
            `MATCH (${CONNECTED_NODE_CYPHER_VARIABLE}:${this.connectedNodeModelName})
            WHERE ID(${CONNECTED_NODE_CYPHER_VARIABLE})=$connectedNodeId
            WITH ${CONNECTED_NODE_CYPHER_VARIABLE}
            SET ${CONNECTED_NODE_CYPHER_VARIABLE}=$connectedNodeProperties
            RETURN ${CONNECTED_NODE_CYPHER_VARIABLE}`;

        delete connectedNode["id"];
        let updateConnectedNodeQueryProperties = {
            connectedNodeId: connectedNodeIdParam,
            connectedNodeProperties: connectedNode
        };

        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            updateConnectedNodeQuery,
            updateConnectedNodeQueryProperties);
    }

    public deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        connectedNodeIdParam: number): void {

        // Deletes the conncted Node and updates the relationships between the previous and next conncted nodes,
        // if such exist.
        let deleteStateQuery =
            `OPTIONAL MATCH (connectedNode:${this.connectedNodeModelName})
            WHERE ID(connectedNode)=$connectedNodeId
            WITH connectedNode
            OPTIONAL MATCH 
                (:${this.parentNodeModelName})-[parentToConnectedNodeRel:${this.parentToConnectedNodeRelationshipName}]->(connectedNode)
            OPTIONAL MATCH 
                (prevConnectedNode:${this.connectedNodeModelName})-[prevConnectedNodeRel:NEXT]->(connectedNode)
            OPTIONAL MATCH 
                (connectedNode)-[nextConnectedNodeRel:NEXT]->(nextConnectedNode:${this.connectedNodeModelName})
            DELETE prevConnectedNodeRel, nextConnectedNodeRel
            DELETE parentToConnectedNodeRel
            DELETE connectedNode
            WITH prevConnectedNode, nextConnectedNode 
                WHERE (prevConnectedNode iS NOT NULL) AND (nextConnectedNode iS NOT NULL)
            CREATE (prevConnectedNode)-[:NEXT]->(nextConnectedNode)`;

        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            deleteStateQuery,
            { connectedNodeId: connectedNodeIdParam });
    }

    private successCallbackReverseResultInterceptor(
        sucessCallback: (result: T[]) => void): (result: T[]) => void {

        // Reverse the order of the elements.
        return (result: T[]) => {
            sucessCallback(result.reverse());
        };
    }
}