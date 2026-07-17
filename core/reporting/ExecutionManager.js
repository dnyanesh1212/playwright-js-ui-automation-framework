import fs from "node:fs";
import path from "node:path";

import ExecutionContext from "./ExecutionContext.js";

export default class ExecutionManager {

    /**
     * Starts a new execution session.
     *
     * @param {object} runtimeConfig
     * @param {import('@playwright/test/reporter').FullConfig} config
     * @param {import('@playwright/test/reporter').Suite} suite
     *
     * @returns {Promise<ExecutionContext>}
     */
    static async start(runtimeConfig, config, suite) {

        const startTime = new Date();

        const executionName =
            this.formatTimestamp(startTime);

        const executionRoot =
            path.join(
                process.cwd(),
                "reports",
                runtimeConfig.app.name,
                executionName
            );

        const executionFilePath =
            path.join(
                executionRoot,
                "execution.json"
            );

        const playwrightReportRoot =
            path.join(
                executionRoot,
                "playwright"
            );

        const allureResultsRoot =
            path.join(
                executionRoot,
                "allure-results"
            );

        const allureReportRoot =
            path.join(
                executionRoot,
                "allure-report"
            );

        const artifactsRoot =
            path.join(
                executionRoot,
                "artifacts"
            );

        const logsRoot =
            path.join(
                executionRoot,
                "logs"
            );

        [
            executionRoot,
            playwrightReportRoot,
            allureResultsRoot,
            allureReportRoot,
            artifactsRoot,
            logsRoot

        ].forEach(directory => {

            fs.mkdirSync(directory, {

                recursive: true

            });

        });

        const executionContext = new ExecutionContext({

            // Execution
            executionId: executionName,
            executionName,

            // Application
            application: runtimeConfig.app.name,
            environment: runtimeConfig.env.name,

            // Execution Configuration
            browser: config.projects
                .map(project => project.name)
                .join(", "),

            workers: config.workers,
            headed: !config.projects[0].use.headless,

            // Timing
            startTime,
            endTime: null,

            // Execution Root Directories
            executionRoot,
            executionFilePath,
            playwrightReportRoot,
            allureResultsRoot,
            allureReportRoot,
            artifactsRoot,
            logsRoot,

            // Test Information
            testCount: suite.allTests().length,

            // Environment Information
            frameworkVersion: "1.0.0",
            nodeVersion: process.version,
            platform: process.platform,
            command: process.argv.join(" ")

        });

        this.writeExecutionFile(executionContext);

        return executionContext;

    }

    /**
     * Completes an execution session.
     *
     * @param {ExecutionContext} executionContext
     * @param {import('@playwright/test/reporter').FullResult} result
     */
    static async finish(executionContext, result) {

        this.updateExecutionFile(
            executionContext,
            result
        );

    }

    /**
     * Creates execution.json.
     *
     * @param {ExecutionContext} executionContext
     */
    static writeExecutionFile(executionContext) {

        const execution = {

            executionId: executionContext.executionId,
            executionName: executionContext.executionName,

            status: "RUNNING",

            application: executionContext.application,
            environment: executionContext.environment,

            browser: executionContext.browser,
            workers: executionContext.workers,
            headed: executionContext.headed,

            testCount: executionContext.testCount,

            startTime: executionContext.startTime,
            endTime: null,
            duration: null,

            frameworkVersion: executionContext.frameworkVersion,
            nodeVersion: executionContext.nodeVersion,
            platform: executionContext.platform,
            command: executionContext.command

        };

        fs.writeFileSync(

            executionContext.executionFilePath,

            JSON.stringify(
                execution,
                null,
                4
            )

        );

    }

    /**
     * Updates execution.json.
     *
     * @param {ExecutionContext} executionContext
     * @param {import('@playwright/test/reporter').FullResult} result
     */
    static updateExecutionFile(executionContext, result) {

        const execution = JSON.parse(

            fs.readFileSync(

                executionContext.executionFilePath,

                "utf8"

            )

        );

        const endTime = new Date();

        execution.status = "COMPLETED";
        execution.endTime = endTime;
        execution.duration =
            endTime.getTime() -
            new Date(execution.startTime).getTime();

        fs.writeFileSync(

            executionContext.executionFilePath,

            JSON.stringify(
                execution,
                null,
                4
            )

        );

    }

    /**
     * Formats execution timestamp.
     *
     * Example:
     * 2026-07-13_18-45-12
     *
     * @param {Date} date
     * @returns {string}
     */
    static formatTimestamp(date) {

        const pad = value =>
            String(value).padStart(2, "0");

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;

    }

}