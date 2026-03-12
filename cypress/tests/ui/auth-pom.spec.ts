import { User } from "../../../src/models";
import { LoginPage, SignupPage, HomePage } from "../../pages";

/**
 * POM showcase test suite — demonstrates Page Object Model pattern
 * using the LoginPage, SignupPage, and HomePage classes.
 */

const loginPage = new LoginPage();
const signupPage = new SignupPage();
const homePage = new HomePage();

describe("Auth flows using Page Object Model", function () {
  beforeEach(function () {
    cy.task("db:seed");
    cy.intercept("POST", "/users").as("signup");
  });

  it("redirects an unauthenticated user to the sign-in page", function () {
    cy.visit("/personal");
    loginPage.assertOnLoginPage();
  });

  it("displays validation errors for empty login fields", function () {
    loginPage
      .visit()
      .enterUsername("User")
      .clearUsername()
      .assertUsernameError("Username is required");

    loginPage
      .enterPassword("abc")
      .clearPassword()
      .assertPasswordError("Password must contain at least 4 characters")
      .assertSubmitDisabled();
  });

  it("logs in successfully and lands on the home page", function () {
    cy.intercept("POST", "/login").as("loginUser");

    cy.database("find", "users").then((user: User) => {
      loginPage.visit().login(user.username, "s3cret", true);
    });

    cy.wait("@loginUser");
    homePage.assertOnHomePage();
  });

  it("allows a new user to sign up via the sign-up page", function () {
    const newUser = {
      firstName: "Jane",
      lastName: "Doe",
      username: "janedoe_pom",
      password: "s3cret",
    };

    loginPage.visit().clickSignup();
    signupPage.assertTitleVisible().fillForm(newUser).submit();

    cy.wait("@signup");
  });

  it("logs out a signed-in user and returns to the sign-in page", function () {
    cy.intercept("POST", "/login").as("loginUser");

    cy.database("find", "users").then((user: User) => {
      loginPage.visit().login(user.username, "s3cret");
    });

    cy.wait("@loginUser");
    homePage.assertOnHomePage().signOut();
    loginPage.assertOnLoginPage();
  });
});
