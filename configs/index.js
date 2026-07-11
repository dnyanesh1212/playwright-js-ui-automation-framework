import { defineConfig } from '@playwright/test';
import { getPlaywrightOptions } from './playwright.options.js';

export default defineConfig(
    await getPlaywrightOptions()
);