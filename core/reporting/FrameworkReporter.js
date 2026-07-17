import { loadRuntimeConfig } from "../RuntimeConfig.js";
import ExecutionManager from "./ExecutionManager.js";

export default class FrameworkReporter {

    constructor() {

        this.executionContext = null;

    }

    /**
     * Called once before test execution starts.
     *
     * @param {import('@playwright/test/reporter').FullConfig} config
     * @param {import('@playwright/test/reporter').Suite} suite
     */
    async onBegin(config, suite) {

        const runtimeConfig =
            await loadRuntimeConfig();

        this.executionContext =
            await ExecutionManager.start(

                runtimeConfig,

                config,

                suite

            );

    }

    /**
     * Called before every test starts.
     *
     * @param {import('@playwright/test/reporter').TestCase} test
     */
    async onTestBegin(test) {

        // Will be implemented later.

    }

    /**
     * Called after every test finishes.
     *
     * @param {import('@playwright/test/reporter').TestCase} test
     * @param {import('@playwright/test/reporter').TestResult} result
     */
    async onTestEnd(test, result) {

        // Will be implemented later.

    }

    /**
     * Called once after all tests finish.
     *
     * @param {import('@playwright/test/reporter').FullResult} result
     */
    async onEnd(result) {

        await ExecutionManager.finish(

            this.executionContext,

            result

        );

    }

}