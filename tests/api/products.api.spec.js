// tests/api/automation-exercise/products.api.spec.js

import { readFileSync }           from 'node:fs'
// import { join }                   from 'node:path'
import { apiTest as test, expect } from '../../fixtures/framework.fixture.js'
import ProductService              from '../../api/ProductService.js'

const productSchema = {
    id:       'number',
    name:     'string',
    price:    'string',
    brand:    'string',
    category: 'object'
}

test.describe('Products API', () => {

    test('GET all products returns 200 with product list', async ({
        apiClient,
        apiAssertions,
        logger
    }, testInfo) => {

        const productService = new ProductService(apiClient, logger)
        let response

        await test.step('GET all products from API', async () => {

            response = await productService.getAllProducts()

            // Attach response to report
            await testInfo.attach('API Response', {
                body:        JSON.stringify(response.toJSON(), null, 2),
                contentType: 'application/json'
            })

        })

        await test.step('Verify response status is 200', async () => {
            apiAssertions.toHaveStatus(response, 200)
            apiAssertions.toBeSuccessful(response)
        })

        await test.step('Verify response time is acceptable', async () => {
            apiAssertions.toRespondWithin(response, 5000)
        })

        await test.step('Verify products array is not empty', async () => {
            apiAssertions.toHaveNonEmptyArray(response, 'products')
        })

        await test.step('Verify first product matches schema', async () => {
            const firstProduct = response.getValue('products.0')
            apiAssertions.toMatchSchema(
                { body: firstProduct },
                productSchema,
                'products[0]'
            )
        })

        await test.step('Log total product count', async () => {
            const count = response.arrayLength('products')
            logger.info(`Total products found: ${count}`)
        })

    })

})