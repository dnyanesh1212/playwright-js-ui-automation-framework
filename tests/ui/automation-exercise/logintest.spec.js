import { test } from '@playwright/test';
import LoginPage from '../../../pages/ui/automation-exercise/LoginPage.js';

test('Verify user can login', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.verifyHomePageLoaded();

    await loginPage.navigateToLogin();

    await loginPage.verifyLoginPageLoaded();

    await loginPage.login('playwrightuser123@gmail.com','1234567890');

    await loginPage.verifyLoginSuccessful();

});