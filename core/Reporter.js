import { AsyncLocalStorage } from 'node:async_hooks'

import { test } from '@playwright/test'
import { allure } from 'allure-playwright'

/**
 * Test-facing business reporting API.
 *
 * Responsibilities:
 *   - Business steps in Playwright report and Allure report
 *   - Screenshots attached to active step in both reports
 *   - File and body attachments
 *   - Business messages via Logger
 *
 * Non-responsibilities:
 *   - Folder creation
 *   - Artifact organization
 *   - Logging implementation
 */
export default class Reporter {

    /**
     * @param {import('@playwright/test').Page} page
     * @param {import('./Logger.js').default} logger
     */
    constructor(page, logger) {

        this.page = page
        this.logger = logger
        this.stepStorage = new AsyncLocalStorage()

    }

    /**
     * Creates a business step in both Playwright report and Allure report.
     * All screenshots and attachments inside the callback belong to this step.
     *
     * @template T
     * @param {string} title
     * @param {() => Promise<T>} callback
     * @returns {Promise<T>}
     */
    // core/Reporter.js -- step() method only

    async step(title, callback) {

        // test.step() is enough.
        // allure-playwright v3 automatically creates Allure steps
        // from test.step() calls -- no allure.step() needed.
        // allure.step() was causing the duplicate inner step.
        return test.step(title, async stepInfo => {

            return this.stepStorage.run(stepInfo, async () => {

                this.logger.step(`START  : ${title}`)

                try {

                    const result = await callback()

                    this.logger.step(`PASSED : ${title}`)

                    return result

                } catch (error) {

                    this.logger.error(`FAILED : ${title} -- ${error.message}`)
                    throw error

                }

            })

        })

    }

    /**
     * Captures a screenshot and attaches it to the active step
     * in both Playwright report and Allure report.
     *
     * Two separate calls are required:
     * - testInfo.attach() for Playwright HTML report (step-level)
     * - allure.attachment() for Allure report (step-level inside allure.step)
     *
     * allure-playwright v3 does NOT automatically associate
     * testInfo.attach() with the current allure.step() context.
     * allure.attachment() must be called explicitly.
     *
     * @param {string} name
     * @param {object} [options]
     * @returns {Promise<void>}
     */
    // async screenshot(name, options = {}) {

    //     const screenshot = await this.page.screenshot(options)

    //     // Playwright HTML report -- attaches inside test.step() context
    //     await this.getAttachmentTarget().attach(name, {
    //         body: screenshot,
    //         contentType: 'image/png'
    //     })

    //     // Allure report -- attaches inside allure.step() context
    //     // v3 signature: allure.attachment(name, body, contentType)
    //     await allure.attachment(name, screenshot, 'image/png')

    //     this.logger.info(`SCREENSHOT: ${name}`)

    // }

    /**
 * Captures a screenshot and attaches it to the active
 * Allure step only. No test-level attachment.
 *
 * @param {string} name
 * @param {object} [options]
 * @returns {Promise<void>}
 */
    async screenshot(name, options = {}) {

        const screenshot = await this.page.screenshot(options)

        // Allure report only -- attaches inside active allure.step() context
        // testInfo.attach() intentionally removed to prevent
        // duplicate screenshots appearing at test level in Allure
        await allure.attachment(name, screenshot, 'image/png')

        this.logger.info(`SCREENSHOT: ${name}`)

    }

    /**
     * Attaches a file from disk to the active step in both reports.
     *
     * @param {string} name
     * @param {string} filePath
     * @param {string} [contentType]
     * @returns {Promise<void>}
     */
    async attach(name, filePath, contentType) {

        const options = { path: filePath }

        if (contentType) {
            options.contentType = contentType
        }

        await this.getAttachmentTarget().attach(name, options)

        this.logger.info(`ATTACHMENT: ${name}`)

    }

    /**
     * Attaches in-memory content to the active step in both reports.
     *
     * @param {string} name
     * @param {string|Buffer} body
     * @param {string} contentType
     * @returns {Promise<void>}
     */
    async attachBody(name, body, contentType) {

        // Playwright HTML report
        await this.getAttachmentTarget().attach(name, { body, contentType })

        // Allure report
        await allure.attachment(name, body, contentType)

        this.logger.info(`ATTACHMENT: ${name}`)

    }

    /** @param {string} message */
    async info(message) { this.logger.info(message) }

    /** @param {string} message */
    async warning(message) { this.logger.warning(message) }

    /** @param {string} message */
    async error(message) { this.logger.error(message) }

    /**
     * Returns active step info when inside reporter.step(),
     * falls back to test level otherwise.
     *
     * @returns {import('@playwright/test').TestInfo|import('@playwright/test').TestStepInfo}
     */
    getAttachmentTarget() {
        return this.stepStorage.getStore() ?? test.info()
    }

}