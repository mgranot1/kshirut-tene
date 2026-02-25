import { useCallback, useEffect, useState } from "react";

// Likewise useOnScreen but with dynamic refs, changes elemnts refs
const useOnScreenDynamically = (
  shouldObserve = true,
  rootMargin = "0px",
  threshold = 0.1
) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const elementRef = useCallback((node: Element) => {
    if (node !== null) {
      setElement(node);
    }
  }, []);

  useEffect(() => {
    // In case IntersectionObserver API is not supported, return true as element is in screen
    if (!window.IntersectionObserver) {
      setIntersecting(true);
      return;
    }

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
    if (element && shouldObserve) {
      observer.observe(element);
    }
    return () => {
      element && observer.unobserve(element);
    };
  }, [element, rootMargin, shouldObserve, threshold]);
  return { isIntersecting, elementRef };
};

export default useOnScreenDynamically;
