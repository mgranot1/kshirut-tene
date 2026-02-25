import { MutableRefObject, useEffect, useState } from "react";

const useOnScreen = (
  ref: MutableRefObject<Element>,
  rootMargin = "0px",
  threshold = 0.1
) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    // In case IntersectionObserver API is not supported, return true as element is in screen
    if (!window.IntersectionObserver) {
      setIntersecting(true);
      return;
    }

    const element = ref?.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold,
      }
    );
    if (element) {
      observer.observe(element);
    }
    return () => {
      element && observer.unobserve(element);
    };
  }, []);
  return isIntersecting;
};

export default useOnScreen;
