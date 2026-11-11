/**
 * API service for user account operations.
 *
 * Responsibilities:
 *   - Encapsulate all user-related API endpoints
 *   - Build request payloads
 *   - Return ApiResponse for assertions in tests
 *
 * Non-responsibilities:
 *   - Assertions (tests handle this)
 *   - Test steps (Reporter handles this)
 *   - Logging (ApiClient handles this)
 */
export default class UserService {

    /**
     * @param {import('../../../core/ApiClient.js').default} apiClient
     * @param {import('../../../core/Logger.js').default} logger
     */
    constructor(apiClient, logger) {

        this.apiClient = apiClient
        this.logger    = logger
        this.endpoint  = '/api'

    }

    /**
     * Creates a new user account.
     *
     * POST /api/createAccount
     * Expected response: 201 { message: 'User created!' }
     *
     * @param {object} userData
     * @param {string} userData.name
     * @param {string} userData.email
     * @param {string} userData.password
     * @param {string} userData.title
     * @param {string} userData.birth_date
     * @param {string} userData.birth_month
     * @param {string} userData.birth_year
     * @param {string} userData.firstname
     * @param {string} userData.lastname
     * @param {string} userData.company
     * @param {string} userData.address1
     * @param {string} userData.address2
     * @param {string} userData.country
     * @param {string} userData.zipcode
     * @param {string} userData.state
     * @param {string} userData.city
     * @param {string} userData.mobile_number
     * @returns {Promise<import('../../../core/ApiResponse.js').default>}
     */
    async createAccount(userData) {
        this.logger.info(`UserService -- createAccount -- ${userData.email}`)
        return this.apiClient.post(`${this.endpoint}/createAccount`, userData)
    }

    /**
     * Updates an existing user account.
     *
     * PUT /api/updateAccount
     * Expected response: 200 { message: 'User updated!' }
     *
     * @param {object} userData
     * @returns {Promise<import('../../../core/ApiResponse.js').default>}
     */
    async updateAccount(userData) {
        this.logger.info(`UserService -- updateAccount -- ${userData.email}`)
        return this.apiClient.put(`${this.endpoint}/updateAccount`, userData)
    }

    /**
     * Deletes a user account.
     *
     * DELETE /api/deleteAccount
     * Expected response: 200 { message: 'Account deleted!' }
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<import('../../../core/ApiResponse.js').default>}
     */
    async deleteAccount(email, password) {
        this.logger.info(`UserService -- deleteAccount -- ${email}`)
        return this.apiClient.delete(`${this.endpoint}/deleteAccount`, {
            data: { email, password }
        })
    }

}