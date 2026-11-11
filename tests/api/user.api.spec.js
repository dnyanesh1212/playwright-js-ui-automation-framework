// tests/api/automation-exercise/user.api.spec.js

import { readFileSync }            from 'node:fs'
import { join }                    from 'node:path'
import { apiTest as test, expect } from '../../fixtures/framework.fixture.js'
import UserService                 from '../../api/UserService.js'

const rawData = JSON.parse(
    readFileSync(
        join(process.cwd(), 'test-data', 'api', 'userData.json'),
        'utf-8'
    )
)

const uniqueEmail = () => `testuser_${Date.now()}@example.com`

test.describe('User Account API', () => {

    test('POST create user account returns 201', async ({
        apiClient,
        apiAssertions,
        logger
    }, testInfo) => {

        const userService = new UserService(apiClient, logger)
        const userData    = { ...rawData.newUser, email: uniqueEmail() }
        let response

        await test.step('POST create new user account', async () => {

            // Attach request payload
            await testInfo.attach('Request Payload', {
                body:        JSON.stringify(userData, null, 2),
                contentType: 'application/json'
            })

            response = await userService.createAccount(userData)

            // Attach response
            await testInfo.attach('API Response', {
                body:        JSON.stringify(response.toJSON(), null, 2),
                contentType: 'application/json'
            })

        })

        await test.step('Verify account created successfully', async () => {
            apiAssertions.toHaveStatus(response, 201)
            apiAssertions.toHaveBodyProperty(response, 'message', 'User created!')
        })

        await test.step('Verify response time is acceptable', async () => {
            apiAssertions.toRespondWithin(response, 5000)
        })

        await test.step('Cleanup -- delete created account', async () => {
            const deleteResponse = await userService.deleteAccount(
                userData.email,
                userData.password
            )
            apiAssertions.toHaveStatus(deleteResponse, 200)
        })

    })

    test('PUT update user account returns 200', async ({
        apiClient,
        apiAssertions,
        logger
    }, testInfo) => {

        const userService = new UserService(apiClient, logger)
        const email       = uniqueEmail()
        const newUser     = { ...rawData.newUser,     email }
        const updated     = { ...rawData.updatedUser, email }
        let response

        await test.step('Setup -- create account to update', async () => {
            const createResponse = await userService.createAccount(newUser)
            apiAssertions.toHaveStatus(createResponse, 201)
        })

        await test.step('PUT update user account', async () => {

            await testInfo.attach('Request Payload', {
                body:        JSON.stringify(updated, null, 2),
                contentType: 'application/json'
            })

            response = await userService.updateAccount(updated)

            await testInfo.attach('API Response', {
                body:        JSON.stringify(response.toJSON(), null, 2),
                contentType: 'application/json'
            })

        })

        await test.step('Verify account updated successfully', async () => {
            apiAssertions.toHaveStatus(response, 200)
            apiAssertions.toHaveBodyProperty(response, 'message', 'User updated!')
        })

        await test.step('Verify response time is acceptable', async () => {
            apiAssertions.toRespondWithin(response, 5000)
        })

        await test.step('Cleanup -- delete account', async () => {
            const deleteResponse = await userService.deleteAccount(
                email,
                updated.password
            )
            apiAssertions.toHaveStatus(deleteResponse, 200)
        })

    })

    test('DELETE user account returns 200', async ({
        apiClient,
        apiAssertions,
        logger
    }, testInfo) => {

        const userService = new UserService(apiClient, logger)
        const email       = uniqueEmail()
        const newUser     = { ...rawData.newUser, email }
        let response

        await test.step('Setup -- create account to delete', async () => {
            const createResponse = await userService.createAccount(newUser)
            apiAssertions.toHaveStatus(createResponse, 201)
        })

        await test.step('DELETE user account', async () => {

            await testInfo.attach('Request Payload', {
                body:        JSON.stringify({ email, password: newUser.password }, null, 2),
                contentType: 'application/json'
            })

            response = await userService.deleteAccount(email, newUser.password)

            await testInfo.attach('API Response', {
                body:        JSON.stringify(response.toJSON(), null, 2),
                contentType: 'application/json'
            })

        })

        await test.step('Verify account deleted successfully', async () => {
            apiAssertions.toHaveStatus(response, 200)
            apiAssertions.toHaveBodyProperty(response, 'message', 'Account deleted!')
        })

        await test.step('Verify response time is acceptable', async () => {
            apiAssertions.toRespondWithin(response, 5000)
        })

    })

})