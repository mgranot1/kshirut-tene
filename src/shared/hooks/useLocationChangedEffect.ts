import { useEffect, useRef } from "react";
import { Location, useLocation } from "react-router-dom";

function getUrlPath(location: Location, isIncludeSearchParamsChanged: boolean) {
  return (
    location.pathname + (isIncludeSearchParamsChanged ? location.search : "")
  );
}

const useLocationChangedEffect = (
  cb: React.EffectCallback,
  isIncludeSearchParamsChanged: boolean = false
) => {
  const location = useLocation();
  const lastLocation = useRef<Location | null>(null);

  // Re-running animation of route wrapper when changing route
  // NOTE: IT WILL WORK ONLY WITH GIVEN CLASS ANIMATIONS AND NOT WITH STYLE ATTR TAG
  useEffect(() => {
    if (
      lastLocation &&
      lastLocation.current &&
      getUrlPath(location, isIncludeSearchParamsChanged) !==
        getUrlPath(lastLocation.current, isIncludeSearchParamsChanged)
    ) {
      cb();
    }
  }, [location, isIncludeSearchParamsChanged]);
};

export default useLocationChangedEffect;
