// TestUtility.js

import { test } from "@playwright/test";

export async function executeStep() {

    await test.step("Utility Step", async () => {

        console.log("Hello");

    });

}

export async function attachFile() {

    await test.info().attach("Message", {

        body: "Hello",

        contentType: "text/plain"

    });

}