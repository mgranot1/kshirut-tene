import { useEffect, useState } from "react";

interface IProgressNumberProps {
  number: number;
  speed?: number;
}
const ProgressNumber = ({ number, speed = 10 }: IProgressNumberProps) => {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    setCount(0);
    let step = Math.max(1, Math.floor(number / 50));
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= number) {
          clearInterval(interval);
          return number;
        }
        return prev + step;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [number, speed]);

  return <span>{count}</span>;
};

export default ProgressNumber;
