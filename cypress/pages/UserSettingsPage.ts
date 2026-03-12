/**
 * Page Object Model - User Settings Page
 * Encapsulates all interactions with the /user/settings route.
 */
export interface UserSettingsFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export class UserSettingsPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  private readonly sidenavItem = '[data-test="sidenav-user-settings"]';
  private readonly form = '[data-test="user-settings-form"]';
  private readonly firstNameInput = '[data-test*="firstName"]';
  private readonly lastNameInput = '[data-test*="lastName"]';
  private readonly emailInput = '[data-test*="email-input"]';
  private readonly phoneInput = '[data-test*="phoneNumber-input"]';
  private readonly submitButton = '[data-test*="submit"]';
  private readonly sidenavFullName = '[data-test="sidenav-user-full-name"]';
  private readonly firstNameError = '#user-settings-firstName-input-helper-text';
  private readonly lastNameError = '#user-settings-lastName-input-helper-text';
  private readonly emailError = '#user-settings-email-input-helper-text';
  private readonly phoneError = '#user-settings-phoneNumber-input-helper-text';

  // ── Navigation ─────────────────────────────────────────────────────────────
  navigateViaSidenav(isMobileView = false): this {
    if (isMobileView) {
      cy.getBySel("sidenav-toggle").click();
    }
    cy.get(this.sidenavItem).click();
    return this;
  }

  // ── Form actions ───────────────────────────────────────────────────────────
  clearAndTypeFirstName(value: string): this {
    cy.get(this.firstNameInput).clear().type(value);
    return this;
  }

  clearAndTypeLastName(value: string): this {
    cy.get(this.lastNameInput).clear().type(value);
    return this;
  }

  clearAndTypeEmail(value: string): this {
    cy.get(this.emailInput).clear().type(value);
    return this;
  }

  clearAndTypePhone(value: string): this {
    cy.get(this.phoneInput).clear().type(value).blur();
    return this;
  }

  blurFirstName(): this {
    cy.get(this.firstNameInput).clear().blur();
    return this;
  }

  blurLastName(): this {
    cy.get(this.lastNameInput).clear().blur();
    return this;
  }

  blurEmail(): this {
    cy.get(this.emailInput).clear().blur();
    return this;
  }

  blurPhone(): this {
    cy.get(this.phoneInput).clear().blur();
    return this;
  }

  fillForm(data: UserSettingsFormData): this {
    if (data.firstName !== undefined) this.clearAndTypeFirstName(data.firstName);
    if (data.lastName !== undefined) this.clearAndTypeLastName(data.lastName);
    if (data.email !== undefined) this.clearAndTypeEmail(data.email);
    if (data.phoneNumber !== undefined) this.clearAndTypePhone(data.phoneNumber);
    return this;
  }

  submit(): this {
    cy.get(this.submitButton).click();
    return this;
  }

  // ── Assertions ─────────────────────────────────────────────────────────────
  assertFormVisible(): this {
    cy.get(this.form).should("be.visible");
    return this;
  }

  assertOnSettingsPage(): this {
    cy.location("pathname").should("include", "/user/settings");
    return this;
  }

  assertSubmitDisabled(): this {
    cy.get(this.submitButton).should("be.disabled");
    return this;
  }

  assertSubmitEnabled(): this {
    cy.get(this.submitButton).should("not.be.disabled");
    return this;
  }

  assertSidenavFullNameContains(name: string): this {
    cy.get(this.sidenavFullName).should("contain", name);
    return this;
  }

  assertFirstNameError(message: string): this {
    cy.get(this.firstNameError).should("be.visible").and("contain", message);
    return this;
  }

  assertLastNameError(message: string): this {
    cy.get(this.lastNameError).should("be.visible").and("contain", message);
    return this;
  }

  assertEmailError(message: string): this {
    cy.get(this.emailError).should("be.visible").and("contain", message);
    return this;
  }

  assertPhoneError(message: string): this {
    cy.get(this.phoneError).should("be.visible").and("contain", message);
    return this;
  }
}
