import { test, expect }  from '../../../fixtures/framework.fixture.js'
import LoginPage         from '../../../pages/ui/automation-exercise/LoginPage.js'

test('Verify user can login successfully', async ({ page, reporter, logger }) => {

    const loginPage = new LoginPage(page, logger)

    await reporter.step('Navigate to Home Page', async () => {
        await loginPage.open()
        await reporter.screenshot('Home Page')
    })

    await reporter.step('Navigate to Login Page', async () => {
        await loginPage.navigateToLogin()
        await reporter.screenshot('Login Page')
    })

    await reporter.step('Enter Credentials', async () => {
        await loginPage.login('user@example.com', 'password123')
        await reporter.screenshot('Credentials Entered')
    })

    await reporter.step('Verify Login Successful', async () => {
        await loginPage.verifyLoginSuccessful()
        await reporter.screenshot('Login Successful')
    })

})