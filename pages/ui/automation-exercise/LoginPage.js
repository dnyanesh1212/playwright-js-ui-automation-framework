import BasePage from '../../../core/BasePage.js';
import logger from '../../../core/Logger.js';

export default class LoginPage extends BasePage {

    constructor(page, logger) {

        super(page, logger);

        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.emailTextbox = page.locator('[data-qa="login-email"]');
        this.passwordTextbox = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');
        this.logoutButton = page.getByRole('link', { name: 'Logout' });

    }

    async open() {

        await this.page.goto('/');
        this.logger.info(`Navigated to / -- ${this.page.url()}`);

    }

    async verifyHomePageLoaded() {

        await this.assert.toBeVisible(this.signupLoginLink, { timeout: 30000 });
        await this.assert.toHaveURL('/', { timeout: 30000 });

    }

    async navigateToLogin() {

        await this.actions.click(this.signupLoginLink, { timeout: 30000 });

    }

    async verifyLoginPageLoaded() {

        await this.assert.toBeVisible(this.emailTextbox, { timeout: 30000 });
        await this.assert.toBeVisible(this.passwordTextbox, { timeout: 30000 });
        await this.assert.toBeVisible(this.loginButton, { timeout: 30000 });

    }

    async login(email, password) {

        await this.actions.fill(this.emailTextbox, email, { timeout: 30000 });
        await this.actions.fill(this.passwordTextbox, password, { timeout: 30000 });
        await this.actions.click(this.loginButton, { exact: true });

    }

    async verifyLoginSuccessful() {

        await this.assert.toBeVisible(this.logoutButton, { timeout: 30000 });

    }

}