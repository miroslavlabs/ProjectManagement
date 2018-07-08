import * as Winston from 'winston';

import { ClassUtils } from "../util";

const WinstonConfig = require('../../../resources/winston-config');
const winstonNpmLevels = Winston.config.npm.levels;

export class LogFactory {

    static initialize() {
        LogFactory.addSentinelMethods();
    }

    public static createLogger(loggerName: string): Winston.LoggerInstance {
        let logger = new Winston.Logger({
            level: WinstonConfig.defaultLevel,
            transports: [
                new (Winston.transports.Console)({
                    label: loggerName,
                    colorize: 'all',
                    timestamp: true
                }),
                new (Winston.transports.File)({ 
                    filename: WinstonConfig.filename,
                    label: loggerName,
                    json: false,
                    colorize: false,
                    timestamp: true,
                })
              ]
        });

        return logger;
    }

    private static addSentinelMethods() {
        let isLevelEnabled = (level: number) => {
            let defaultLevel = winstonNpmLevels[WinstonConfig.defaultLevel];
        
            return level <= defaultLevel
        };
        
        Winston.Logger.prototype.isSillyEnabled = () => {
            return isLevelEnabled(winstonNpmLevels.silly);
        };

        Winston.Logger.prototype.isDebugEnabled = () => {
            return isLevelEnabled(winstonNpmLevels.debug);
        };

        Winston.Logger.prototype.isVerboseEnabled = () => {
            return isLevelEnabled(winstonNpmLevels.verbose);
        };

        Winston.Logger.prototype.isInfoEnabled = () => {
            return isLevelEnabled(winstonNpmLevels.info);
        };

        Winston.Logger.prototype.isWarnEnabled = () => {
            return isLevelEnabled(winstonNpmLevels.warn);
        };

        Winston.Logger.prototype.isErrorEnabled = () => {
            return isLevelEnabled(winstonNpmLevels.error);
        };
    }
}
