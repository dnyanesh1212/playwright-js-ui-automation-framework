/**
 * API assertion wrappers.
 *
 * Responsibilities:
 *   - Assert HTTP response properties
 *   - Assert response body values
 *   - Assert response schema (structure + types)
 *   - Assert response time
 *   - Log pass/fail via Logger
 *
 * Non-responsibilities:
 *   - Making HTTP requests (ApiClient handles this)
 *   - Creating test steps (Reporter handles this)
 */
export default class ApiAssertions {

    /**
     * @param {import('./Logger.js').default} logger
     */
    constructor(logger) {
        this.logger = logger
    }

    // ── Core wrapper ──────────────────────────────────────────────────────────

    /**
     * @param {string} assertionName
     * @param {string} description
     * @param {() => void} assertion
     */
    perform(assertionName, description, assertion) {

        try {
            assertion()
            this.logger.info(`PASS -- ${assertionName} -- ${description}`)
        } catch (error) {
            this.logger.error(`FAIL -- ${assertionName} -- ${description} -- ${error.message}`)
            throw error
        }

    }

    // ── Status Assertions ─────────────────────────────────────────────────────

    /**
     * Asserts response status code matches expected.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {number} expected
     */
    toHaveStatus(response, expected) {
        this.perform(
            'toHaveStatus',
            `Expected ${expected} got ${response.status}`,
            () => {
                if (response.status !== expected) {
                    throw new Error(
                        `Expected status ${expected} but got ${response.status}.\n` +
                        `Response body: ${JSON.stringify(response.body)}`
                    )
                }
            }
        )
    }

    /**
     * Asserts response is successful (status 200-299).
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     */
    toBeSuccessful(response) {
        this.perform(
            'toBeSuccessful',
            `Status ${response.status} should be 2xx`,
            () => {
                if (!response.ok) {
                    throw new Error(
                        `Expected successful response (2xx) but got ${response.status}.`
                    )
                }
            }
        )
    }

    /**
     * Asserts response status is in list of expected codes.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {number[]} statusCodes
     */
    toHaveStatusIn(response, statusCodes) {
        this.perform(
            'toHaveStatusIn',
            `Status ${response.status} should be in [${statusCodes.join(', ')}]`,
            () => {
                if (!statusCodes.includes(response.status)) {
                    throw new Error(
                        `Expected status to be one of [${statusCodes.join(', ')}] ` +
                        `but got ${response.status}.`
                    )
                }
            }
        )
    }

    // ── Body Assertions ───────────────────────────────────────────────────────

    /**
     * Asserts response body has a property with expected value.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {string} property  -- supports dot notation e.g. 'user.name'
     * @param {*} expected
     */
    toHaveBodyProperty(response, property, expected) {
        this.perform(
            'toHaveBodyProperty',
            `body.${property} === ${JSON.stringify(expected)}`,
            () => {
                const actual = this.getNestedValue(response.body, property)

                if (actual === undefined) {
                    throw new Error(
                        `Property "${property}" not found in response body.\n` +
                        `Body: ${JSON.stringify(response.body)}`
                    )
                }

                if (actual !== expected) {
                    throw new Error(
                        `Expected body.${property} to be ${JSON.stringify(expected)} ` +
                        `but got ${JSON.stringify(actual)}.`
                    )
                }
            }
        )
    }

    /**
     * Asserts response body contains a property (value not checked).
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {string} property  -- supports dot notation
     */
    toHaveBodyKey(response, property) {
        this.perform(
            'toHaveBodyKey',
            `body should have property "${property}"`,
            () => {
                const actual = this.getNestedValue(response.body, property)

                if (actual === undefined) {
                    throw new Error(
                        `Property "${property}" not found in response body.\n` +
                        `Body: ${JSON.stringify(response.body)}`
                    )
                }
            }
        )
    }

    /**
     * Asserts response body array has expected length.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {number} expected
     * @param {string} [arrayPath]  -- dot notation to array property
     */
    toHaveArrayLength(response, expected, arrayPath = null) {
        this.perform(
            'toHaveArrayLength',
            `Array length should be ${expected}`,
            () => {
                const arr = arrayPath
                    ? this.getNestedValue(response.body, arrayPath)
                    : response.body

                if (!Array.isArray(arr)) {
                    throw new Error(
                        `Expected an array${arrayPath ? ` at "${arrayPath}"` : ''} ` +
                        `but got ${typeof arr}.`
                    )
                }

                if (arr.length !== expected) {
                    throw new Error(
                        `Expected array length ${expected} but got ${arr.length}.`
                    )
                }
            }
        )
    }

    /**
     * Asserts response body array is not empty.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {string} [arrayPath]
     */
    toHaveNonEmptyArray(response, arrayPath = null) {
        this.perform(
            'toHaveNonEmptyArray',
            'Array should not be empty',
            () => {
                const arr = arrayPath
                    ? this.getNestedValue(response.body, arrayPath)
                    : response.body

                if (!Array.isArray(arr)) {
                    throw new Error(`Expected an array but got ${typeof arr}.`)
                }

                if (arr.length === 0) {
                    throw new Error('Expected non-empty array but got empty array.')
                }
            }
        )
    }

