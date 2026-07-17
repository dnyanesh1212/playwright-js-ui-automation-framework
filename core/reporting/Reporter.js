import { test } from "@playwright/test";

/**
 * Framework Reporter.
 *
 * Responsibilities:
 * - Business step reporting
 * - File attachments
 * - Business messages
 *
 * Non Responsibilities:
 * - Logging
 * - Folder creation
 * - Screenshot capture
 * - Playwright lifecycle
 */
export default class Reporter {

    /**
     * Executes a business step.
     *
     * @param {string} title
     * @param {Function} callback
     * @returns {Promise<any>}
     */
    async step(title, callback) {

        return test.step(title, callback);

    }

    /**
     * Attaches a file.
     *
     * @param {string} name
     * @param {string} path
     * @returns {Promise<void>}
     */
    async attach(name, path) {

        return test.info().attach(name, {

            path

        });

    }

    /**
     * Attaches content.
     *
     * @param {string} name
     * @param {string|Buffer} body
     * @param {string} contentType
     * @returns {Promise<void>}
     */
    async attachBody(name, body, contentType) {

        return test.info().attach(name, {

            body,

            contentType

        });

    }

    /**
     * Adds an informational message.
     *
     * @param {string} message
     * @returns {Promise<void>}
     */
    async info(message) {

        return this.attachBody(

            "Info",

            message,

            "text/plain"

        );

    }

    /**
     * Adds a warning message.
     *
     * @param {string} message
     * @returns {Promise<void>}
     */
    async warning(message) {

        return this.attachBody(

            "Warning",

            message,

            "text/plain"

        );

    }

    /**
     * Adds an error message.
     *
     * @param {string} message
     * @returns {Promise<void>}
     */
    async error(message) {

        return this.attachBody(

            "Error",

            message,

            "text/plain"

        );

    }

}