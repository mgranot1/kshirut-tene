import { useRef } from "react";

const useReflow = <T extends HTMLDivElement>() => {
  const elementToReflowRef = useRef<T>(null);

  const reflow = () => {
    if (elementToReflowRef.current) {
      const _ = elementToReflowRef.current.offsetHeight; // Triggers reflow
    }
  };

  return { reflow, elementToReflowRef };
};

export default useReflow;
