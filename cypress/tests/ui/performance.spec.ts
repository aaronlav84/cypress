/**
 * Performance Testing Concepts
 *
 * Demonstrates key performance-aware test patterns:
 *  - API response-time budgets via cy.request().its("duration")
 *  - Page load budgets using the W3C Performance Navigation Timing API
 *  - Resource-count guard to catch accidental asset bloat
 *
 * These are "soft" assertions in the sense that individual thresholds
 * should be tuned to your SLA / baseline values captured from production.
 */

const API_RESPONSE_BUDGET_MS = 500;
const PAGE_LOAD_BUDGET_MS = 3000;
const TTFB_BUDGET_MS = 500;

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the PerformanceNavigationTiming entry for the current page.
 * Wraps the call in a cy.window() chain so it works inside Cypress commands.
 */
const getNavTiming = (): Cypress.Chainable<PerformanceNavigationTiming | undefined> =>
  cy.window().then((win) => {
    const [entry] = win.performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    return entry;
  });

// ── Suites ──────────────────────────────────────────────────────────────────

describe("Performance – API response-time budgets", () => {
  beforeEach(() => {
    cy.loginByXstate("Heath93");
  });

  it("GET /transactions responds within budget", () => {
    cy.request("GET", `${Cypress.env("apiUrl")}/transactions`)
      .its("duration")
      .should("be.lessThan", API_RESPONSE_BUDGET_MS);
  });

  it("GET /users responds within budget", () => {
    cy.request("GET", `${Cypress.env("apiUrl")}/users`)
      .its("duration")
      .should("be.lessThan", API_RESPONSE_BUDGET_MS);
  });

  it("GET /notifications responds within budget", () => {
    cy.request("GET", `${Cypress.env("apiUrl")}/notifications`)
      .its("duration")
      .should("be.lessThan", API_RESPONSE_BUDGET_MS);
  });
});

describe("Performance – Page load budgets (Navigation Timing API)", () => {
  beforeEach(() => {
    cy.loginByXstate("Heath93");
  });

  it("home page full load is within budget", () => {
    cy.visit("/");
    cy.getBySel("list-skeleton").should("not.exist");

    getNavTiming().then((nav) => {
      if (!nav) return; // guard: navigation timing not available in all environments
      const pageLoad = nav.loadEventEnd - nav.startTime;
      cy.log(`Home page load: ${pageLoad.toFixed(0)}ms`);
      expect(pageLoad, `Full page load should be < ${PAGE_LOAD_BUDGET_MS}ms`).to.be.lessThan(
        PAGE_LOAD_BUDGET_MS
      );
    });
  });

  it("sign-in page Time to First Byte is within budget", () => {
    cy.visit("/signin");

    getNavTiming().then((nav) => {
      if (!nav) return;
      const ttfb = nav.responseStart - nav.requestStart;
      cy.log(`TTFB: ${ttfb.toFixed(0)}ms`);
      expect(ttfb, `TTFB should be < ${TTFB_BUDGET_MS}ms`).to.be.lessThan(TTFB_BUDGET_MS);
    });
  });

  it("home page DOM Content Loaded is within budget", () => {
    cy.visit("/");

    getNavTiming().then((nav) => {
      if (!nav) return;
      const domReady = nav.domContentLoadedEventEnd - nav.startTime;
      cy.log(`DOM Content Loaded: ${domReady.toFixed(0)}ms`);
      expect(
        domReady,
        `DOM Content Loaded should be < ${PAGE_LOAD_BUDGET_MS}ms`
      ).to.be.lessThan(PAGE_LOAD_BUDGET_MS);
    });
  });
});

describe("Performance – Resource count guard", () => {
  it("sign-in page does not load an excessive number of resources", () => {
    cy.visit("/signin");

    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType("resource");
      cy.log(`Resources loaded: ${resources.length}`);
      // Adjust the upper bound to your app's known baseline.
      expect(resources.length, "Resource count should stay under control").to.be.lessThan(150);
    });
  });
});
