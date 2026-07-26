import { expect } from '@playwright/test'

export default class Assertions {

    constructor(page, logger) {
        this.page   = page
        this.logger = logger
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

    async toBeVisible(locator, description = 'element') {
        await this.perform('toBeVisible', description, () => expect(locator).toBeVisible())
    }

    async toBeHidden(locator, description = 'element') {
        await this.perform('toBeHidden', description, () => expect(locator).toBeHidden())
    }

    async toBeEnabled(locator, description = 'element') {
        await this.perform('toBeEnabled', description, () => expect(locator).toBeEnabled())
    }

    async toBeDisabled(locator, description = 'element') {
        await this.perform('toBeDisabled', description, () => expect(locator).toBeDisabled())
    }

    async toBeChecked(locator, description = 'element') {
        await this.perform('toBeChecked', description, () => expect(locator).toBeChecked())
    }

    async toHaveText(locator, text, description = 'element') {
        await this.perform('toHaveText', description, () => expect(locator).toHaveText(text))
    }

    async toContainText(locator, text, description = 'element') {
        await this.perform('toContainText', description, () => expect(locator).toContainText(text))
    }

    async toHaveValue(locator, value, description = 'element') {
        await this.perform('toHaveValue', description, () => expect(locator).toHaveValue(value))
    }

    async toHaveAttribute(locator, attribute, value, description = 'element') {
        await this.perform('toHaveAttribute', description, () => expect(locator).toHaveAttribute(attribute, value))
    }

    async toHaveCount(locator, count, description = 'elements') {
        await this.perform('toHaveCount', description, () => expect(locator).toHaveCount(count))
    }

    async toHaveURL(url, description = 'page') {
        await this.perform('toHaveURL', description, () => expect(this.page).toHaveURL(url))
    }

    async toHaveTitle(title, description = 'page') {
        await this.perform('toHaveTitle', description, () => expect(this.page).toHaveTitle(title))
    }

    async notToBeVisible(locator, description = 'element') {
        await this.perform('notToBeVisible', description, () => expect(locator).not.toBeVisible())
    }

    async notToHaveText(locator, text, description = 'element') {
        await this.perform('notToHaveText', description, () => expect(locator).not.toHaveText(text))
    }

}