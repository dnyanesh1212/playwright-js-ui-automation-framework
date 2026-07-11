import { expect } from '@playwright/test';

/**
 * Centralized Playwright assertions.
 *
 * Responsibilities:
 * - Wrap native Playwright assertions
 * - Preserve native Playwright API
 * - Provide consistent success logging
 * - Provide consistent assertion failure handling
 *
 * Non Responsibilities:
 * - Reporting
 * - Screenshots
 * - Business Logic
 * - Retry Logic
 */
export default class Assertions {

    constructor(page) {

        this.page = page;

    }

    /**
     * Executes a Playwright assertion with consistent success and error handling.
     *
     * @param {string} assertionName
     * @param {string|object} target
     * @param {Function} operation
     * @returns {Promise<any>}
     */
    async performAssertion(assertionName, target, operation) {

        try {

            const result = await operation();

            console.log(
                `✓ ${assertionName} assertion passed for Target: ${target}`
            );

            return result;

        } catch (error) {

            throw new Error(
`Failed '${assertionName}' assertion.

Target: ${target}

${error.message}`
            );

        }

    }

    // -----------------------------
    // Locator Assertions
    // -----------------------------

    toBeAttached(locator, options) {

        return this.performAssertion(
            "toBeAttached",
            locator,
            () => options
                ? expect(locator).toBeAttached(options)
                : expect(locator).toBeAttached()
        );

    }

    toBeChecked(locator, options) {

        return this.performAssertion(
            "toBeChecked",
            locator,
            () => options
                ? expect(locator).toBeChecked(options)
                : expect(locator).toBeChecked()
        );

    }

    toBeDisabled(locator, options) {

        return this.performAssertion(
            "toBeDisabled",
            locator,
            () => options
                ? expect(locator).toBeDisabled(options)
                : expect(locator).toBeDisabled()
        );

    }

    toBeEditable(locator, options) {

        return this.performAssertion(
            "toBeEditable",
            locator,
            () => options
                ? expect(locator).toBeEditable(options)
                : expect(locator).toBeEditable()
        );

    }

    toBeEmpty(locator, options) {

        return this.performAssertion(
            "toBeEmpty",
            locator,
            () => options
                ? expect(locator).toBeEmpty(options)
                : expect(locator).toBeEmpty()
        );

    }

    toBeEnabled(locator, options) {

        return this.performAssertion(
            "toBeEnabled",
            locator,
            () => options
                ? expect(locator).toBeEnabled(options)
                : expect(locator).toBeEnabled()
        );

    }

    toBeFocused(locator, options) {

        return this.performAssertion(
            "toBeFocused",
            locator,
            () => options
                ? expect(locator).toBeFocused(options)
                : expect(locator).toBeFocused()
        );

    }

    toBeHidden(locator, options) {

        return this.performAssertion(
            "toBeHidden",
            locator,
            () => options
                ? expect(locator).toBeHidden(options)
                : expect(locator).toBeHidden()
        );

    }

    toBeInViewport(locator, options) {

        return this.performAssertion(
            "toBeInViewport",
            locator,
            () => options
                ? expect(locator).toBeInViewport(options)
                : expect(locator).toBeInViewport()
        );

    }

    toBeVisible(locator, options) {

        return this.performAssertion(
            "toBeVisible",
            locator,
            () => options
                ? expect(locator).toBeVisible(options)
                : expect(locator).toBeVisible()
        );

    }

    toContainText(locator, text, options) {

        return this.performAssertion(
            "toContainText",
            locator,
            () => options
                ? expect(locator).toContainText(text, options)
                : expect(locator).toContainText(text)
        );

    }

    toHaveAttribute(locator, name, value, options) {

        return this.performAssertion(
            "toHaveAttribute",
            locator,
            () => options
                ? expect(locator).toHaveAttribute(name, value, options)
                : expect(locator).toHaveAttribute(name, value)
        );

    }

    toHaveClass(locator, value, options) {

        return this.performAssertion(
            "toHaveClass",
            locator,
            () => options
                ? expect(locator).toHaveClass(value, options)
                : expect(locator).toHaveClass(value)
        );

    }

    toHaveCount(locator, count, options) {

        return this.performAssertion(
            "toHaveCount",
            locator,
            () => options
                ? expect(locator).toHaveCount(count, options)
                : expect(locator).toHaveCount(count)
        );

    }

    toHaveCSS(locator, property, value, options) {

        return this.performAssertion(
            "toHaveCSS",
            locator,
            () => options
                ? expect(locator).toHaveCSS(property, value, options)
                : expect(locator).toHaveCSS(property, value)
        );

    }

    toHaveId(locator, value, options) {

        return this.performAssertion(
            "toHaveId",
            locator,
            () => options
                ? expect(locator).toHaveId(value, options)
                : expect(locator).toHaveId(value)
        );

    }

    toHaveJSProperty(locator, name, value, options) {

        return this.performAssertion(
            "toHaveJSProperty",
            locator,
            () => options
                ? expect(locator).toHaveJSProperty(name, value, options)
                : expect(locator).toHaveJSProperty(name, value)
        );

    }

    toHaveRole(locator, role, options) {

        return this.performAssertion(
            "toHaveRole",
            locator,
            () => options
                ? expect(locator).toHaveRole(role, options)
                : expect(locator).toHaveRole(role)
        );

    }

    toHaveText(locator, value, options) {

        return this.performAssertion(
            "toHaveText",
            locator,
            () => options
                ? expect(locator).toHaveText(value, options)
                : expect(locator).toHaveText(value)
        );

    }

    toHaveValue(locator, value, options) {

        return this.performAssertion(
            "toHaveValue",
            locator,
            () => options
                ? expect(locator).toHaveValue(value, options)
                : expect(locator).toHaveValue(value)
        );

    }

    toHaveValues(locator, values, options) {

        return this.performAssertion(
            "toHaveValues",
            locator,
            () => options
                ? expect(locator).toHaveValues(values, options)
                : expect(locator).toHaveValues(values)
        );

    }

    // -----------------------------
    // Page Assertions
    // -----------------------------

    toHaveTitle(title, options) {

        return this.performAssertion(
            "toHaveTitle",
            "Page",
            () => options
                ? expect(this.page).toHaveTitle(title, options)
                : expect(this.page).toHaveTitle(title)
        );

    }

    toHaveURL(url, options) {

        return this.performAssertion(
            "toHaveURL",
            "Page",
            () => options
                ? expect(this.page).toHaveURL(url, options)
                : expect(this.page).toHaveURL(url)
        );

    }

}