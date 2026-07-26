import Actions    from './Actions.js'
import Assertions from './Assertions.js'
import WaitUtils  from './WaitUtils.js'

/**
 * Base class for all page objects.
 *
 * Responsibilities:
 *   - Own Playwright page
 *   - Own Actions instance
 *   - Own Assertions instance
 *   - Own WaitUtils instance
 *   - Provide common page helpers
 *
 * Non-responsibilities:
 *   - Reporting
 *   - Logging implementation
 *   - Test data
 */
export default class BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     * @param {import('./Logger.js').default} logger
     */
    constructor(page, logger) {

        this.page    = page
        this.actions = new Actions(page, logger)
        this.assert  = new Assertions(page, logger)
        this.wait    = new WaitUtils(page, logger)

    }

    /**
     * Waits for the page to finish loading.
     */
    async waitForLoad() {
        await this.page.waitForLoadState('domcontentloaded')
    }

    /**
     * Scrolls the page to the bottom.
     */
    async scrollToBottom() {
        await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight)
        })
    }

    /**
     * Scrolls the page to the top.
     */
    async scrollToTop() {
        await this.page.evaluate(() => {
            window.scrollTo(0, 0)
        })
    }

}