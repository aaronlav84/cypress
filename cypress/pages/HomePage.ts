/**
 * Page Object Model - Home / Dashboard Page
 * Encapsulates interactions with the main dashboard after login.
 */
export class HomePage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  private readonly transactionList = '[data-test="transaction-list"]';
  private readonly navTopNotificationsCount = '[data-test="nav-top-notifications-count"]';
  private readonly newTransactionButton = '[data-test*="new-transaction"]';
  private readonly sidenavToggle = '[data-test="sidenav-toggle"]';
  private readonly sidenavSignout = '[data-test="sidenav-signout"]';
  private readonly sidenavHome = '[data-test="sidenav-home"]';
  private readonly personalTab = '[data-test="nav-personal-tab"]';
  private readonly publicTab = '[data-test="nav-public-tab"]';
  private readonly contactsTab = '[data-test="nav-contacts-tab"]';

  // ── Navigation ─────────────────────────────────────────────────────────────
  visit(): this {
    cy.visit("/");
    return this;
  }

  clickNewTransaction(): this {
    cy.get(this.newTransactionButton).first().click();
    return this;
  }

  clickPersonalTab(): this {
    cy.get(this.personalTab).click();
    return this;
  }

  clickPublicTab(): this {
    cy.get(this.publicTab).click();
    return this;
  }

  clickContactsTab(): this {
    cy.get(this.contactsTab).click();
    return this;
  }

  signOut(isMobileView = false): this {
    if (isMobileView) {
      cy.get(this.sidenavToggle).click();
    }
    cy.get(this.sidenavSignout).click();
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  assertTransactionListVisible(): this {
    cy.get(this.transactionList).should("be.visible");
    return this;
  }

  assertNotificationBadgeExists(): this {
    cy.get(this.navTopNotificationsCount).should("exist");
    return this;
  }

  assertOnHomePage(): this {
    cy.location("pathname").should("equal", "/");
    return this;
  }
}
