import * as Sentry from '@sentry/node'
import { inspect } from 'util'

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
        if (LogLevel <= Level.DEBUG) console.log(str("[debug]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static info(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Info
        })
        if (LogLevel <= Level.INFO) console.log(str("[info]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static warn(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Warning
        })
        if (LogLevel <= Level.WARN) console.log(str("[warn]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static error(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Error
        })
        if (LogLevel <= Level.ERROR) console.log(str("[error]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static fatal(error) {
        Sentry.captureException(error)
        console.log(str("[fatal]", ` ${inspect(error, true, 5)}`))
    }
}