export default function scientificNotation(num) {
  const exponent = Math.floor(Math.log10(num));
  const coefficient = num / 10 ** exponent;

  return [coefficient, exponent];
}
