import { Record, Node } from 'neo4j-driver/types/v1';

/**
 * Provides means of converting a {@link Record} to an object of a specified type.
 */
export class Neo4jRecordToObjectTypeConverter<T> {

    public constructor(
        private objectTypeCtor: new () => T,
        private nodeName: string) {
    }

    /**
     * The method converts a {@link Record} to an object of the specified type.
     * 
     * @param record The record to be coneverted.
     * @returns An object of the specified type, created from the {@link Record} data.
     */
    convertRecord(record: Record): T {
        let objectOfType = new this.objectTypeCtor();
        
        let typeProperties = Object.getOwnPropertyNames(objectOfType);
        typeProperties.forEach(propertyName => {
            let retrievedNode: Node = record.get(this.nodeName);
            
            if (propertyName == "id") {
                objectOfType[propertyName] = retrievedNode.identity.toNumber();
            } else {
                objectOfType[propertyName] = retrievedNode.properties[propertyName];
            }
        });

        return objectOfType;
    }
}