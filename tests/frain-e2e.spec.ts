import { expect, type Page, test } from "@playwright/test";

/*
 * ──────────────────────────────────────────────────────────────────
 *  Frain E2E — Full integration flows
 *
 *  All 8 tests run in a single serial describe block so that
 *  a failure in Flow 1 prevents Flow 2 from running (Flow 2
 *  depends on the invitation created in Flow 1).
 *
 *  Flow 1 (User A — Owner):
 *    1.  Register User A
 *    2.  Create Organization
 *    3.  Create Project inside the org
 *    4.  Register User B (so the backend knows the user)
 *    5.  Invite User B as ADMIN
 *    6.  Create API Key selecting own user
 *    7.  Sign out User A
 *
 *  Flow 2 (User B — Invited ADMIN):
 *    8.  Sign out User B
 *
 *  NOTE: Invitation acceptance tests are skipped because the
 *  backend's PATCH /api/v1/invitations/{id}/accept endpoint
 *  returns 500 Internal Server Error. Once the backend bug is
 *  fixed, add tests for:
 *    - Accept invitation (via notification UI or API)
 *    - Verify User B has access to the organization
 * ──────────────────────────────────────────────────────────────────
 */

const TIMESTAMP = Date.now();

const USER_A = {
    name: "Alice Test",
    email: `alice.frain.${TIMESTAMP}@example.com`,
    password: "Test1234!",
};

const USER_B = {
    name: "Bob Test",
    email: `bob.frain.${TIMESTAMP}@example.com`,
    password: "Test1234!",
};

const ORG_NAME = `Test Org ${TIMESTAMP}`;

// Shared state captured during the serial run
let orgId: string;
let projectId: string;

// ─── Helpers ─────────────────────────────────────────────────────

