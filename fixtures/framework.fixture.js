import { test as base } from "@playwright/test";

import Reporter from "../core/Reporter.js";
import Logger from "../core/Logger.js";

export const test = base.extend({

    reporter: async ({}, use) => {

        await use(
            new Reporter()
        );

    },

    logger: async ({}, use) => {

        await use(
            new Logger()
        );

    }

});

export { expect } from "@playwright/test";