/**
 * Jenkinsfile — Declarative Pipeline
 *
 * Stages:
 *  1. Install       — dependencies + Cypress binary verification
 *  2. Lint & Types  — ESLint + TypeScript type check
 *  3. Unit Tests    — Vitest
 *  4. Build         — Vite production build
 *  5. E2E: Chrome   — Parallel UI tests in Chrome (5 agents)
 *  6. E2E: Firefox  — Parallel UI tests in Firefox (5 agents)
 *  7. API Tests     — Cypress API spec suite
 *  8. Reports       — Merge Mochawesome + publish Allure
 *
 * Required Jenkins plugins:
 *  - NodeJS Plugin          (tool: "node-22")
 *  - Allure Jenkins Plugin  (tool: "allure-2")
 *  - JUnit Plugin           (for test result trends)
 *  - Parallel Test Executor (optional, for parallelism)
 *
 * Required credentials (Jenkins Credentials Store):
 *  - CYPRESS_PROJECT_ID    (Secret text)
 *  - CYPRESS_RECORD_KEY    (Secret text)
 */

pipeline {
  agent {
    docker {
      image 'cypress/browsers:22.20.0'
      args  '--user 1001'
    }
  }

  tools {
    nodejs 'node-22'
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
  }

  environment {
    CYPRESS_PROJECT_ID = credentials('CYPRESS_PROJECT_ID')
    CYPRESS_RECORD_KEY = credentials('CYPRESS_RECORD_KEY')
    CI                 = 'true'
    NODE_ENV           = 'test'
  }

  stages {

    // ── 1. Install ─────────────────────────────────────────────────────────
    stage('Install') {
      steps {
        sh 'yarn install --frozen-lockfile'
        sh 'npx cypress verify'
        sh 'yarn cypress info'
      }
    }

    // ── 2. Lint & Types ────────────────────────────────────────────────────
    stage('Lint & Types') {
      steps {
        sh 'yarn types'
        sh 'yarn lint'
      }
    }

    // ── 3. Unit Tests ──────────────────────────────────────────────────────
    stage('Unit Tests') {
      steps {
        sh 'yarn test:unit:ci'
      }
    }

    // ── 4. Build ───────────────────────────────────────────────────────────
    stage('Build') {
      steps {
        sh 'yarn build:ci'
      }
      post {
        success {
          archiveArtifacts artifacts: 'build/**', fingerprint: true
        }
      }
    }

    // ── 5. E2E Parallel (Chrome + Firefox) ────────────────────────────────
    stage('E2E Tests') {
      parallel {

        stage('UI — Chrome') {
          steps {
            sh '''
              yarn start:ci &
              yarn wait-on http://localhost:3000 --timeout 120000
              yarn cypress run \
                --browser chrome \
                --spec "cypress/tests/ui/*" \
                --record \
                --parallel \
                --group "UI - Chrome - Jenkins" \
                --ci-build-id "${BUILD_TAG}"
            '''
          }
        }

        stage('UI — Firefox') {
          steps {
            sh '''
              yarn start:ci &
              yarn wait-on http://localhost:3000 --timeout 120000
              yarn cypress run \
                --browser firefox \
                --spec "cypress/tests/ui/*" \
                --record \
                --parallel \
                --group "UI - Firefox - Jenkins" \
                --ci-build-id "${BUILD_TAG}"
            '''
          }
        }

        stage('API Tests') {
          steps {
            sh '''
              yarn start:ci &
              yarn wait-on http://localhost:3001 --timeout 120000
              yarn cypress run \
                --browser chrome \
                --spec "cypress/tests/api/*" \
                --record \
                --group "API - Jenkins" \
                --ci-build-id "${BUILD_TAG}"
            '''
          }
        }

      }
    }

  }

  // ── Post actions ──────────────────────────────────────────────────────────
  post {
    always {
      // Merge Mochawesome JSON → single HTML report
      sh 'yarn report:merge  || true'
      sh 'yarn report:generate || true'

      // Allure report
      sh 'npx allure generate allure-results --clean -o allure-report || true'
      allure([
        includeProperties: false,
        jdk              : '',
        results          : [[path: 'allure-results']],
        reportBuildPolicy: 'ALWAYS',
        report           : 'allure-report'
      ])

      // Archive HTML report + screenshots/videos
      archiveArtifacts artifacts: 'cypress/reports/final/**', allowEmptyArchive: true
      archiveArtifacts artifacts: 'cypress/screenshots/**',   allowEmptyArchive: true
      archiveArtifacts artifacts: 'cypress/videos/**',        allowEmptyArchive: true

      // Code coverage
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true

      // Cleanup
      cleanWs()
    }

    failure {
      echo 'Pipeline failed. Check archived screenshots/videos for details.'
    }
  }
}
