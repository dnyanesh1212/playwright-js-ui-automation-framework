// import { defineConfig } from '@playwright/test';
// import { getPlaywrightOptions } from './playwright.options.js';

// export default defineConfig(
//     await getPlaywrightOptions()
// );

import { defineConfig } from '@playwright/test';
import { getPlaywrightOptions } from './playwright.options.js';

// Default application for local development
export const defaultApplication = 'automation-exercise';

export default defineConfig(
    await getPlaywrightOptions()
);