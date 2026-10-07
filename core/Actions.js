import { test } from '@playwright/test'

export default class Actions {

    constructor(page, logger) {
        this.page   = page;
        this.logger = logger;
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

    async click(locator, options = {}, description = 'element') {
        await this.perform('Click', description, () => locator.click(options))
    }

    async fill(locator, value, options = {}, description = 'element') {
        await this.perform('Fill', description, () => locator.fill(value, options))
    }

    async clear(locator, options = {}, description = 'element') {
        await this.perform('Clear', description, () => locator.clear(options))
    }

    async type(locator, value, options = {}, description = 'element') {
        await this.perform('Type', description, () => locator.pressSequentially(value, options))
    }

    async press(locator, key, options = {}, description = 'element') {
        await this.perform(`Press ${key}`, description, () => locator.press(key, options))
    }

    async hover(locator, options = {}, description = 'element') {
        await this.perform('Hover', description, () => locator.hover(options))
    }

    async check(locator, options = {}, description = 'element') {
        await this.perform('Check', description, () => locator.check(options))
    }

    async uncheck(locator, options = {}, description = 'element') {
        await this.perform('Uncheck', description, () => locator.uncheck(options))
    }

    async selectOption(locator, value, options = {}, description = 'element') {
        await this.perform('Select', description, () => locator.selectOption(value, options))
    }

    async uploadFile(locator, filePath, options = {}, description = 'element') {
        await this.perform('Upload', description, () => locator.setInputFiles(filePath, options))
    }

    async scrollIntoView(locator, options = {}, description = 'element') {
        await this.perform('ScrollIntoView', description, () => locator.scrollIntoViewIfNeeded(options))
    }

    async dragTo(source, target, sourceDesc = 'source', targetDesc = 'target', options = {}) {
        await this.perform(`Drag ${sourceDesc} to ${targetDesc}`, sourceDesc, () => source.dragTo(target, options))
    }

    async dblclick(locator, options = {}, description = 'element') {
        await this.perform('DoubleClick', description, () => locator.dblclick(options))
    }

    async rightClick(locator, options = {}, description = 'element') {
        await this.perform('RightClick', description, () => locator.click({ button: 'right' }, options))
    }

    async focus(locator, options = {}, description = 'element') {
        await this.perform('Focus', description, () => locator.focus())
    }

}