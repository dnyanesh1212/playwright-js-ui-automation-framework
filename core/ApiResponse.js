/**
 * Wrapper around a raw Playwright API response.
 * Provides a consistent interface and helper methods.
 */
export default class ApiResponse {

    /**
     * @param {object} options
     * @param {number}      options.status
     * @param {boolean}     options.ok
     * @param {object}      options.headers
     * @param {object|null} options.body
     * @param {string}      options.text
     * @param {number}      options.time
     */
    constructor({ status, ok, headers, body, text, time }) {

        this.status  = status
        this.ok      = ok
        this.headers = headers
        this.body    = body
        this.text    = text
        this.time    = time

    }

    // ── Status helpers ────────────────────────────────────────────────

    isOk() {
        return this.ok
    }

    hasStatus(status) {
        return this.status === status
    }

    hasStatusIn(statuses) {
        return statuses.includes(this.status)
    }

    // ── Body helpers ──────────────────────────────────────────────────

    json() {
        return this.body
    }

    rawText() {
        return this.text
    }

    /**
     * Gets a nested value from body using dot notation.
     * Example: response.getValue('products.0.name')
     */
    getValue(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.body)
    }

    hasProperty(path) {
        return this.getValue(path) !== undefined
    }

    propertyEquals(path, expected) {
        return this.getValue(path) === expected
    }

    getArray(path = null) {
        const value = path ? this.getValue(path) : this.body
        return Array.isArray(value) ? value : null
    }

    arrayLength(path = null) {
        return this.getArray(path)?.length ?? 0
    }

    // ── Header helpers ────────────────────────────────────────────────

    getHeader(name) {
        return this.headers[name.toLowerCase()]
    }

    hasHeader(name) {
        return this.getHeader(name) !== undefined
    }

    contentType() {
        return this.getHeader('content-type')
    }

    // ── Performance helper ────────────────────────────────────────────

    respondedWithin(maxMs) {
        return this.time <= maxMs
    }

    // ── Debug helpers ─────────────────────────────────────────────────

    toString() {
        return `ApiResponse { status: ${this.status}, time: ${this.time}ms, ok: ${this.ok} }`
    }

    /**
     * Plain object for attaching to Allure / Playwright report.
     */
    toJSON() {
        return {
            status:  this.status,
            ok:      this.ok,
            time:    this.time,
            headers: this.headers,
            body:    this.body
        }
    }

}