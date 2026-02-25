import BrowserError from "./shared/components/BrowserError/BrowserError";
import checkBrowserViteCompatibility from "./shared/utils/browser.utils";

if (!checkBrowserViteCompatibility()) {
  document.documentElement.innerHTML = BrowserError();
  window.stop();
  throw new Error("Unsupported browser version");
}

import("./main").catch(console.log);
