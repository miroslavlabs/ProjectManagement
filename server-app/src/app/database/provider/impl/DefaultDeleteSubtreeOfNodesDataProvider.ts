import { Neo4jDriver } from '../../core/Neo4jDriver';
import { Neo4jDataReaderAndWriter } from "../../data/Neo4jDataReaderAndWriter";
import { Neo4jRecordToObjectTypeConverter } from '../../data/Neo4jRecordToObjectTypeConverter'
import { CRUDDataProvider } from '../CRUDDataProvider';
import { ClassUtils } from '../../../util/';
import { DataModel } from '../../../model';

export class DefaultDeleteSubtreeOfNodesDataProvider<T extends DataModel, P> implements CRUDDataProvider<T> {
    private dataReaderAndWriter: Neo4jDataReaderAndWriter<T>;
    
    constructor(
        driver: Neo4jDriver,
        private startNodeModelCtr: new() => T,
        private parentNodeModelCtr?: new () => P,
        private parentToStartNodeRelationshipName?: string) {

        this.dataReaderAndWriter = new Neo4jDataReaderAndWriter<T>(driver);
    }
        
    deleteEntity(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        startNodeIdParam: number): void {

        let deleteNodeAndAllChildNodesQuery =
            `MATCH (startNode)
            WHERE ID(startNode)=$startNodeId
            WITH startNode
            OPTIONAL MATCH (parentNode)-[parentToStartNodeRel:${this.parentToStartNodeRelationshipName}]->(startNode)
            CALL apoc.path.subgraphAll(startNode, {labelFilter: "${this.createApocSubgraphAllLabelFilter()}"}) YIELD nodes, relationships
            OPTIONAL MATCH (startNode)-[nextNodeRel:NEXT]->(nextNode)
            OPTIONAL MATCH (startNode)<-[prevNodeRel:NEXT]-(prevNode)
            DELETE nextNodeRel, prevNodeRel, parentToStartNodeRel
            FOREACH (rel IN relationships | DELETE rel)
            FOREACH (node IN nodes | DELETE node)
            WITH prevNode, nextNode 
                WHERE (prevNode iS NOT NULL) AND (nextNode iS NOT NULL)
            CREATE (prevNode)-[:NEXT]->(nextNode)`;

        this.dataReaderAndWriter.write(
            successCallback,
            errorCallback,
            deleteNodeAndAllChildNodesQuery,
            { startNodeId: startNodeIdParam });
    }

    private createApocSubgraphAllLabelFilter(): string {
        let labelFilterValue = `-${ClassUtils.getClassName(this.startNodeModelCtr)}`;

        if (this.parentNodeModelCtr) {
            labelFilterValue += `|-${ClassUtils.getClassName(this.parentNodeModelCtr)}`;
        }

        return labelFilterValue;
    }
}