/**
 * Page Object Model - Notifications Page
 * Encapsulates all interactions with the /notifications route and the
 * in-app notification badge.
 */
export class NotificationsPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  private readonly notificationsLink = '[data-test*="notifications-link"]';
  private readonly listItem = '[data-test*="notification-list-item"]';
  private readonly markReadButton = '[data-test*="notification-mark-read"]';
  private readonly navBadge = '[data-test="nav-top-notifications-count"]';

  // ── Navigation ─────────────────────────────────────────────────────────────
  visit(): this {
    cy.visit("/notifications");
    return this;
  }

  clickNotificationsLink(): this {
    cy.get(this.notificationsLink).click();
    return this;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  dismissFirst(): this {
    cy.get(this.markReadButton).first().click({ force: true });
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  assertOnNotificationsPage(): this {
    cy.location("pathname").should("equal", "/notifications");
    return this;
  }

  assertBadgeCount(count: number): this {
    cy.get(this.navBadge).should("have.text", `${count}`);
    return this;
  }

  assertBadgeExists(): this {
    cy.get(this.navBadge).should("exist");
    return this;
  }

  assertListLength(length: number): this {
    cy.get(this.listItem).should("have.length", length);
    return this;
  }

  assertListLengthLessThan(length: number): this {
    cy.get(this.listItem).should("have.length.lessThan", length);
    return this;
  }

  assertFirstItemContains(...texts: string[]): this {
    let chain = cy.get(this.listItem).first();
    texts.forEach((text) => {
      chain = chain.and("contain", text);
    });
    return this;
  }
}
