import fs from 'node:fs'
import path from 'node:path'

/**
 * Framework logger.
 *
 * Responsibilities:
 *   - Print every log line to console
 *   - Write every log line to logs/TestName.log
 *
 * Non-responsibilities:
 *   - Folder creation (FrameworkReporter handles this)
 *   - Knowing execution folder structure
 */
export default class Logger {

    /**
     * @param {string} testName -- used as the log file name
     */
    constructor(testName) {

        // Read logsDir from environment variable
        // Set by playwright.options.js before tests run
        const logsDir = process.env.FRAMEWORK_LOGS_DIR

        if (logsDir) {
            // Ensure logs directory exists
            // Worker processes may start before FrameworkReporter.onBegin()
            try {
                fs.mkdirSync(logsDir, { recursive: true })
            } catch {
                // ignore
            }

            const safeName = this.sanitize(testName)
            this.logFilePath = path.join(logsDir, `${safeName}.log`)
        } else {
            this.logFilePath = null
        }

    }

    /** @param {string} message */
    info(message) { this.write('INFO', message) }

    /** @param {string} message */
    warning(message) { this.write('WARNING', message) }

    /** @param {string} message */
    error(message) { this.write('ERROR', message) }

    /** @param {string} message */
    debug(message) { this.write('DEBUG', message) }

    /** @param {string} message */
    step(message) { this.write('STEP', message) }

    /**
     * Writes a log entry to console and log file.
     *
     * @param {string} level
     * @param {string} message
     */
    write(level, message) {

        const entry = `[${this.timestamp()}] [${level.padEnd(7)}] ${message}`

        console.log(entry)

        if (this.logFilePath) {
            try {
                fs.appendFileSync(this.logFilePath, `${entry}\n`)
            } catch (error) {
                console.error(`[Logger] Failed to write log: ${error.message}`)
            }
        }

    }

    /**
     * Returns current timestamp.
     * Example: 2026-07-19 10:30:00
     *
     * @returns {string}
     */
    timestamp() {

        const now = new Date()
        const pad = v => String(v).padStart(2, '0')

        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
            `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

    }

    /**
     * Sanitizes a string for use as a file name.
     *
     * @param {string} value
     * @returns {string}
     */
    sanitize(value) {

        return String(value)
            .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
            .replace(/\s+/g, ' ')
            .trim() || 'unnamed'

    }

}