async function registerUser(
    page: Page,
    user: { name: string; email: string; password: string },
): Promise<void> {
    await page.goto("/auth/register");

    await page.getByLabel("Name").fill(user.name);
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(user.password);
    await page.getByLabel("Confirm Password").fill(user.password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.waitForURL("**/dashboard/**", { timeout: 30_000 });
}

async function loginUser(
    page: Page,
    user: { email: string; password: string },
): Promise<void> {
    await page.goto("/auth/login");

    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL("**/dashboard/**", { timeout: 30_000 });
}

async function signOut(page: Page): Promise<void> {
    // The avatar trigger has a specific class pattern from DropdownMenuTrigger
    const avatarTrigger = page.locator("button.rounded-full").first();
    await avatarTrigger.click();

    await page.getByRole("menuitem", { name: "Sign Out" }).click();

    await page.waitForURL("/", { timeout: 15_000 });
}

// ─── All tests in one serial block ──────────────────────────────

test.describe
    .serial("Frain E2E — Owner & Invited member flows", () => {
        // ── Flow 1: User A (Owner) ──────────────────────────────────

        test("1. Register User A", async ({ page }) => {
            await registerUser(page, USER_A);
            await expect(page).toHaveURL(/\/dashboard/);
        });

        test("2. Create Organization", async ({ page }) => {
            await loginUser(page, USER_A);
            await page.goto("/dashboard/organizations");

            // There are two "New Organization" buttons (header + empty state).
            // Use .first() to avoid strict mode violation.
            await page
                .getByRole("button", { name: "New Organization" })
                .first()
                .click();

            // Fill org name
            await page.locator("#org-name").fill(ORG_NAME);
            // Visibility defaults to PUBLIC — leave as is

            // Submit
            await page
                .getByRole("button", { name: "Create", exact: true })
                .click();

            // Verify toast
            await expect(
                page.getByText("Organization created successfully"),
            ).toBeVisible({ timeout: 10_000 });

            // Verify org appears in the list
            await expect(page.getByText(ORG_NAME).first()).toBeVisible();

            // Navigate into the org to capture the orgId
            await page.getByText(ORG_NAME).first().click();
            await page.waitForURL("**/dashboard/*/projects", {
                timeout: 10_000,
            });

            const url = page.url();
            const match = url.match(/\/dashboard\/([^/]+)\/projects/);
            expect(match).toBeTruthy();
            orgId = match![1];
        });

        test("3. Create Project", async ({ page }) => {
            expect(orgId).toBeTruthy();

            await loginUser(page, USER_A);
            await page.goto(`/dashboard/${orgId}/projects`);

            // May have two "New Project" buttons (header + empty state)
            await page
                .getByRole("button", { name: "New Project" })
                .first()
                .click();

            // Visibility defaults to PUBLIC — leave as is

            // Submit
            await page
                .getByRole("button", { name: "Create", exact: true })
                .click();

            // Verify toast
            await expect(
                page.getByText("Project created successfully"),
            ).toBeVisible({ timeout: 10_000 });

            // Capture the projectId from the project link
            const projectLink = page
                .locator(`a[href*="/dashboard/${orgId}/project/"]`)
                .first();
            await expect(projectLink).toBeVisible({ timeout: 10_000 });

            const href = await projectLink.getAttribute("href");
            const projectMatch = href?.match(
                /\/dashboard\/[^/]+\/project\/([^/]+)/,
            );
            expect(projectMatch).toBeTruthy();
            projectId = projectMatch![1];
        });

        test("4. Register User B", async ({ page }) => {
            await registerUser(page, USER_B);
            await expect(page).toHaveURL(/\/dashboard/);
        });

        test("5. Invite User B as ADMIN", async ({ page }) => {
            expect(orgId).toBeTruthy();

            await loginUser(page, USER_A);
            await page.goto(`/dashboard/${orgId}/members`);

            // Click "Add Member" to open the invitation dialog
            await page.getByRole("button", { name: "Add Member" }).click();

            // Fill email
            await page
                .getByPlaceholder("member@example.com")
                .fill(USER_B.email);

            // Select ADMIN role (default is CONTRIBUTOR)
            await page.locator("#invite-role").click();
            await page.getByRole("option", { name: /Admin/i }).click();

            // Submit
            await page.getByRole("button", { name: "Send Invitation" }).click();

            // Verify toast
            await expect(
                page.getByText("Invitation sent successfully!"),
            ).toBeVisible({ timeout: 10_000 });
        });

        test("6. Create API Key for own user", async ({ page }) => {
            expect(orgId).toBeTruthy();
            expect(projectId).toBeTruthy();

            await loginUser(page, USER_A);
            await page.goto(`/dashboard/${orgId}/project/${projectId}`);

            // Wait for project page to load fully (members need to be fetched)
            await page.waitForLoadState("networkidle");

            // Click "Manage API Keys" in the project sidebar
            await page.getByRole("button", { name: "Manage API Keys" }).click();

            // Sheet should be visible
            await expect(page.getByText("API Keys Management")).toBeVisible({
                timeout: 10_000,
            });

            // Click "Create New API Key"
            await page
                .getByRole("button", { name: "Create New API Key" })
                .click();

            // Modal should appear
            await expect(
                page.getByRole("heading", { name: "Create API Key" }),
            ).toBeVisible();

            // Scope to the "Create API Key" dialog
            const createDialog = page.getByRole("dialog", {
                name: "Create API Key",
            });

            // Wait for the combobox to be enabled (members loaded)
            const comboboxTrigger = createDialog.getByRole("combobox");
            await expect(comboboxTrigger).toBeEnabled({ timeout: 10_000 });

            // Open the member combobox
            await comboboxTrigger.click();

            // Wait for the search input inside the popover
            const searchInput = page.getByPlaceholder("Search member...");
            await expect(searchInput).toBeVisible({ timeout: 5_000 });

            // Type to filter down to our user
            await searchInput.fill(USER_A.name);
            await page.waitForTimeout(500);

            // Click the cmdk item directly using its data attribute with force
            // (Radix Dialog + Popover portal layering requires force click)
            const cmdkItem = page.locator("[cmdk-item]").first();
            await expect(cmdkItem).toBeVisible({ timeout: 5_000 });
            await cmdkItem.click({ force: true });

            // Verify the combobox shows the selected member
            await expect(comboboxTrigger).toContainText(USER_A.name, {
                timeout: 5_000,
            });

            // The "Create API Key" button should now be enabled
            const createButton = createDialog.getByRole("button", {
                name: "Create API Key",
                exact: true,
            });
            await expect(createButton).toBeEnabled({ timeout: 5_000 });

            // Submit
            await createButton.click();

            // Verify success toast
            await expect(page.getByText("API key created")).toBeVisible({
                timeout: 10_000,
            });

            // Verify "No API keys found" disappears
            await expect(page.getByText("No API keys found")).not.toBeVisible({
                timeout: 15_000,
            });
        });

        test("7. Sign out User A", async ({ page }) => {
            await loginUser(page, USER_A);
            await signOut(page);
            await expect(page).toHaveURL("/");
        });

        // ── Flow 2: User B (Invited member) ─────────────────────────
        //
        // TODO: Once the backend fixes PATCH /api/v1/invitations/{id}/accept
        // (currently returns 500), add tests to:
        //   - Accept the invitation (via notification UI)
        //   - Verify User B has access to the organization

        test("8. Sign out User B", async ({ page }) => {
            await loginUser(page, USER_B);
            await signOut(page);
            await expect(page).toHaveURL("/");
        });
    });
