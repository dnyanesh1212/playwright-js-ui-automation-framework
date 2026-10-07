import { expect } from '@playwright/test'

export default class Assertions {

    constructor(page, logger) {
        this.page   = page;
        this.logger = logger;
    }

    /**
     * Core wrapper for all assertions.
     * Logs and executes only -- does NOT create test.step().
     * Business steps are created by Reporter.step() only.
     */
    async perform(assertionName, description, assertion) {

        try {
            await assertion()
            this.logger.info(`PASS -- ${assertionName} -- ${description}`)
        } catch (error) {
            this.logger.error(`FAIL -- ${assertionName} -- ${description} -- ${error.message}`)
            throw error
        }

    }

    async toBeVisible(locator, options = {}, description = 'element') {
        await this.perform('toBeVisible', description, () => expect(locator).toBeVisible(options))
    }

    async toBeHidden(locator, options = {}, description = 'element') {
        await this.perform('toBeHidden', description, () => expect(locator).toBeHidden(options))
    }

    async toBeEnabled(locator, options = {}, description = 'element') {
        await this.perform('toBeEnabled', description, () => expect(locator).toBeEnabled(options))
    }

    async toBeDisabled(locator, options = {}, description = 'element') {
        await this.perform('toBeDisabled', description, () => expect(locator).toBeDisabled(options))
    }

    async toBeChecked(locator, options = {}, description = 'element') {
        await this.perform('toBeChecked', description, () => expect(locator).toBeChecked(options))
    }

    async toHaveText(locator, text, options = {}, description = 'element') {
        await this.perform('toHaveText', description, () => expect(locator).toHaveText(text, options))
    }

    async toContainText(locator, text, options = {}, description = 'element') {
        await this.perform('toContainText', description, () => expect(locator).toContainText(text, options))
    }

    async toHaveValue(locator, value, options = {}, description = 'element') {
        await this.perform('toHaveValue', description, () => expect(locator).toHaveValue(value, options))
    }

    async toHaveAttribute(locator, attribute, value, options = {}, description = 'element') {
        await this.perform('toHaveAttribute', description, () => expect(locator).toHaveAttribute(attribute, value, options))
    }

    async toHaveCount(locator, count, options = {}, description = 'elements') {
        await this.perform('toHaveCount', description, () => expect(locator).toHaveCount(count, options))
    }

    async toHaveURL(url, options = {}, description = 'page') {
        await this.perform('toHaveURL', description, () => expect(this.page).toHaveURL(url, options))
    }

    async toHaveTitle(title, options = {}, description = 'page') {
        await this.perform('toHaveTitle', description, () => expect(this.page).toHaveTitle(title, options))
    }

    async notToBeVisible(locator, options = {}, description = 'element') {
        await this.perform('notToBeVisible', description, () => expect(locator).not.toBeVisible(options))
    }

    async notToHaveText(locator, text, options = {}, description = 'element') {
        await this.perform('notToHaveText', description, () => expect(locator).not.toHaveText(text, options))
    }

}