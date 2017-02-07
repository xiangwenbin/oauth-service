/**
 * http://qianduan.guru/2016/08/21/nodejs-lesson-1-log4js/
 * 日志配置
 */
import log4js from 'log4js';
log4js.configure({
    appenders: [
        {
            type: 'console',
            level: 'DEBUG',
            category: "DEBUG"
        },
        {
            type: 'dateFile',
            filename: 'logs/access',
            maxLogSize: 20480,
            backups: 3,
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            level: 'INFO',
            category: "access"
        },
        {
            type: 'file',
            filename: 'logs/errors.log',
            maxLogSize: 20480,
            backups: 3,
            level: 'ERROR'
        }
    ]
});
export default log4js