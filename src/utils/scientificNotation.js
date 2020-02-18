const removeRoundingError = num => {
  if (typeof num !== 'number') return num;

  if (/\.\d*00000000\d$/.test(num.toString())) {
    return Number(num.toString().slice(0, -1));
  }

  return num;
};

export default function scientificNotation(num) {
  const exponent = Math.floor(Math.log10(num));
  const coefficient = removeRoundingError(num / 10 ** exponent);

  return [coefficient, exponent];
}
