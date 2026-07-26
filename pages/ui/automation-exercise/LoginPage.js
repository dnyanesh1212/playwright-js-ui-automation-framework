import BasePage from '../../../core/BasePage.js';
import Logger from '../../../core/Logger.js';

export default class LoginPage extends BasePage {

    constructor(page, logger) {

        super(page, logger);

        this.signupLoginLink = page.getByRole('link', {
            name: 'Signup / Login'
        });

        this.emailTextbox = page.locator('[data-qa="login-email"]');

        this.passwordTextbox = page.locator('[data-qa="login-password"]');

        this.loginButton = page.locator('[data-qa="login-button"]');

        this.logoutButton = page.getByRole('link', {
            name: 'Logout'
        });

    }

    async open() {

        await this.page.goto('/');

    }

    async verifyHomePageLoaded() {

        await this.assert.toBeVisible(this.signupLoginLink);

        await this.assert.toHaveURL('/');

    }

    async navigateToLogin() {

        await this.actions.click(this.signupLoginLink);

    }

    async verifyLoginPageLoaded() {

        await this.assert.toBeVisible(this.emailTextbox);

        await this.assert.toBeVisible(this.passwordTextbox);

        await this.assert.toBeVisible(this.loginButton);

    }

    async login(email, password) {

        await this.actions.fill(this.emailTextbox, email);

        await this.actions.fill(this.passwordTextbox, password);

        await this.actions.click(this.loginButton);

    }

    async verifyLoginSuccessful() {

        await this.assert.toBeVisible(this.logoutButton);

    }

}