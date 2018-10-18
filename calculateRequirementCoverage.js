/**
 *
 * This file gathers test scenario coverage.
 * - It collects a list of test names by parsing test files
 * - It collects a list of scenarios by parsing REQUIREMENTS.md
 * - It compares the two, then updates TEST_SCENARIOS.md to show what's covered and what's not
 *
 **/

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

(async () => {
  console.time('Calculate scenario coverage');

  const PASS = ':heavy_check_mark:';
  const FAIL = ':x:';
  let coveredTestCount = 0;
  let uncoveredTestCount = 0;
  const testScenarioFilePath = path.resolve(__dirname, './REQUIREMENTS.md');

  const gatherTestNames = async () => {
    // Changing working directory saves heaps of time
    const cwd = path.resolve(__dirname, './src/interactionTests');
    const fileNames = await glob('**/?(*.)+(spec|test).js', { cwd });

    const testNames = [];

    fileNames.forEach(fileName => {
      const file = fs.readFileSync(path.resolve(cwd, fileName), 'utf8');

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

  const appendToOutput = line => {
    if (outputText) outputText += '\n';
    outputText += line;
  };

  const scenariosMarkdown = fs.readFileSync(testScenarioFilePath, 'utf8');

  const testNames = await gatherTestNames();

  const testNamesWithCovered = testNames.reduce((acc, current) => {
    acc[current] = false;
    return acc;
  }, {});

  let headers = [];
  let tableRow = 0;

  for (const rawLine of scenariosMarkdown.split('\n')) {
    const line = rawLine.trim();

    const headerMatches = line.match(/^(#+)\s*(.*)/);

    if (headerMatches) {
      const headerDepth = headerMatches[1].length; // e.g. ## === 2
      headers = headers.slice(0, headerDepth);
      headers[headerDepth - 1] = headerMatches[2];
    }

    if (line.startsWith('|')) {
      tableRow++;
    } else {
      tableRow = 0;
    }

    if (tableRow < 3) {
      appendToOutput(line);
      continue;
    }

    const requirementMatch = line.match(/\|.*?\|(.*)\|/);

    const requirement = requirementMatch[1];
    const expectedTestName = `${headers.join(' > ')} > ${requirement}`;

    if (expectedTestName in testNamesWithCovered) {
      testNamesWithCovered[expectedTestName] = true;
      appendToOutput(`|${PASS}|${requirement}|`);
      coveredTestCount += 1;
    } else {
      console.warn(' --> Not covered:', expectedTestName);
      appendToOutput(`|${FAIL}|${requirement}|`);
      uncoveredTestCount += 1;
    }
  }

  Object.entries(testNamesWithCovered).forEach(([key, value]) => {
    if (value === false) {
      console.warn(' --> No such requirement:', key);
    }
  });

  const requirementCount = coveredTestCount + uncoveredTestCount;
  const coveragePercent = Math.round((coveredTestCount / requirementCount * 100));
  const coverageString = `${coveragePercent}% (${coveredTestCount.toLocaleString()}/${requirementCount.toLocaleString()})`;

  outputText = outputText.replace(/(\*\*Coverage\*\*: ).*(\n)/, `$1${coverageString}$2`);
  fs.writeFileSync(testScenarioFilePath, outputText);

  console.log(`Coverage: ${coverageString}`);

  console.timeEnd('Calculate scenario coverage');
})();
