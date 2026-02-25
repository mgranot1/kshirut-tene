type Browser = "chrome" | "edge" | "firefox";
type BrowsersVersion = { [key in Browser]: number | null };

function getVersionOfMatch(m: RegExpMatchArray | null): number | null {
  return !m || m.length < 2 ? null : parseInt(m[1], 10);
}

function getBrowserVersions(): BrowsersVersion {
  const userAgent = window.navigator.userAgent;

  const chromeRegex = /Chrome\/(\d+)/;
  const firefoxRegex = /Firefox\/(\d+)/;
  const edgeRegex = /Edg\/(\d+)/;

  const chromeMatch = userAgent.match(chromeRegex);
  const firefoxeMatch = userAgent.match(firefoxRegex);
  const edgeeMatch = userAgent.match(edgeRegex);

  return {
    chrome: getVersionOfMatch(chromeMatch),
    firefox: getVersionOfMatch(firefoxeMatch),
    edge: getVersionOfMatch(edgeeMatch),
  };
}

export function checkBrowserCompatibility(
  minimumBrowsersVersions: BrowsersVersion
) {
  const currBrowser = getBrowserVersions();
  const browsers = Object.keys(currBrowser) as Browser[];
  let isCompability = true;

  for (let i = 0; i < browsers.length; i++) {
    const currVersion = currBrowser[browsers[i]];
    const minVersion = minimumBrowsersVersions[browsers[i]];

    if (currVersion && minVersion && minVersion > currVersion) {
      isCompability = false;
      break;
    }
  }

  return isCompability;
}

// IMPORTANT NOTE: You can support lower version using @vitejs/plugin-legacy if needed, we did not.
export default function checkBrowserViteCompatibility() {
  const VITE_BROWSER_COMPABILITY: BrowsersVersion = {
    chrome: 87,
    edge: 88,
    firefox: 78,
  };
  return checkBrowserCompatibility(VITE_BROWSER_COMPABILITY);
}
