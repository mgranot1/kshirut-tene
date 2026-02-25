import { RefObject, useEffect } from "react";

function useClickOutside(
  isListening: boolean,
  ref: RefObject<HTMLElement>,
  cb: () => void
) {
  useEffect(() => {
    function hanldeClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        {
          cb();
        }
      }
    }

    isListening && document.addEventListener("mousedown", hanldeClickOutside);

    return () => document.removeEventListener("mousedown", hanldeClickOutside);
  }, [ref, cb, isListening]);
}

export default useClickOutside;
