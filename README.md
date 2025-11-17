# E2E Test Suite

This End-to-End (E2E) test suite validates both the core login functionality and the overall health of the e-commerce application using Playwright.  
It includes strict checks for:

- Console errors
- Broken links
- Multiple login scenarios (success, failure, and edge cases)
- GitHub Open PR Reporting — validates the GitHub `/pulls` API, generates a CSV/Excel-compatible report, and ensures correct formatting, escaping, and placeholder handling for missing fields

**Note:**  
The generated CSV/Excel file is saved inside the framework directory.  
VS Code may not open it by double-clicking — open it manually in Excel or any CSV viewer.

![alt text](image.png)

## Installation

### Clone the repository
```bash
git clone https://github.com/nadiaghulamali/FashionHub_E2E.git
```

### Install dependencies
```bash
npm install
```

### Install Playwright browsers (if needed)
```bash
npx playwright install
```

## Running the Test Suite

### Run all tests
```bash
npx playwright test
```

### Run a specific test
```bash
npx playwright test tests/login.spec.ts
```

## Docker Support

This project includes a Docker setup for stable, reproducible test execution — ideal for CI/CD pipelines.

### Build the Docker image
```bash
docker build -t fashionhub-tests .
```

### Run tests
```bash
docker run --rm fashionhub-tests
```

### Run tests for a specific environment
```bash
docker run --rm -e ENV=local fashionhub-tests
```

### Open the last HTML report
```bash
npx playwright show-report
```

The `--rm` flag cleans up the container after execution.

## CI/CD: GitHub Actions

CI executes tests inside Docker for reliability and consistency.

Typical CI steps include:

1. Checkout repository  
2. Build Docker image  
3. Run tests in the container  
4. Upload artifacts (`test-results/`)

### Example Docker commands used in CI
```bash
docker build -t fashionhub-tests .
docker run --rm -e ENV=staging fashionhub-tests
```

Artifacts such as screenshots, videos, logs, and PR reports are uploaded via GitHub Actions.
