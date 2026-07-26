import fs             from 'node:fs'
import { createRequire } from 'node:module'

/**
 * Playwright reporter for framework lifecycle management.
 *
 * Responsibilities:
 *   - Create execution folder before tests run
 *   - Generate Allure HTML report after all tests finish
 *
 * Non-responsibilities:
 *   - Business steps
 *   - Screenshots
 *   - Logging
 *   - Artifact organization
 */
export default class FrameworkReporter {

    /**
     * @param {{ execution: object }} [options]
     */
    constructor(options = {}) {
        this.execution = options.execution ?? null
    }

    /**
     * Creates all execution folders before any test runs.
     */
    async onBegin() {

        if (!this.execution) {
            return
        }

        fs.mkdirSync(this.execution.allureResultsDir, { recursive: true })
        fs.mkdirSync(this.execution.allureReportDir,  { recursive: true })
        fs.mkdirSync(this.execution.logsDir,          { recursive: true })

    }

    /**
     * Generates Allure HTML report after all tests finish.
     */
    async onEnd() {

        if (!this.execution) {
            return
        }

        await this.generateAllureReport()

    }

    /**
     * Generates Allure HTML report using allure-commandline JS API.
     * Uses the JS API directly to avoid binary resolution issues on Windows.
     *
     * @returns {Promise<void>}
     */
    async generateAllureReport() {

        try {

            // allure-commandline is CommonJS -- createRequire is needed
            // to import it from an ES module context
            const require   = createRequire(import.meta.url)
            const allureCli = require('allure-commandline')

            const generation = allureCli([
                'generate',
                this.execution.allureResultsDir,
                '--clean',
                '--output',
                this.execution.allureReportDir
            ])

            await new Promise((resolve, reject) => {
                generation.on('exit', code => {
                    code === 0
                        ? resolve()
                        : reject(new Error(
                            `Allure report generation failed with exit code ${code}.`
                          ))
                })
            })

        } catch (error) {
            console.error(`[FrameworkReporter] Allure generation error: ${error.message}`)
        }

    }

    /**
     * FrameworkReporter does not print to stdio.
     * Allows Playwright to use its own terminal reporter alongside this one.
     */
    printsToStdio() {
        return false
    }

}