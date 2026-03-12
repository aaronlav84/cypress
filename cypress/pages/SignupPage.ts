/**
 * Page Object Model - Sign-up Page
 * Encapsulates all interactions with the /signup route.
 */
export interface SignupFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export class SignupPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  private readonly pageTitle = '[data-test="signup-title"]';
  private readonly firstNameInput = '[data-test="signup-first-name"]';
  private readonly lastNameInput = '[data-test="signup-last-name"]';
  private readonly usernameInput = '[data-test="signup-username"]';
  private readonly passwordInput = '[data-test="signup-password"]';
  private readonly confirmPasswordInput = '[data-test="signup-confirmPassword"]';
  private readonly submitButton = '[data-test="signup-submit"]';

  // ── Navigation ─────────────────────────────────────────────────────────────
  visit(): this {
    cy.visit("/signup");
    return this;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  enterFirstName(value: string): this {
    cy.get(this.firstNameInput).type(value);
    return this;
  }

  enterLastName(value: string): this {
    cy.get(this.lastNameInput).type(value);
    return this;
  }

  enterUsername(value: string): this {
    cy.get(this.usernameInput).type(value);
    return this;
  }

  enterPassword(value: string): this {
    cy.get(this.passwordInput).type(value);
    return this;
  }

  enterConfirmPassword(value: string): this {
    cy.get(this.confirmPasswordInput).type(value);
    return this;
  }

  submit(): this {
    cy.get(this.submitButton).click();
    return this;
  }

  fillForm(data: SignupFormData): this {
    this.enterFirstName(data.firstName);
    this.enterLastName(data.lastName);
    this.enterUsername(data.username);
    this.enterPassword(data.password);
    this.enterConfirmPassword(data.password);
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  assertTitleVisible(): this {
    cy.get(this.pageTitle).should("be.visible").and("contain", "Sign Up");
    return this;
  }

  assertOnSignupPage(): this {
    cy.location("pathname").should("equal", "/signup");
    return this;
  }
}
