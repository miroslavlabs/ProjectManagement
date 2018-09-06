export class HttpUtils {
    
    public static convertReponseBodyToObjectsOfType<T>(responseBody: any, objectTypeCtor: new () => T) : T[] {
        let items;
        if (typeof responseBody == "string") {
            items = JSON.parse(responseBody);
        } else {
            items = responseBody;
        }

        let convertedObjects: T[] = new Array<T>();

        let objectOfType = new objectTypeCtor();
        let typeProperties = Object.getOwnPropertyNames(new objectTypeCtor());

        for(let item of items) {
            let objectOfType =  new objectTypeCtor();

            typeProperties.forEach(propertyName => {
                objectOfType[propertyName] = item[propertyName];
            });

            convertedObjects.push(objectOfType);
        };

        return convertedObjects;
    }
}