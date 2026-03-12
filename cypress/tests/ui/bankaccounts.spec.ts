import { User } from "../../../src/models";
import { isMobile } from "../../support/utils";
import { BankAccountPage } from "../../pages";

const apiGraphQL = `${Cypress.env("apiUrl")}/graphql`;

type BankAccountsTestCtx = {
  user?: User;
};

describe("Bank Accounts", function () {
  const ctx: BankAccountsTestCtx = {};
  const bankAccountPage = new BankAccountPage();

  beforeEach(function () {
    cy.task("db:seed");

    cy.intercept("GET", "/notifications").as("getNotifications");

    cy.intercept("POST", apiGraphQL, (req) => {
      const operationAliases: Record<string, string> = {
        ListBankAccount: "gqlListBankAccountQuery",
        CreateBankAccount: "gqlCreateBankAccountMutation",
        DeleteBankAccount: "gqlDeleteBankAccountMutation",
      };

      const { body } = req;

      const operationName = body?.operationName;

      if (
        body.hasOwnProperty("operationName") &&
        operationName &&
        operationAliases[operationName]
      ) {
        req.alias = operationAliases[operationName];
      }
    });

    cy.database("find", "users").then((user: User) => {
      ctx.user = user;

      return cy.loginByXstate(ctx.user.username);
    });
  });

  it("creates a new bank account", function () {
    cy.wait("@getNotifications");

    bankAccountPage
      .navigateViaSidenav(isMobile())
      .clickNewAccount()
      .assertOnNewAccountPage();

    cy.visualSnapshot("Display New Bank Account Form");

    bankAccountPage.fillForm({
      bankName: "The Best Bank",
      routingNumber: "987654321",
      accountNumber: "123456789",
    });

    cy.visualSnapshot("Fill out New Bank Account Form");
    bankAccountPage.submit();

    cy.wait("@gqlCreateBankAccountMutation");

    bankAccountPage
      .assertAccountListLength(2)
      .assertAccountListContains(1, "The Best Bank");

    cy.visualSnapshot("Bank Account Created");
  });

  it("should display bank account form errors", function () {
    bankAccountPage.visit().clickNewAccount();

    // Bank name — required
    bankAccountPage.clearBankName().assertBankNameError("Enter a bank name");

    // Bank name — too short
    bankAccountPage
      .enterBankName("The")
      .clearBankName()
      .enterBankName("The")
      .assertBankNameError("Must contain at least 5 characters");

    // Routing number — required
    cy.getBySelLike("routingNumber-input").find("input").focus();
    bankAccountPage.blurRoutingNumber().assertRoutingNumberError("Enter a valid bank routing number");

    // Routing number — too short
    bankAccountPage
      .enterRoutingNumber("12345678")
      .blurRoutingNumber()
      .assertRoutingNumberError("Must contain a valid routing number")
      .clearRoutingNumber();

    // Routing number — valid
    bankAccountPage
      .enterRoutingNumber("123456789")
      .blurRoutingNumber()
      .assertRoutingNumberErrorAbsent();

    // Account number — required
    cy.getBySelLike("accountNumber-input").find("input").focus();
    bankAccountPage.blurAccountNumber().assertAccountNumberError("Enter a valid bank account number");

    // Account number — too short
    bankAccountPage
      .enterAccountNumber("12345678")
      .blurAccountNumber()
      .assertAccountNumberError("Must contain at least 9 digits")
      .clearAccountNumber();

    // Account number — valid minimum
    bankAccountPage
      .enterAccountNumber("123456789")
      .blurAccountNumber()
      .assertAccountNumberErrorAbsent()
      .clearAccountNumber();

    // Account number — valid maximum
    bankAccountPage
      .enterAccountNumber("123456789111")
      .blurAccountNumber()
      .assertAccountNumberErrorAbsent()
      .clearAccountNumber();

    // Account number — too long
    bankAccountPage
      .enterAccountNumber("1234567891111")
      .blurAccountNumber()
      .assertAccountNumberError("Must contain no more than 12 digits");

    bankAccountPage.assertSubmitDisabled();
    cy.visualSnapshot("Bank Account Form with Errors and Submit button disabled");
  });

  it("soft deletes a bank account", function () {
    bankAccountPage.visit().deleteFirst();

    cy.wait("@gqlDeleteBankAccountMutation");

    bankAccountPage.assertFirstDeletedItemVisible();
    cy.visualSnapshot("Soft Delete Bank Account");
  });

  // TODO: [enhancement] the onboarding modal assertion can be removed after adding "onboarded" flag to user profile
  it("renders an empty bank account list state with onboarding modal", function () {
    cy.wait("@getNotifications");
    cy.intercept("POST", apiGraphQL, (req) => {
      const { body } = req;
      if (body.hasOwnProperty("operationName") && body.operationName === "ListBankAccount") {
        req.alias = "gqlListBankAccountQuery";
        req.continue((res) => {
          res.body.data.listBankAccount = [];
        });
      }
    });

    bankAccountPage.visit();
    cy.wait("@getNotifications");
    cy.wait("@gqlListBankAccountQuery");

    bankAccountPage
      .assertEmptyListVisible()
      .assertOnboardingDialogVisible();

    cy.getBySel("nav-top-notifications-count").should("exist");
    cy.visualSnapshot("User Onboarding Dialog is Visible");
  });
});

