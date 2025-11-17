FROM mcr.microsoft.com/playwright:v1.46.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm install


# Create report/output folders and give full write permissions
RUN mkdir -p test-results playwright-report reports/github && \
    chmod -R 777 test-results playwright-report reports

# Copy full project
COPY . .

# Install browsers
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
