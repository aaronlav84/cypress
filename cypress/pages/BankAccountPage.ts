/**
 * Page Object Model - Bank Accounts Page
 * Encapsulates all interactions with the /bankaccounts route.
 */
export interface BankAccountFormData {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
}

export class BankAccountPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  private readonly sidenavItem = '[data-test="sidenav-bankaccounts"]';
  private readonly newAccountButton = '[data-test="bankaccount-new"]';
  private readonly bankNameInput = '[data-test*="bankName-input"]';
  private readonly routingNumberInput = '[data-test*="routingNumber-input"]';
  private readonly accountNumberInput = '[data-test*="accountNumber-input"]';
  private readonly submitButton = '[data-test="bankaccount-submit"]';
  private readonly listItem = '[data-test*="bankaccount-list-item"]';
  private readonly deleteButton = '[data-test*="delete"]';
  private readonly bankAccountList = '[data-test="bankaccount-list"]';
  private readonly emptyListHeader = '[data-test="empty-list-header"]';
  private readonly onboardingDialog = '[data-test="user-onboarding-dialog"]';
  private readonly bankNameError = '#bankaccount-bankName-input-helper-text';
  private readonly routingNumberError = '#bankaccount-routingNumber-input-helper-text';
  private readonly accountNumberError = '#bankaccount-accountNumber-input-helper-text';

  // ── Navigation ─────────────────────────────────────────────────────────────
  visit(): this {
    cy.visit("/bankaccounts");
    return this;
  }

  navigateViaSidenav(isMobileView = false): this {
    if (isMobileView) {
      cy.getBySel("sidenav-toggle").click();
    }
    cy.get(this.sidenavItem).click();
    return this;
  }

  clickNewAccount(): this {
    cy.get(this.newAccountButton).click();
    return this;
  }

  // ── Form actions ───────────────────────────────────────────────────────────
  enterBankName(name: string): this {
    cy.get(this.bankNameInput).type(name);
    return this;
  }

  clearBankName(): this {
    cy.get(this.bankNameInput).find("input").clear().blur();
    return this;
  }

  enterRoutingNumber(number: string): this {
    cy.get(this.routingNumberInput).type(number);
    return this;
  }

  blurRoutingNumber(): this {
    cy.get(this.routingNumberInput).find("input").blur();
    return this;
  }

  clearRoutingNumber(): this {
    cy.get(this.routingNumberInput).find("input").clear();
    return this;
  }

  enterAccountNumber(number: string): this {
    cy.get(this.accountNumberInput).type(number);
    return this;
  }

  blurAccountNumber(): this {
    cy.get(this.accountNumberInput).find("input").blur();
    return this;
  }

  clearAccountNumber(): this {
    cy.get(this.accountNumberInput).find("input").clear();
    return this;
  }

  submit(): this {
    cy.get(this.submitButton).click();
    return this;
  }

  fillForm(data: BankAccountFormData): this {
    this.enterBankName(data.bankName);
    this.enterRoutingNumber(data.routingNumber);
    this.enterAccountNumber(data.accountNumber);
    return this;
  }

  deleteFirst(): this {
    cy.get(this.deleteButton).first().click();
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  assertOnNewAccountPage(): this {
    cy.location("pathname").should("eq", "/bankaccounts/new");
    return this;
  }

  assertAccountListLength(length: number): this {
    cy.get(this.listItem).should("have.length", length);
    return this;
  }

  assertAccountListContains(index: number, text: string): this {
    cy.get(this.listItem).eq(index).should("contain", text);
    return this;
  }

  assertFirstDeletedItemVisible(): this {
    cy.getBySelLike("list-item").children().contains("Deleted");
    return this;
  }

  assertEmptyListVisible(): this {
    cy.get(this.bankAccountList).should("not.exist");
    cy.get(this.emptyListHeader).should("contain", "No Bank Accounts");
    return this;
  }

  assertOnboardingDialogVisible(): this {
    cy.get(this.onboardingDialog).should("be.visible");
    return this;
  }

  assertSubmitDisabled(): this {
    cy.get(this.submitButton).should("be.disabled");
    return this;
  }

  assertBankNameError(message: string): this {
    cy.get(this.bankNameError).should("be.visible").and("contain", message);
    return this;
  }

  assertRoutingNumberError(message: string): this {
    cy.get(this.routingNumberError).should("be.visible").and("contain", message);
    return this;
  }

  assertRoutingNumberErrorAbsent(): this {
    cy.get(this.routingNumberError).should("not.exist");
    return this;
  }

  assertAccountNumberError(message: string): this {
    cy.get(this.accountNumberError).should("be.visible").and("contain", message);
    return this;
  }

  assertAccountNumberErrorAbsent(): this {
    cy.get(this.accountNumberError).should("not.exist");
    return this;
  }
}
