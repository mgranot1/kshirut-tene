import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext } from "react-router";

export const useChromeNavigationListener = (callback) => {
  const navigator = useContext(UNSAFE_NavigationContext).navigator;

  useEffect(() => {
    const listener = ({ location, action }) => {
      if (action === "POP" || action === "PUSH") {
        callback({ location, action });
      }
    };

    // const unListen = navigator.listen(listener)

    // return unListen
  }, [callback, navigator]);
};
