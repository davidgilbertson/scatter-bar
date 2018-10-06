export default function scientificNotation(num) {
  const exponent = Math.floor(Math.log10(num));
  const coefficient = num / 10 ** exponent;

  console.log('  --  >  scientificNotation.js:5 > coefficient, exponent', coefficient, exponent);
  return [coefficient, exponent];
}
