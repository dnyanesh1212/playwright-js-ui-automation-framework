import Actions from './Actions.js';
import Assertions from './Assertions.js';

export default class BasePage {

    constructor(page) {

        this.page = page;

        this.actions = new Actions(page);
        this.assert = new Assertions(page);

    }

}