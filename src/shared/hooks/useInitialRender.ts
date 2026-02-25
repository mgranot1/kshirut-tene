import { useRef } from "react";

function useInitialRender(cb: () => void) {
  const isInitalRender = useRef(true);

  if (isInitalRender.current) {
    cb();
    isInitalRender.current = false;
  }
}

export default useInitialRender;
