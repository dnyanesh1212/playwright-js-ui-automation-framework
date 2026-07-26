import { test } from '@playwright/test'

export default class Actions {

    constructor(page, logger) {
        this.page   = page
        this.logger = logger
    }

    /**
     * Core wrapper for all actions.
     * Logs and executes only -- does NOT create test.step().
     * Business steps are created by Reporter.step() only.
     */
    async perform(actionName, description, action) {

        try {
            await action()
            this.logger.info(`${actionName} -- ${description}`)
        } catch (error) {
            this.logger.error(`${actionName} FAILED -- ${description} -- ${error.message}`)
            throw error
        }

    }

    async click(locator, description = 'element') {
        await this.perform('Click', description, () => locator.click())
    }

    async fill(locator, value, description = 'element') {
        await this.perform('Fill', description, () => locator.fill(value))
    }

    async clear(locator, description = 'element') {
        await this.perform('Clear', description, () => locator.clear())
    }

    async type(locator, value, description = 'element') {
        await this.perform('Type', description, () => locator.pressSequentially(value))
    }

    async press(locator, key, description = 'element') {
        await this.perform(`Press ${key}`, description, () => locator.press(key))
    }

    async hover(locator, description = 'element') {
        await this.perform('Hover', description, () => locator.hover())
    }

    async check(locator, description = 'element') {
        await this.perform('Check', description, () => locator.check())
    }

    async uncheck(locator, description = 'element') {
        await this.perform('Uncheck', description, () => locator.uncheck())
    }

    async selectOption(locator, value, description = 'element') {
        await this.perform('Select', description, () => locator.selectOption(value))
    }

    async uploadFile(locator, filePath, description = 'element') {
        await this.perform('Upload', description, () => locator.setInputFiles(filePath))
    }

    async scrollIntoView(locator, description = 'element') {
        await this.perform('ScrollIntoView', description, () => locator.scrollIntoViewIfNeeded())
    }

    async dragTo(source, target, sourceDesc = 'source', targetDesc = 'target') {
        await this.perform(`Drag ${sourceDesc} to ${targetDesc}`, sourceDesc, () => source.dragTo(target))
    }

    async dblclick(locator, description = 'element') {
        await this.perform('DoubleClick', description, () => locator.dblclick())
    }

    async rightClick(locator, description = 'element') {
        await this.perform('RightClick', description, () => locator.click({ button: 'right' }))
    }

    async focus(locator, description = 'element') {
        await this.perform('Focus', description, () => locator.focus())
    }

}