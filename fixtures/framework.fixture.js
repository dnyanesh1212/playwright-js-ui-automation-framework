import { test as base, expect } from '@playwright/test'

import Logger   from '../core/Logger.js'
import Reporter from '../core/Reporter.js'

/**
 * Framework fixtures.
 *
 * Exposes to every test:
 *   logger   -- writes to console and reports/timestamp/logs/TestName.log
 *   reporter -- business steps and screenshots for Playwright and Allure
 *
 * Does NOT expose page objects.
 * Page objects belong to the application layer (pages/ folder).
 */
export const test = base.extend({

    logger: async ({}, use, testInfo) => {

        const logger = new Logger(testInfo.title)

        logger.info(`TEST START: ${testInfo.title}`)

        await use(logger)

        logger.info(`TEST END: ${testInfo.title}`)

    },

    reporter: async ({ page, logger }, use) => {

        await use(new Reporter(page, logger))

    }

})

export { expect }