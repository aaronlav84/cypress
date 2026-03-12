/**
 * custom-commands.ts
 *
 * New typed Cypress commands built on top of the existing RWA commands.
 * Each command is fully typed in global.d.ts.
 *
 * Commands added here:
 *  - cy.waitForLoadingToFinish()       — waits for skeleton loaders to clear
 *  - cy.interceptApi()                 — smart intercept with auto-alias
 *  - cy.createTransactionViaApi()      — create a transaction via REST API
 *  - cy.assertNotification()           — assert success/error notification text
 *  - cy.assertPageTitle()              — assert the document <title>
 */

// ── Wait for skeleton/loading state to clear ──────────────────────────────────
Cypress.Commands.add("waitForLoadingToFinish", () => {
  cy.get("[data-test='list-skeleton']", { timeout: 10000 }).should("not.exist");
});

// ── Smart intercept wrapper ───────────────────────────────────────────────────
// Automatically derives an alias from the method + URL so you don't have to
// remember naming conventions. Returns the alias string for use in cy.wait().
//
// Usage:
//   cy.interceptApi("GET", "/transactions").then(alias => cy.wait(alias))
//   — or simply —
//   cy.interceptApi("POST", "/transactions");
//   cy.wait("@POST_transactions");
Cypress.Commands.add(
  "interceptApi",
  (method: string, url: string, fixture?: string): Cypress.Chainable<string> => {
    const alias = `${method.toUpperCase()}_${url.replace(/\//g, "_").replace(/^_/, "")}`;

    if (fixture) {
      cy.intercept(method as Cypress.HttpMethod, url, { fixture }).as(alias);
    } else {
      cy.intercept(method as Cypress.HttpMethod, url).as(alias);
    }

    return cy.wrap(`@${alias}`);
  }
);

// ── Create a transaction directly via the REST API ────────────────────────────
// Bypasses the UI entirely — great for test setup.
// Expects the user to already be logged in (session cookie present).
//
// Usage:
//   cy.createTransactionViaApi({
//     senderId: "user1id",
//     receiverId: "user2id",
//     amount: 50,
//     description: "Lunch",
//     transactionType: "payment",
//   });
Cypress.Commands.add(
  "createTransactionViaApi",
  (payload: {
    senderId: string;
    receiverId: string;
    amount: number;
    description: string;
    transactionType: "payment" | "request";
  }) => {
    return cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/transactions`,
      body: payload,
    });
  }
);

// ── Assert a success or error notification banner ────────────────────────────
// Usage:
//   cy.assertNotification("success", "Transaction Submitted!")
//   cy.assertNotification("error", "Insufficient funds")
Cypress.Commands.add(
  "assertNotification",
  (type: "success" | "error", message: string) => {
    cy.get(`[data-test="alert-bar-${type}"]`)
      .should("be.visible")
      .and("contain", message);
  }
);

// ── Assert the document page title ───────────────────────────────────────────
// Usage:
//   cy.assertPageTitle("Cypress Real World App")
Cypress.Commands.add("assertPageTitle", (expectedTitle: string) => {
  cy.title().should("include", expectedTitle);
});
