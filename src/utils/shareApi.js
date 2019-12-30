const shareData = {
  title: 'Scatter bar',
  text: 'Check out Scatter bar: charts for your performance measurements',
  url: document.location.origin,
};

const tweetViaUrl = () => {
  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.set('text', shareData.text);
  url.searchParams.set('url', shareData.url);
  url.searchParams.set('via', 'D__Gilbertson');

  window.open(url.href, '_blank');
};

export const canShare = () => !!(navigator.canShare && navigator.canShare(shareData));

export const share = async () => {
  // If the browser doesn't support the Share API, tweet via URL
  if (!canShare()) tweetViaUrl();

  try {
    await navigator.share(shareData);
  } catch (err) {
    // This fires if the user aborts the shareApi, but also,
    // Chrome 80 erroneously returns true for canShare() on desktop
    // So navigator.share() throws and error. So we check the error and maybe tweet
    if (err.message.startsWith('Internal error')) tweetViaUrl();
  }
};
