import * as Sentry from '@sentry/node'
import { inspect } from 'util'
import 'colors'

Sentry.init({
    tracesSampleRate: 1.0,
    dsn: process.env.SENTRY_DSN,
})

function str(...args) {
    return args.join('')
}

let Level = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
}
let LogLevel = Level.INFO


export default class Logger {
    static debug(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Debug
        })
        if (LogLevel <= Level.DEBUG) console.log(str("[debug]".gray, `[${category}]`.gray, ` ${inspect(message, true, 5)}`.gray))
    }

    static info(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Info
        })
        if (LogLevel <= Level.INFO) console.log(str("[info]".white, `[${category}]`.white, ` ${inspect(message, true, 5)}`.white))
    }

    static warn(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Warning
        })
        if (LogLevel <= Level.WARN) console.log(str("[warn]".yellow, `[${category}]`.yellow, ` ${inspect(message, true, 5)}`.white))
    }

    static error(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Error
        })
        if (LogLevel <= Level.ERROR) console.log(str("[error]".red, `[${category}]`.red, ` ${inspect(message, true, 5)}`.white))
    }

    static fatal(error) {
        Sentry.captureException(error)
        console.log(str("[fatal]".red, ` ${inspect(error, true, 5)}`.red))
    }
}