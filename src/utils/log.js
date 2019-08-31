export const time = message => {
  console.info(message, Math.round(performance.now()));
};
