/**
 * Centralized Playwright UI actions.
 *
 * Responsibilities:
 * - Wrap native Playwright interactions.
 * - Preserve native Playwright behavior.
 * - Provide consistent success logging.
 * - Provide consistent error handling.
 *
 * Non Responsibilities:
 * - Logging framework
 * - Reporting
 * - Screenshots
 * - Assertions
 * - Retry Logic
 * - Business Logic
 */
export default class Actions {

    constructor(page) {

        this.page = page;

    }

/**
 * Executes a Playwright action with consistent success and error handling.
 *
 * @param {string} actionName
 * @param {import('@playwright/test').Locator} locator
 * @param {Function} operation
 * @returns {Promise<any>}
 */
async performAction(actionName, locator, operation) {

    try {

        const result = await operation();

        console.log(`✓ ${actionName} action completed successfully for Locator: ${locator}`);

        return result;

    } catch (error) {

        throw new Error(
`Failed to perform '${actionName}' action.

Locator: ${locator}

${error.message}`
        );

    }

}

 // Mouse Actions

click(locator, options) {

    return this.performAction(
        "Click",
        locator,
        () => options ? locator.click(options) : locator.click()
    );

}

dblClick(locator, options) {

    return this.performAction(
        "Double Click",
        locator,
        () => options ? locator.dblclick(options) : locator.dblclick()
    );

}

rightClick(locator, options) {

    return this.performAction(
        "Right Click",
        locator,
        () => options
            ? locator.click({ button: "right", ...options })
            : locator.click({ button: "right" })
    );

}

hover(locator, options) {

    return this.performAction(
        "Hover",
        locator,
        () => options ? locator.hover(options) : locator.hover()
    );

}

// Keyboard / Input Actions

fill(locator, value, options) {

    return this.performAction(
        "Fill",
        locator,
        () => options
            ? locator.fill(value, options)
            : locator.fill(value)
    );

}

clear(locator) {

    return this.performAction(
        "Clear",
        locator,
        () => locator.clear()
    );

}

press(locator, key, options) {

    return this.performAction(
        "Press",
        locator,
        () => options
            ? locator.press(key, options)
            : locator.press(key)
    );

}

// Selection Actions

check(locator, options) {

    return this.performAction(
        "Check",
        locator,
        () => options ? locator.check(options) : locator.check()
    );

}

uncheck(locator, options) {

    return this.performAction(
        "Uncheck",
        locator,
        () => options ? locator.uncheck(options) : locator.uncheck()
    );

}

selectOption(locator, values, options) {

    return this.performAction(
        "Select Option",
        locator,
        () => options
            ? locator.selectOption(values, options)
            : locator.selectOption(values)
    );

}

// File Actions

upload(locator, files, options) {

    return this.performAction(
        "Upload File",
        locator,
        () => options
            ? locator.setInputFiles(files, options)
            : locator.setInputFiles(files)
    );

}

// Information Actions

textContent(locator) {

    return this.performAction(
        "Get Text",
        locator,
        () => locator.textContent()
    );

}

inputValue(locator) {

    return this.performAction(
        "Get Value",
        locator,
        () => locator.inputValue()
    );

}

getAttribute(locator, name) {

    return this.performAction(
        "Get Attribute",
        locator,
        () => locator.getAttribute(name)
    );

}

count(locator) {

    return this.performAction(
        "Get Count",
        locator,
        () => locator.count()
    );

}

// State Actions

isVisible(locator) {

    return this.performAction(
        "Is Visible",
        locator,
        () => locator.isVisible()
    );

}

isHidden(locator) {

    return this.performAction(
        "Is Hidden",
        locator,
        () => locator.isHidden()
    );

}

isEnabled(locator) {

    return this.performAction(
        "Is Enabled",
        locator,
        () => locator.isEnabled()
    );

}

isDisabled(locator) {

    return this.performAction(
        "Is Disabled",
        locator,
        () => locator.isDisabled()
    );

}

isChecked(locator) {

    return this.performAction(
        "Is Checked",
        locator,
        () => locator.isChecked()
    );

}

}