import { Record, Node } from 'neo4j-driver/types/v1';
import { DataModel } from '../../model';

/**
 * Provides means of converting a {@link Record} to an object of a specified type.
 */
export class Neo4jRecordToObjectTypeConverter<T extends DataModel> {

    public constructor(
        private objectTypeCtor: new () => T,
        private queryVariableName: string) {
    }

    /**
     * The method converts a {@link Record} to an object of the specified type.
     * 
     * @param record The record to be coneverted.
     * @returns An object of the specified type, created from the {@link Record} data.
     */
    convertRecord(record: Record): T {
        let retrievedNode: Node = record.get(this.queryVariableName);

        if (retrievedNode == null) {
            return null;
        }

        let objectOfType = new this.objectTypeCtor();
        let typeProperties = Object.getOwnPropertyNames(objectOfType);
        typeProperties.forEach(propertyName => {            
            if (propertyName == "id") {
                objectOfType[propertyName] = retrievedNode.identity.toNumber();
            } else {
                objectOfType[propertyName] = retrievedNode.properties[propertyName];
            }
        });

        return objectOfType;
    }
}