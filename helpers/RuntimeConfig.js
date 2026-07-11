// helpers/RuntimeConfig.js

export async function loadRuntimeConfig() {

    // Application is mandatory
    const applicationName = process.env.APP;

    if (!applicationName) {

        throw new Error(`
Application name is required.

Example (PowerShell):

$env:APP="automation-exercise"
npx playwright test

Optional:

$env:ENV="qa"
`);

    }

    let applicationConfig;
    let environmentConfig;

    try {

        ({ default: applicationConfig } = await import(
            `../configs/applications/${applicationName}/config.js`
        ));

        ({ default: environmentConfig } = await import(
            `../configs/applications/${applicationName}/env.js`
        ));

    } catch {

        throw new Error(
            `Application '${applicationName}' does not exist.`
        );

    }

    // Resolve environment
    const environmentName =
        process.env.ENV ??
        applicationConfig.defaultEnv;

    const environment =
        environmentConfig[environmentName];

    if (!environment) {

        throw new Error(
            `Environment '${environmentName}' does not exist for application '${applicationName}'.`
        );

    }

    return Object.freeze({

        app: applicationConfig,

        env: Object.freeze({

            name: environmentName,

            ...environment

        })

    });

}