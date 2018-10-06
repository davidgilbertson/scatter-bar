import scientificNotation from './scientificNotation';

const tests = [
  { input: 0.000123, expect: [1.23, -4] },
  { input: 0.00123, expect: [1.23, -3] },
  { input: 0.0123, expect: [1.23, -2] },
  { input: .123, expect: [1.23, -1] },
  { input: 1.23, expect: [1.23, 0] },
  { input: 12.3, expect: [1.23, 1] },
  { input: 123, expect: [1.23, 2] },
  { input: 1230, expect: [1.23, 3] },
  { input: 3000.0003, expect: [3.0000003, 3] },
];

tests.forEach(testItem => {
  it(`scientificNotation should convert ${testItem.input}`, () => {
    expect(scientificNotation(testItem.input)).toEqual(testItem.expect);
  });
});

