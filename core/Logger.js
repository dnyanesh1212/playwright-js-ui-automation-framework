import fs from "node:fs";

export default class Logger {

    /**
     * @param {string} logFilePath
     */
    constructor(logFilePath) {

        this.logFilePath = logFilePath;

    }

    /**
     * Logs an informational message.
     *
     * @param {string} message
     */
    info(message) {

        this.log("INFO", message);

    }

    /**
     * Logs a warning message.
     *
     * @param {string} message
     */
    warning(message) {

        this.log("WARNING", message);

    }

    /**
     * Logs an error message.
     *
     * @param {string} message
     */
    error(message) {

        this.log("ERROR", message);

    }

    /**
     * Logs a debug message.
     *
     * @param {string} message
     */
    debug(message) {

        this.log("DEBUG", message);

    }

    /**
     * Writes a log entry.
     *
     * @param {string} level
     * @param {string} message
     */
    log(level, message) {

        const timestamp = this.timestamp();

        const entry =
            `[${timestamp}] [${level}] ${message}`;

        console.log(entry);

        if (this.logFilePath) {

            fs.appendFileSync(

                this.logFilePath,

                `${entry}\n`

            );

        }

    }

    /**
     * Returns current timestamp.
     *
     * Example:
     * 2026-07-12 18:45:12
     *
     * @returns {string}
     */
    timestamp() {

        const now = new Date();

        const pad = value =>
            String(value).padStart(2, "0");

        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    }

}