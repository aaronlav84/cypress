/**
 * Page Object Model - New Transaction Page
 * Encapsulates all interactions for creating a new payment or request.
 */
export interface TransactionPayload {
  amount: string;
  description: string;
}

export class TransactionPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  private readonly userSearchInput = '[data-test="user-list-search-input"]';
  private readonly userListItem = '[data-test*="user-list-item"]';
  private readonly amountInput = '[data-test*="amount-input"]';
  private readonly descriptionInput = '[data-test*="description-input"]';
  private readonly submitPaymentButton = '[data-test*="submit-payment"]';
  private readonly submitRequestButton = '[data-test*="submit-request"]';
  private readonly successAlert = '[data-test="alert-bar-success"]';

  // ── Actions ────────────────────────────────────────────────────────────────
  searchForUser(name: string): this {
    cy.get(this.userSearchInput).type(name, { force: true });
    return this;
  }

  selectUser(name: string): this {
    cy.get(this.userListItem).contains(name).click({ force: true });
    return this;
  }

  enterAmount(amount: string): this {
    cy.get(this.amountInput).type(amount);
    return this;
  }

  enterDescription(description: string): this {
    cy.get(this.descriptionInput).type(description);
    return this;
  }

  submitPayment(): this {
    cy.get(this.submitPaymentButton).click();
    return this;
  }

  submitRequest(): this {
    cy.get(this.submitRequestButton).click();
    return this;
  }

  sendPayment(contactName: string, payload: TransactionPayload): this {
    this.searchForUser(contactName);
    this.selectUser(contactName);
    this.enterAmount(payload.amount);
    this.enterDescription(payload.description);
    this.submitPayment();
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  assertSuccessAlertVisible(message = "Transaction Submitted!"): this {
    cy.get(this.successAlert).should("be.visible").and("have.text", message);
    return this;
  }
}
