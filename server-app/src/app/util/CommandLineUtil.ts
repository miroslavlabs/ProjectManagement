export class CommandLineUtil {
    public static parseCommandLineArgumentValues(commandLineArguments: string[]) {
        let argumentValues = {};
    
        for (let j = 2; j < process.argv.length; j++) {
            let argumentParts = commandLineArguments[j].split('=');
            let argumentName = argumentParts[0];
            let argumentValue = argumentParts[1];
    
            argumentValues[argumentName] = argumentValue;
            break;
        }
    
        return argumentValues;
    }
}