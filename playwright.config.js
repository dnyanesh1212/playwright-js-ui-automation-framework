import { defineConfig } from '@playwright/test'

import { env, execution } from './configs/playwright.options.js'

export default defineConfig({

    testDir:       './tests',
    testMatch:     '**/*.spec.js',
    fullyParallel: true,
    forbidOnly:    !!process.env.CI,
    retries:       process.env.CI ? 2 : 0,
    workers:       process.env.CI ? 4 : undefined,

    reporter: [

        // Playwright HTML report -- default location, local dev only
        ['html', { open: 'never' }],

        // Allure raw results -- goes into execution folder
        [
            'allure-playwright',
            { resultsDir: execution.allureResultsDir }
        ],

        // Framework reporter -- creates folders, generates allure report
        [
            './core/FrameworkReporter.js',
            { execution }
        ]

    ],

    use: {

        baseURL:           env.baseUrl,
        ignoreHTTPSErrors: true,
        headless:          false,  
        actionTimeout:     30_000,
        navigationTimeout: 30_000,
        trace:             'on-first-retry',
        screenshot:        'only-on-failure',
        video:             'retain-on-failure',
        viewport:          null,

        launchOptions: {
            args: ['--start-maximized']
        }

    },

    projects: [
        { name: 'chromium', use: {} },
        // { name: 'firefox',  use: {} },
        // { name: 'webkit',   use: {} }
    ]

})