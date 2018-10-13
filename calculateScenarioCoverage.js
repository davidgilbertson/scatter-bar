const os = require('os');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

const PASS = ':heavy_check_mark:';
const FAIL = ':x:';

const gatherTestNames = async () => {
  const fileNames = await glob('**/src/integrationTests/**/?(*.)+(spec|test).js');
  const testNames = [];

  fileNames.forEach(fileName => {
    const file = fs.readFileSync(fileName, 'utf8');

    file.split('\n').forEach(line => {
      const match = line.trim().match(/^(test|it)\(['"`](.*)['"`],/);

      if (match) {
        testNames.push(match[2]);
      }
    });
  });

  return testNames;
};

let outputText = '';

const outputLine = text => {
  outputText += `${text}${os.EOL}`;
};

(async () => {
  console.time('Calculate scenario coverage');
  const scenariosMarkdown = fs.readFileSync(path.resolve(__dirname, './TEST_SCENARIOS.md'), 'utf8');

  const mockTests = await gatherTestNames();

  const testNamesWithCovered = mockTests.reduce((acc, current) => {
    acc[current] = false;
    return acc;
  }, {});

  let headers = [];

  for (const rawLine of scenariosMarkdown.split('\n')) {
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
    if (value === false) {
      // console.warn(`"${key}" doesn't exist in the test scenarios`);
      console.warn('No such scenario:', key);
    }
  });

  fs.writeFileSync(path.resolve(__dirname, './TEST_RESULTS.md'), outputText);

  console.timeEnd('Calculate scenario coverage');
})();
