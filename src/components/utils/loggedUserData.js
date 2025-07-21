export const UserBrowserInfo = () => {
  const domain = window.location.origin;
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenSize = `${window.screen.width}x${window.screen.height}`;

  return {
    domain,
    userAgent,
    platform,
    language,
    screenSize,
  };
};
