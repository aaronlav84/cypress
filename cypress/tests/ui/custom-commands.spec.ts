import { User } from "../../../src/models";

/**
 * Showcase test for custom Cypress commands defined in custom-commands.ts
 * Demonstrates: interceptApi, waitForLoadingToFinish, assertNotification, assertPageTitle
 */
describe("Custom Commands Showcase", function () {
  beforeEach(function () {
    cy.task("db:seed");

    cy.database("find", "users").then((user: User) => {
      cy.loginByXstate(user.username);
    });
  });

  it("uses interceptApi to alias and wait on a network request", function () {
    cy.interceptApi("GET", "/transactions/public").then((alias) => {
      cy.visit("/");
      cy.wait(alias);
      cy.assertPageTitle("Cypress Real World App");
    });
  });

  it("uses waitForLoadingToFinish to wait for skeleton loaders to clear", function () {
    cy.visit("/");
    cy.waitForLoadingToFinish();
    cy.get("[data-test='transaction-list']").should("be.visible");
  });

  it("uses assertNotification after a successful transaction submission", function () {
    cy.interceptApi("POST", "/transactions");
    cy.interceptApi("GET", "/users*");

    cy.database("filter", "users").then((users: User[]) => {
      const sender = users[0];
      const receiver = users[1];

      cy.loginByXstate(sender.username);
      cy.visit("/transaction/new");
      cy.wait("@GET_users*");

      cy.get("[data-test='user-list-search-input']").type(receiver.firstName, { force: true });
      cy.get("[data-test*='user-list-item']").contains(receiver.firstName).click({ force: true });
      cy.get("[data-test*='amount-input']").type("25");
      cy.get("[data-test*='description-input']").type("Custom command test");
      cy.get("[data-test*='submit-payment']").click();

      cy.wait("@POST_transactions");
      cy.assertNotification("success", "Transaction Submitted!");
    });
  });
});
