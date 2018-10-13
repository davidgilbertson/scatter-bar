const os = require('os');
const fs = require('fs');
const path = require('path');

const scenariosMarkdown = fs.readFileSync(path.resolve(__dirname, '../TEST_SCENARIOS.md'), 'utf8');

const expectedTests = [];
const SECTIONS = {
  INTRO: 'INTRO',
  SCENARIOS: 'SCENARIOS',
  SURPLUS_TESTS: 'SURPLUS_TESTS',
};

const PASS = ':heavy_check_mark:';
const FAIL = ':x:';

let currentSection = SECTIONS.INTRO;
let ignoreNextLine = true;

const lines = scenariosMarkdown.split('\n');

const mockTests = [
  'Display > Given a story with sets, then a data panel and chart should be rendered',
  'Display > Given a story with no data, then only a data panel should be rendered',
  'Display > Given a story with no data, an "add set" button should be present',
  'Display > Sets > Given a story has two sets, then two sets should be rendered',
  'Some test that does not match anything',
];

const testNamesWithCovered = mockTests.reduce((acc, current) => {
  acc[current] = false;
  return acc;
}, {});

let headers = [];
let outputText = '';

const outputLine = text => {
  outputText += `${text}${os.EOL}`;
};

for (const rawLine of lines) {
  const line = rawLine.trim();

  const headerMatches = line.match(/^(#+)\s*(.*)/);

  if (headerMatches) {
    const headerDepth = headerMatches[1].length; // e.g. ## === 2
    headers = headers.slice(0, headerDepth);
    headers[headerDepth - 1] = headerMatches[2];
  }

  if (!line.match(/^\|(given|when)/i)) {
    outputLine(line);
    continue;
  }

  if (line.split('|').length === 4) {
    const scenario = line.split('|')[1];
    const expectedTestName = `${headers.join(' > ')} > ${scenario}`;

    if (expectedTestName in testNamesWithCovered) {
      testNamesWithCovered[expectedTestName] = true;
      outputLine(`|${scenario}|${PASS}|`);
    } else {
      outputLine(`|${scenario}|${FAIL}|`);
    }
  } else {
    outputLine(line);
    // The user probably wanted this to be a test scenario, but they did it wrong
    console.error('Poorly formatted line:', line);
  }
}

Object.entries(testNamesWithCovered).forEach(([key, value]) => {
  if (!value) {
    console.warn(`"${key}" doesn't exist in the test scenarios`);
  }
});

fs.writeFileSync(path.resolve(__dirname, '../TEST_RESULTS.md'), outputText);
