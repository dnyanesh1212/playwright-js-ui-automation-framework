/**
 * Represents a single framework execution session.
 *
 * Responsibilities:
 * - Hold execution metadata
 * - Hold execution artifact root directories
 * - Provide immutable execution information
 *
 * Non Responsibilities:
 * - Creating folders
 * - Reading/Writing files
 * - Logging
 * - Reporting
 * - Screenshot capture
 * - Attachment handling
 */
export default class ExecutionContext {

    constructor({

        // Execution
        executionId,
        executionName,

        // Application
        application,
        environment,

        // Execution Configuration
        browser,
        workers,
        headed,

        // Timing
        startTime,
        endTime,

        // Execution Root Directories
        executionRoot,
        playwrightReportRoot,
        allureResultsRoot,
        allureReportRoot,
        artifactsRoot,
        logsRoot,

        // Test Information
        testCount,

        // Environment Information
        frameworkVersion,
        nodeVersion,
        platform,
        command

    }) {

        // Execution
        this.executionId = executionId;
        this.executionName = executionName;

        // Application
        this.application = application;
        this.environment = environment;

        // Execution Configuration
        this.browser = browser;
        this.workers = workers;
        this.headed = headed;

        // Timing
        this.startTime = startTime;
        this.endTime = endTime;

        // Execution Root Directories
        this.executionRoot = executionRoot;
        this.playwrightReportRoot = playwrightReportRoot;
        this.allureResultsRoot = allureResultsRoot;
        this.allureReportRoot = allureReportRoot;
        this.artifactsRoot = artifactsRoot;
        this.logsRoot = logsRoot;

        // Test Information
        this.testCount = testCount;

        // Environment Information
        this.frameworkVersion = frameworkVersion;
        this.nodeVersion = nodeVersion;
        this.platform = platform;
        this.command = command;

        Object.freeze(this);

    }

}