import { Neo4jDriver } from "../core/Neo4jDriver";

/**
 * The interface defines CRUD (Create, Read, Update, Delete) operations on the Nodes in the database.
 */
export interface CRUDDataProvider<T> {

    /**
     * The method retrieves information on all of the entities associated with a parent Node.
     * 
     * @param successCallback This callback is invoked with the retrieved data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     * @param parentIdParam The ID of the parent Node to which the entities are related.
     */
    getAllEntities?(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        parentIdParam?: number): void;
    
    /**
     * Acquire data about entity, given the ID of the entity Node.
     * 
     * @param projectIdParam The ID of the entity Node.
     * @param successCallback This callback is invoked with the retrieved data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     */
    getEntity?(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        entityId: number): void;
    
    /**
     * Create an entity Node in the database for a specfic parent Node.
     * 
     * @param successCallback This callback is invoked with the retrieved data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     * @param entity The entity to be stored in the database.
     * @param parentIdParam The ID of the parent node for which the entity will be created.
     */
    createEntity?(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        entity: T,
        parentIdParam?: number): void;

    /**
     * Updates the entity Node in the database. The entityIdParam will be used for the node ID.
     * 
     * @param successCallback This callback is invoked with the updated data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     * @param entityIdParam The ID of the entity Node that will be updated.
     * @param entity The entity data with whcih to update the entity Node in the database.
     */
    updateEntity?(
        successCallback: (result: T[]) => void,
        errorCallback: (result: Error) => void,
        entityIdParam: number,
        entity: T): void;

     /**
     * Deletes the specified entity Node from the database. The relevant relationships are updated.
     * 
     * @param successCallback This callback is invoked with the retrieved data on successful query completion.
     * @param errorCallback This callback is invoked with an error should the data retrieval fail.
     * @param entityIdParam The ID of the entity Node to be deleted.
     */
    deleteEntity?(
        successCallback: () => void,
        errorCallback: (result: Error) => void,
        entityIdParam: number): void;
}