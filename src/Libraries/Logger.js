import * as Sentry from '@sentry/node'
import config from '../config'
import { inspect } from 'util'

Sentry.init({
    tracesSampleRate: 1.0,
    dsn: process.env.SENTRY_DSN,
})

function str(...args) {
    return args.join('')
}

export default class Logger {
    static debug(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Debug
        })
        console.log(str("[debug]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static info(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Info
        })
        console.log(str("[info]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static warn(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Warning
        })
        console.log(str("[warn]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static error(category, message) {
        Sentry.addBreadcrumb({
            category,
            message,
            level: Sentry.Severity.Error
        })
        console.log(str("[error]", `[${category}]`, ` ${inspect(message, true, 5)}`))
    }

    static fatal(error) {
        Sentry.captureException(error)
        console.log(str("[fatal]", ` ${inspect(error, true, 5)}`))
    }
}