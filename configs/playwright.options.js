import path   from 'node:path'
import crypto from 'node:crypto'

import { environments } from './env.js'

// ── Environment ───────────────────────────────────────────────────────────────

const envName = process.env.ENV ?? 'dev'
const env     = environments[envName]

if (!env) {
    throw new Error(
        `Unknown environment: "${envName}". ` +
        `Valid options: ${Object.keys(environments).join(', ')}`
    )
}

// ── Execution Paths ───────────────────────────────────────────────────────────
// playwright.options.js is evaluated multiple times by Playwright
// (once per project, once per worker process).
// We use FRAMEWORK_EXECUTION_NAME env variable to ensure
// ALL evaluations share the SAME execution folder.

let executionName

if (process.env.FRAMEWORK_EXECUTION_NAME) {
    // Already set by a previous evaluation -- reuse it
    executionName = process.env.FRAMEWORK_EXECUTION_NAME
} else {
    // First evaluation -- create and store the name
    const timestamp   = formatTimestamp(new Date())
    const suffix      = crypto.randomBytes(3).toString('hex')
    executionName     = `${timestamp}_${suffix}`
    process.env.FRAMEWORK_EXECUTION_NAME = executionName
}

const executionRoot = path.join(process.cwd(), 'reports', executionName)

export const execution = Object.freeze({
    name:             executionName,
    root:             executionRoot,
    allureResultsDir: path.join(executionRoot, 'allure-results'),
    allureReportDir:  path.join(executionRoot, 'allure-report'),
    logsDir:          path.join(executionRoot, 'logs')
})

// Set for Logger access across all worker processes
process.env.FRAMEWORK_LOGS_DIR      = execution.logsDir
process.env.FRAMEWORK_EXECUTION_DIR = execution.root

export { env }

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Formats a Date into a human-readable timestamp for folder names.
 * Example: 2026-07-26_13-15-42
 *
 * @param {Date} date
 * @returns {string}
 */
function formatTimestamp(date) {

    const pad = v => String(v).padStart(2, '0')

    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate())
    ].join('-') + '_' + [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
    ].join('-')

}