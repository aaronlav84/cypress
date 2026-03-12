# ── Cypress Containerised Test Runner ─────────────────────────────────────────
# Base image bundles Node, Chrome, Firefox, and the Cypress binary.
# Matches the Node version used in CI (see .github/workflows/main.yml).
FROM cypress/browsers:22.20.0

WORKDIR /e2e

# Install dependencies first so Docker layer caching skips this on code-only changes.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --prefer-offline

# Copy the rest of the project.
COPY . .

# Verify the Cypress binary is usable inside the container.
RUN npx cypress verify

# ── Environment ────────────────────────────────────────────────────────────────
# Override at runtime: docker run -e CYPRESS_BASE_URL=http://myapp ...
ENV CYPRESS_BASE_URL=http://localhost:3000
ENV NODE_ENV=test

# ── Entry point ────────────────────────────────────────────────────────────────
# Runs all e2e specs by default.
# Override spec at runtime:
#   docker run --rm cypress-rwa cypress run --spec "cypress/tests/api/*"
ENTRYPOINT ["npx", "cypress", "run"]
