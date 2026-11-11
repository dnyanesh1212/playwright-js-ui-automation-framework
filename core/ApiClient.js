import ApiResponse from './ApiResponse.js'
/**
 * HTTP API client for Playwright-based API automation.
 *
 * Responsibilities:
 *   - Perform HTTP requests (GET, POST, PUT, PATCH, DELETE)
 *   - Handle authentication (Bearer, Basic, API Key)
 *   - Log every request and response
 *   - Return consistent response wrapper object
 *   - Retry on server errors
 *
 * Non-responsibilities:
 *   - Assertions (ApiAssertions handles this)
 *   - Test steps (Reporter handles this)
 *   - Schema validation (ApiAssertions handles this)
 */
export default class ApiClient {

    /**
     * @param {import('@playwright/test').APIRequestContext} request
     * @param {import('./Logger.js').default} logger
     */
    constructor(request, logger) {

        this.request = request
        this.logger = logger
        this.auth = null
        this.baseURL = process.env.API_BASE_URL ?? process.env.BASE_URL ?? ''

    }

    // ── Authentication ────────────────────────────────────────────────────────

    /**
     * Sets authentication for all subsequent requests.
     *
     * @param {object} auth
     * @param {'bearer'|'basic'|'apikey'|'none'} auth.type
     * @param {string} [auth.token]        -- for bearer
     * @param {string} [auth.username]     -- for basic
     * @param {string} [auth.password]     -- for basic
     * @param {string} [auth.key]          -- for apikey header name
     * @param {string} [auth.value]        -- for apikey header value
     */
    setAuth(auth) {
        this.auth = auth
        this.logger.info(`AUTH SET -- type: ${auth.type}`)
    }

    /**
     * Clears authentication.
     */
    clearAuth() {
        this.auth = null
        this.logger.info('AUTH CLEARED')
    }

    // ── HTTP Methods ──────────────────────────────────────────────────────────

    /**
     * Performs a GET request.
     *
     * @param {string} endpoint
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {object} [options.params]
     * @param {number} [options.timeout]
     * @param {number} [options.retries]
     * @returns {Promise<ApiResponse>}
     */
    async get(endpoint, options = {}) {
        return this.send('GET', endpoint, options)
    }

    /**
     * Performs a POST request.
     *
     * @param {string} endpoint
     * @param {object} [body]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {number} [options.timeout]
     * @param {number} [options.retries]
     * @returns {Promise<ApiResponse>}
     */
    async post(endpoint, body = {}, options = {}) {
        return this.send('POST', endpoint, { ...options, data: body })
    }

    /**
     * Performs a PUT request.
     *
     * @param {string} endpoint
     * @param {object} [body]
     * @param {object} [options]
     * @returns {Promise<ApiResponse>}
     */
    async put(endpoint, body = {}, options = {}) {
        return this.send('PUT', endpoint, { ...options, data: body })
    }

    /**
     * Performs a PATCH request.
     *
     * @param {string} endpoint
     * @param {object} [body]
     * @param {object} [options]
     * @returns {Promise<ApiResponse>}
     */
    async patch(endpoint, body = {}, options = {}) {
        return this.send('PATCH', endpoint, { ...options, data: body })
    }

    /**
     * Performs a DELETE request.
     *
     * @param {string} endpoint
     * @param {object} [options]
     * @returns {Promise<ApiResponse>}
     */
    async delete(endpoint, options = {}) {
        return this.send('DELETE', endpoint, options)
    }

    // ── Core Send Method ──────────────────────────────────────────────────────

    /**
     * Core HTTP request method with logging, auth, and retry support.
     *
     * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} method
     * @param {string} endpoint
     * @param {object} options
     * @returns {Promise<ApiResponse>}
     */
    // async send(method, endpoint, options = {}) {

    //     const url      = this.resolveURL(endpoint)
    //     const headers  = this.buildHeaders(options.headers ?? {})
    //     const retries  = options.retries ?? 0
    //     const retryOn  = options.retryOn ?? [500, 502, 503, 504]

    //     // Log request
    //     this.logRequest(method, url, headers, options.data)

    //     let lastError
    //     let attempt = 0

    //     while (attempt <= retries) {

    //         if (attempt > 0) {
    //             this.logger.warning(`RETRY ${attempt}/${retries} -- ${method} ${url}`)
    //         }

    //         try {

    //             const startTime = Date.now()

    //             const rawResponse = await this.request[method.toLowerCase()](url, {
    //                 headers,
    //                 data:    options.data,
    //                 params:  options.params,
    //                 timeout: options.timeout ?? 30_000
    //             })

    //             const responseTime = Date.now() - startTime
    //             const response     = await this.buildResponse(rawResponse, responseTime)

    //             // Retry on configured status codes
    //             if (attempt < retries && retryOn.includes(response.status)) {
    //                 attempt++
    //                 continue
    //             }

    //             // Log response
    //             this.logResponse(response)

    //             return response

    //         } catch (error) {
    //             lastError = error
    //             attempt++

    //             if (attempt > retries) {
    //                 this.logger.error(`REQUEST FAILED -- ${method} ${url} -- ${error.message}`)
    //                 throw error
    //             }
    //         }

