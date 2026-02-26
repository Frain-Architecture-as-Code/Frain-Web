import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    /* Run tests sequentially — flows depend on each other */
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3001",
        trace: "on-first-retry",
        /* Give server actions time to resolve */
        actionTimeout: 15_000,
        navigationTimeout: 15_000,
    },
    /* Only test on Chromium for speed during development */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    /* Expect the dev server to already be running on :3001 */
    expect: {
        timeout: 10_000,
    },
});
