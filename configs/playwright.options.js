import { loadRuntimeConfig } from '../core/RuntimeConfig.js';

export async function getPlaywrightOptions() {

    const runtime = await loadRuntimeConfig();

    return {

        testDir: './tests',

        testMatch: '**/*.spec.js',

        fullyParallel: true,

        forbidOnly: !!process.env.CI,

        reporter: [
            ['html', { open: 'never' }]
        ],

        use: {

            baseURL: runtime.env.baseUrl,

            ignoreHTTPSErrors: true,

            viewport: null,

            launchOptions: {
                args: ['--start-maximized']
            },

            actionTimeout: 30_000,

            navigationTimeout: 30_000,

            trace: 'on-first-retry',

            screenshot: 'only-on-failure',

            video: 'retain-on-failure'

        },

        projects: [
            {
                name: 'chromium',
                use: {}
            },
            {
                name: 'firefox',
                use: {}
            },
            {
                name: 'webkit',
                use: {}
            }
        ]

    };

}