    //     }

    //     throw lastError

    // }

    // ── Helpers ───────────────────────────────────────────────────────────────

    async send(method, endpoint, options = {}) {

        const url = this.resolveURL(endpoint)
        const headers = this.buildHeaders(options.headers ?? {})
        const retries = options.retries ?? 0
        const retryOn = options.retryOn ?? [500, 502, 503, 504]

        this.logRequest(method, url, headers, options.data)

        let lastError
        let attempt = 0

        while (attempt <= retries) {

            if (attempt > 0) {
                this.logger.warning(`RETRY ${attempt}/${retries} -- ${method} ${url}`)
            }

            try {

                const startTime = Date.now()

                // Playwright request options
                const requestOptions = {
                    headers,
                    timeout: options.timeout ?? 30_000
                }

                // data supported for POST, PUT, PATCH, DELETE
                if (options.data !== undefined) {
                    requestOptions.data = options.data
                }

                // params supported for GET
                if (options.params !== undefined) {
                    requestOptions.params = options.params
                }

                const rawResponse = await this.request[method.toLowerCase()](
                    url,
                    requestOptions
                )

                const responseTime = Date.now() - startTime
                const response = await this.buildResponse(rawResponse, responseTime)

                if (attempt < retries && retryOn.includes(response.status)) {
                    attempt++
                    continue
                }

                this.logResponse(response)

                return response

            } catch (error) {
                lastError = error
                attempt++

                if (attempt > retries) {
                    this.logger.error(`REQUEST FAILED -- ${method} ${url} -- ${error.message}`)
                    throw error
                }
            }

        }

        throw lastError

    }
    /**
     * Resolves full URL from endpoint.
     * If endpoint starts with http, use as-is.
     *
     * @param {string} endpoint
     * @returns {string}
     */
    resolveURL(endpoint) {
        return endpoint.startsWith('http')
            ? endpoint
            : `${this.baseURL}${endpoint}`
    }

    /**
     * Builds request headers including auth and defaults.
     *
     * @param {object} extraHeaders
     * @returns {object}
     */
    buildHeaders(extraHeaders = {}) {

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...extraHeaders
        }

        if (!this.auth || this.auth.type === 'none') {
            return headers
        }

        switch (this.auth.type) {

            case 'bearer':
                headers['Authorization'] = `Bearer ${this.auth.token}`
                break

            case 'basic': {
                const encoded = Buffer.from(
                    `${this.auth.username}:${this.auth.password}`
                ).toString('base64')
                headers['Authorization'] = `Basic ${encoded}`
                break
            }

            case 'apikey':
                headers[this.auth.key] = this.auth.value
                break

        }

        return headers

    }

    /**
     * Builds a consistent response wrapper object.
     *
     * @param {import('@playwright/test').APIResponse} rawResponse
     * @param {number} responseTime
     * @returns {Promise<ApiResponse>}
     */
async buildResponse(rawResponse, responseTime) {

    let body = null
    let text = ''

    try {
        text = await rawResponse.text()
        body = JSON.parse(text)
    } catch {
        body = null
    }

    return new ApiResponse({
        status:  rawResponse.status(),
        ok:      rawResponse.ok(),
        headers: rawResponse.headers(),
        body,
        text,
        time:    responseTime
    })

}

    /**
     * Logs request details.
     * Masks sensitive fields (password, token, authorization).
     *
     * @param {string} method
     * @param {string} url
     * @param {object} headers
     * @param {object} [body]
     */
    logRequest(method, url, headers, body) {

        this.logger.info(`REQUEST  -- ${method} ${url}`)
        this.logger.debug(`HEADERS  -- ${JSON.stringify(this.maskSensitive(headers))}`)

        if (body) {
            this.logger.debug(`PAYLOAD  -- ${JSON.stringify(this.maskSensitive(body))}`)
        }

    }

    /**
     * Logs response details.
     *
     * @param {ApiResponse} response
     */
    logResponse(response) {

        const status = `${response.status} (${response.time}ms)`

        this.logger.info(`RESPONSE -- ${status}`)

        if (response.body) {
            this.logger.debug(`BODY     -- ${JSON.stringify(this.maskSensitive(response.body))}`)
        }

    }

    /**
     * Masks sensitive fields in objects for safe logging.
     * Fields: password, token, authorization, secret, apikey, api_key
     *
     * @param {object} obj
     * @returns {object}
     */
    maskSensitive(obj) {

        if (!obj || typeof obj !== 'object') return obj

        const sensitiveKeys = [
            'password', 'token', 'authorization',
            'secret', 'apikey', 'api_key', 'access_token',
            'refresh_token', 'private_key'
        ]

        const masked = { ...obj }

        for (const key of Object.keys(masked)) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                masked[key] = '***'
            }
        }

        return masked

    }

}

/**
 * @typedef {object} ApiResponse
 * @property {number}  status       -- HTTP status code
 * @property {boolean} ok           -- true if status 200-299
 * @property {object}  headers      -- response headers
 * @property {object|null} body     -- parsed JSON body
 * @property {string}  text         -- raw response text
 * @property {number}  time         -- response time in ms
 */