    // ── Header Assertions ─────────────────────────────────────────────────────

    /**
     * Asserts response has a specific header.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {string} header   -- case insensitive
     * @param {string} [value]  -- optional value check
     */
    toHaveHeader(response, header, value = null) {
        this.perform(
            'toHaveHeader',
            `Header "${header}"${value ? ` = "${value}"` : ''}`,
            () => {
                const actual = response.headers[header.toLowerCase()]

                if (actual === undefined) {
                    throw new Error(
                        `Header "${header}" not found in response.\n` +
                        `Headers: ${JSON.stringify(response.headers)}`
                    )
                }

                if (value !== null && !actual.includes(value)) {
                    throw new Error(
                        `Expected header "${header}" to contain "${value}" ` +
                        `but got "${actual}".`
                    )
                }
            }
        )
    }

    /**
     * Asserts Content-Type header.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {string} [expected]  -- defaults to 'application/json'
     */
    toHaveContentType(response, expected = 'application/json') {
        this.toHaveHeader(response, 'content-type', expected)
    }

    // ── Performance Assertions ────────────────────────────────────────────────

    /**
     * Asserts response time is within acceptable limit.
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {number} maxMs   -- maximum allowed response time in ms
     */
    toRespondWithin(response, maxMs) {
        this.perform(
            'toRespondWithin',
            `Response time ${response.time}ms should be <= ${maxMs}ms`,
            () => {
                if (response.time > maxMs) {
                    throw new Error(
                        `Expected response within ${maxMs}ms ` +
                        `but took ${response.time}ms.`
                    )
                }
            }
        )
    }

    // ── Schema Validation ─────────────────────────────────────────────────────

    /**
     * Validates response body matches expected schema.
     * Schema defines property names and their expected types.
     * No extra library needed -- uses built-in typeof checks.
     *
     * Supported types:
     *   'string', 'number', 'boolean', 'array', 'object', 'null', 'any'
     *
     * Mark optional fields with '?': { field: '?string' }
     *
     * Example schema:
     * {
     *   id:      'number',
     *   name:    'string',
     *   email:   'string',
     *   active:  'boolean',
     *   tags:    'array',
     *   address: 'object',
     *   note:    '?string'   // optional
     * }
     *
     * @param {import('./ApiClient.js').ApiResponse} response
     * @param {object} schema
     * @param {string} [path]  -- internal, for nested validation
     */
    toMatchSchema(response, schema, path = 'body') {

        const body = response.body

        if (!body) {
            this.logger.error('FAIL -- toMatchSchema -- Response body is null or empty')
            throw new Error('Response body is null or empty.')
        }

        const errors = this.validateSchema(body, schema, path)

        if (errors.length > 0) {
            const message = `Schema validation failed:\n${errors.join('\n')}`
            this.logger.error(`FAIL -- toMatchSchema -- ${errors.length} error(s) found`)
            throw new Error(message)
        }

        this.logger.info(`PASS -- toMatchSchema -- Schema valid (${Object.keys(schema).length} fields)`)

    }

    /**
     * Validates an object against a schema definition.
     * Returns array of error messages.
     *
     * @param {object} obj
     * @param {object} schema
     * @param {string} path
     * @returns {string[]}
     */
    validateSchema(obj, schema, path) {

        const errors = []

        for (const [key, expectedType] of Object.entries(schema)) {

            const isOptional = expectedType.startsWith('?')
            const type       = isOptional ? expectedType.slice(1) : expectedType
            const fieldPath  = `${path}.${key}`
            const value      = obj?.[key]

            // Optional field -- skip if not present
            if (isOptional && (value === undefined || value === null)) {
                continue
            }

            // Required field -- must exist
            if (!isOptional && (value === undefined || value === null)) {
                errors.push(`  MISSING  "${fieldPath}" -- expected ${type}, got undefined`)
                continue
            }

            // Type check
            const actualType = Array.isArray(value) ? 'array' : typeof value

            if (type === 'any') continue

            if (type === 'null') {
                if (value !== null) {
                    errors.push(`  TYPE     "${fieldPath}" -- expected null, got ${actualType}`)
                }
                continue
            }

            if (type === 'array' && !Array.isArray(value)) {
                errors.push(`  TYPE     "${fieldPath}" -- expected array, got ${actualType}`)
                continue
            }

            if (type !== 'array' && type !== 'null' && actualType !== type) {
                errors.push(`  TYPE     "${fieldPath}" -- expected ${type}, got ${actualType}`)
            }

        }

        return errors

    }

    // ── Utility ───────────────────────────────────────────────────────────────

    /**
     * Gets a nested value from an object using dot notation.
     * Example: getNestedValue(obj, 'user.address.city')
     *
     * @param {object} obj
     * @param {string} path
     * @returns {*}
     */
    getNestedValue(obj, path) {

        return path.split('.').reduce((current, key) => {
            return current?.[key]
        }, obj)

    }

}