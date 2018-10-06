export default function (num, sig = 3) {
  return Number(num.toLocaleString(navigator.language, {
    maximumSignificantDigits: sig,
    useGrouping: false,
  }));
}
