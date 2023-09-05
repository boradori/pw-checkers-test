# Playwright Checkers Game Test

## Playwright Typescript UI Automation on https://www.gamesforthebrain.com/game/checkers/

### Requirements
Node.js

You need to install the dependencies using the following command:
```
npm install
```

### Execution
Run tests on all supported browsers (Chromium, Firefox, and Webkit) in headless mode.
```
npx playwright test
```

Run tests on all supported browsers (Chromium, Firefox, and Webkit) in headed mode.
```
npx playwright test --headed
```

```
# Run tests on Chromium in headless mode.
npm run test:chrome

# Run tests on Firefox in headless mode.
npm run test:ff

# Run tests on Webkit in headless mode.
npm run test:webkit

# Run tests on Chromium in headed mode.
npm run test:chrome-headed

# Run tests on Firefox in headed mode.
npm run test:ff-headed

# Run tests on Webkit in headed mode.
npm run test:webkit-headed

# Run tests on Chromium in UI mode.
npm run test:chrome-ui

# Run tests on Firefox in UI mode.
npm run test:ff-ui

# Run tests on Webkit in UI mode.
npm run test:webkit-ui
```