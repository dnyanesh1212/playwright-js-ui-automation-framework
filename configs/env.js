/**
 * All environment configurations for the application.
 * Add or modify environments here as needed.
 * Select environment at runtime via ENV variable:
 *
 * ENV=qa npx playwright test
 * ENV=staging npx playwright test
 */
export const environments = {

    dev: {
        name:    'Development',
        baseUrl: 'https://automationexercise.com'
    },

    qa: {
        name:    'QA',
        baseUrl: 'https://qa.automationexercise.com'
    },

    staging: {
        name:    'Staging',
        baseUrl: 'https://staging.automationexercise.com'
    }

}