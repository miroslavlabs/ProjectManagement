import { CommandLineUtil } from './CommandLineUtil';
import { IniFileToJsonObjectParser } from './IniFileToJsonObjectParser';

export class ConfigurationUtil {
    private static CONFIG_PATH_ARG_NAME = "configPath";

    public static readConfigurationData(processArgs: string[]): any {
        let commandLineArgumentValues = CommandLineUtil.parseCommandLineArgumentValues(processArgs);

        let configurationFileLoation = commandLineArgumentValues[ConfigurationUtil.CONFIG_PATH_ARG_NAME];
        if (!configurationFileLoation) {
            throw new Error("Missing configuration path.");
        }
    
        let config = IniFileToJsonObjectParser.convertIniToJson(configurationFileLoation);
    
        return config;
    }
}