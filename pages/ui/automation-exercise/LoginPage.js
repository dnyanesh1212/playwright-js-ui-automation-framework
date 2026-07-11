// import BasePage from '../../../core/BasePage.js';

// export default class LoginPage extends BasePage {

//     constructor(page) {

//         super(page);

//         this.signupLoginLink = page.getByRole('link', {
//             name: 'Signup / Login'
//         });

//         this.emailTextbox = page.locator('[data-qa="login-email"]');

//         this.passwordTextbox = page.locator('[data-qa="login-password"]');

//         this.loginButton = page.locator('[data-qa="login-button"]');

//     }

//     async open() {

//         await this.page.goto('/');

//     }

//     async navigateToLogin() {

//         await this.actions.click(this.signupLoginLink);

//     }

//     async login(email, password) {

//         await this.actions.fill(this.emailTextbox, email);

//         await this.actions.fill(this.passwordTextbox, password);

//         await this.actions.click(this.loginButton);

//     }

// }


import BasePage from '../../../core/BasePage.js';

export default class LoginPage extends BasePage {

    constructor(page) {

        super(page);

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