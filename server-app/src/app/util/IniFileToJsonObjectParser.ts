import * as fs from 'fs';
import * as readline from 'readline';

// TODO doc
// FIXME Take out into more genral folder so that it can be reused in tests.
export class IniFileToJsonObjectParser {

    public static convertIniToJson(initFilePath: string): any {
        var lineReader = readline.createInterface({
            input: fs.createReadStream(initFilePath),
            terminal: false
        });

        let jsonConfig = {};
        fs.readFileSync(initFilePath, { flag: 'r' })
            .toString()
            .split('\n')
            .forEach((line: string) => {
                let equalsSignSeprataorIndex = line.indexOf("=");
                if (equalsSignSeprataorIndex == -1) {
                    return;
                }

                let propertyName = line.substr(0, equalsSignSeprataorIndex).trim();
                let propertyValue = line.substr(equalsSignSeprataorIndex + 1).trim();

                let propertyNameParts = propertyName.split(".");

                let currentJsonConfigObject = jsonConfig;
                for (let i = 0; i < propertyNameParts.length; i++) {
                    let propertyNamePart = propertyNameParts[i];

                    if (i < propertyNameParts.length - 1) {
                        if (!currentJsonConfigObject[propertyNamePart]) {
                            currentJsonConfigObject[propertyNamePart] = {};
                        }

                        currentJsonConfigObject = currentJsonConfigObject[propertyNamePart];
                    } else {
                        currentJsonConfigObject[propertyNamePart] = propertyValue;
                    }
                }
            });

        return jsonConfig;
    }
}