/**
 * Page Object Model - Login / Sign-in Page
 * Encapsulates all interactions with the /signin route.
 */
export class LoginPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  private readonly usernameInput = '[data-test="signin-username"]';
  private readonly passwordInput = '[data-test="signin-password"]';
  private readonly rememberMeCheckbox = '[data-test="signin-remember-me"] input';
  private readonly submitButton = '[data-test="signin-submit"]';
  private readonly signupLink = '[data-test="signup"]';
  private readonly usernameError = "#username-helper-text";
  private readonly passwordError = "#password-helper-text";

  // ── Navigation ─────────────────────────────────────────────────────────────
  visit(): this {
    cy.visit("/signin");
    return this;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  enterUsername(username: string): this {
    cy.get(this.usernameInput).type(username);
    return this;
  }

  clearUsername(): this {
    cy.get(this.usernameInput).find("input").clear().blur();
    return this;
  }

  enterPassword(password: string): this {
    cy.get(this.passwordInput).type(password);
    return this;
  }

  clearPassword(): this {
    cy.get(this.passwordInput).find("input").clear().blur();
    return this;
  }

  checkRememberMe(): this {
    cy.get(this.rememberMeCheckbox).check();
    return this;
  }

  submit(): this {
    cy.get(this.submitButton).click();
    return this;
  }

  clickSignup(): this {
    cy.get(this.signupLink).click();
    return this;
  }

  login(username: string, password: string, rememberMe = false): this {
    this.enterUsername(username);
    this.enterPassword(password);
    if (rememberMe) this.checkRememberMe();
    this.submit();
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  assertOnLoginPage(): this {
    cy.location("pathname").should("equal", "/signin");
    return this;
  }

  assertSubmitDisabled(): this {
    cy.get(this.submitButton).should("be.disabled");
    return this;
  }

  assertUsernameError(message: string): this {
    cy.get(this.usernameError).should("be.visible").and("contain", message);
    return this;
  }

  assertPasswordError(message: string): this {
    cy.get(this.passwordError).should("be.visible").and("contain", message);
    return this;
  }
}
