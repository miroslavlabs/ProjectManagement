export class ClassUtils {

    public static getPropertiesForClass<T> (classCtr: new () => T): string[] {
        let objectOfClass = new classCtr();
        let objectProperties = Object.getOwnPropertyNames(objectOfClass);

        return objectProperties;
    }

    public static checkPropertyDefinedForClass<T> (classCtr: new () => T, propertyName: string): boolean {
        let objectProperties = ClassUtils.getPropertiesForClass(classCtr);

        let propertyIndex = objectProperties.indexOf(propertyName);
        return propertyIndex >= 0;
    }

    public static getClassName<T>(classCtr: new () => T): string {
        return (new classCtr()).constructor.name;
    }
}