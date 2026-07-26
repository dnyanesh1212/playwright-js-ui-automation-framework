export default class WaitUtils {

    constructor(page, logger) {
        this.page   = page
        this.logger = logger
    }

    /**
     * Core wrapper for all waits.
     * Logs and executes only -- does NOT create test.step().
     */
    async perform(waitName, description, wait) {

        try {
            await wait()
            this.logger.debug(`WAIT DONE -- ${waitName} -- ${description}`)
        } catch (error) {
            this.logger.error(`WAIT FAILED -- ${waitName} -- ${description} -- ${error.message}`)
            throw error
        }

    }

    async waitForVisible(locator, description = 'element', options = {}) {
        await this.perform('WaitForVisible', description, () =>
            locator.waitFor({ state: 'visible', ...options })
        )
    }

    async waitForHidden(locator, description = 'element', options = {}) {
        await this.perform('WaitForHidden', description, () =>
            locator.waitFor({ state: 'hidden', ...options })
        )
    }

    async waitForAttached(locator, description = 'element', options = {}) {
        await this.perform('WaitForAttached', description, () =>
            locator.waitFor({ state: 'attached', ...options })
        )
    }

    async waitForURL(url, options = {}) {
        await this.perform('WaitForURL', String(url), () =>
            this.page.waitForURL(url, options)
        )
    }

    async waitForLoadState(state = 'load', options = {}) {
        await this.perform('WaitForLoadState', state, () =>
            this.page.waitForLoadState(state, options)
        )
    }

    async waitForRequest(urlOrPredicate, options = {}) {
        await this.perform('WaitForRequest', String(urlOrPredicate), () =>
            this.page.waitForRequest(urlOrPredicate, options)
        )
    }

    async waitForResponse(urlOrPredicate, options = {}) {
        await this.perform('WaitForResponse', String(urlOrPredicate), () =>
            this.page.waitForResponse(urlOrPredicate, options)
        )
    }

    async waitForTimeout(ms) {
        await this.perform('WaitForTimeout', `${ms}ms`, () =>
            this.page.waitForTimeout(ms)
        )
    }

}