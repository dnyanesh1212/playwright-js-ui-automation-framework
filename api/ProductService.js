/**
 * API service for product operations.
 *
 * Responsibilities:
 *   - Encapsulate all product-related API endpoints
 *   - Return ApiResponse for assertions in tests
 *
 * Non-responsibilities:
 *   - Assertions (tests handle this)
 *   - Test steps (Reporter handles this)
 */
export default class ProductService {

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
     * Gets all products.
     *
     * GET /api/productsList
     * Expected response: 200 { products: [...] }
     *
     * @returns {Promise<import('../../../core/ApiResponse.js').default>}
     */
    async getAllProducts() {
        this.logger.info('ProductService -- getAllProducts')
        return this.apiClient.get(`${this.endpoint}/productsList`)
    }

}