import { Record } from 'neo4j-driver/types/v1';

/**
 * A superinterface for all classes, which provide means of converting a {@link Record} to an object of a specified type.
 */
export interface Neo4jRecordToObjectTypeConverter<T> {

    /**
     * The method converts a {@link Record} to an object of the specified type.
     * @param record The record to be coneverted.
     * @returns An object of the specified type, created from the {@link Record} data.
     */
    convertRecord(record: Record): T;
}