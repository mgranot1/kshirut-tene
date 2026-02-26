import { IUserUnit } from "../../report/types/userUnit.types";

// Stub matomo-client functions for local/demo mode
const bootstrap = (..._args: any[]) => ({ click: () => { }, all: () => { } });
const event = (..._args: any[]) => { };

const MATOMO_ADDRESS = import.meta.env.VITE_MATOMO_ADDRESS;
const MATOMO_ID = import.meta.env.VITE_MATOMO_ID;

export let isMatomoInit = false;
//@ts-ignore
var _paq = window._paq || [];

let lastTrackedPath: string | null = null;
let lastTrackedTime: number | null = null;

export enum MatomoCategory {
  ClICK = "Click",
  VIEW = "View",
}

export const setUserDetails = (user: IUserUnit) => {
  if (isMatomoInit) {
    _paq.push(["setUserId", user.username]);
    _paq.push(["setCustomVariable", 1, "emergencyLevel", user.emergencyLevel]);
    _paq.push(["setCustomVariable", 2, "routineLevel", user.routineLevel]);
    _paq.push([
      "setCustomVariable",
      3,
      "emergencyLevelDesc",
      user.emergencyLevelDesc,
    ]);
    _paq.push([
      "setCustomVariable",
      4,
      "routineLevelDesc",
      user.routineLevelDesc,
    ]);
  }
};

export const initMatomo = (user: IUserUnit) => {
  if (!MATOMO_ADDRESS || !MATOMO_ID) {
    console.warn("Matomo address or ID is missing. Skipping initialization.");
    return;
  }

  isMatomoInit = true;

  _paq.push(["enableLinkTracking"]);
  _paq.push(["setDoNotTrack", true]);

  setUserDetails(user);

  const globalEvents = bootstrap(MATOMO_ADDRESS, MATOMO_ID.toString());
  globalEvents.click();
  globalEvents.all();
};

export const trackPageView = (path: string, title: string) => {
  if (!_paq) return;

  const now = Date.now();

  if (
    lastTrackedPath == path &&
    lastTrackedTime &&
    now - lastTrackedTime < 1000
  ) {
    return;
  }
  _paq.push(["setDocumentTitle", title]);
  _paq.push(["trackPageView"]);

  lastTrackedPath = path;
  lastTrackedTime = now;
};

export const matomoEvent = (
  action: string,
  category: MatomoCategory,
  data: string,
  value: number,
) => {
  event(category, action, data, 0);
};
