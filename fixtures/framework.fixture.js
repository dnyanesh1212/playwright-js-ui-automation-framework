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


// fixtures/framework.fixture.js -- add apiTest export

import { test as base, expect } from '@playwright/test'
import ApiAssertions from '../core/ApiAssertions.js'
import ApiClient     from '../core/ApiClient.js'
import Logger        from '../core/Logger.js'
import Reporter      from '../core/Reporter.js'

// ── UI + API fixture (existing) ───────────────────────────────────────────────
export const test = base.extend({

    logger: async ({}, use, testInfo) => {
        const logger = new Logger(testInfo.title)
        logger.info(`TEST START: ${testInfo.title}`)
        await use(logger)
        logger.info(`TEST END: ${testInfo.title}`)
    },

    reporter: async ({ page, logger }, use) => {
        await use(new Reporter(page, logger))
    },

    apiClient: async ({ request, logger }, use) => {
        await use(new ApiClient(request, logger))
    },

    apiAssertions: async ({ logger }, use) => {
        await use(new ApiAssertions(logger))
    }

})

// ── API only fixture (no browser) ─────────────────────────────────────────────
export const apiTest = base.extend({

    logger: async ({}, use, testInfo) => {
        const logger = new Logger(testInfo.title)
        logger.info(`TEST START: ${testInfo.title}`)
        await use(logger)
        logger.info(`TEST END: ${testInfo.title}`)
    },

    apiClient: async ({ request, logger }, use) => {
        await use(new ApiClient(request, logger))
    },

    apiAssertions: async ({ logger }, use) => {
        await use(new ApiAssertions(logger))
    }

})

export { expect }