import React, { useEffect, useState } from "react";
import "./CircularProgress.scss";

interface Props {
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  backgroundColor?: string;
  indicatorColor?: string;
  size?: string;
  renderText: (value: number) => React.ReactNode;
  value: number;
}

const CircularProgress = ({
  containerProps,
  backgroundColor = "#EBEFF4",
  indicatorColor = "black",
  size = "100px",
  renderText = (value) => `${value}%`,
  value = 100,
}: Props) => {
  const [render, setRender] = useState<boolean>(true);

  useEffect(() => {
    setRender(false);
  }, [value]);

  useEffect(() => {
    if (!render) {
      setRender(true);
    }
  }, [render]);

  return (
    <div
      {...containerProps}
      className={`${containerProps?.className} progress-circular__container`}
    >
      <svg
        viewBox="0 0 36 36"
        className="progress-circular__circle"
        style={{ width: size }}
      >
        <path
          className="progress-circular__circle-background"
          style={{
            stroke: backgroundColor,
          }}
          d="M18 2.0845
					  a 15.9155 15.9155 0 0 1 0 31.831
					  a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        {render && value > 0 && (
          <path
            className="progress-circular__circle-indicator"
            style={{
              stroke: indicatorColor,
            }}
            strokeDasharray={`${value + 1}, 100`}
            d="M18 2.0845
					  a 15.9155 15.9155 0 0 1 0 31.831
					  a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        )}
      </svg>
      <span className="progress-circular__text">{renderText(value)}</span>
    </div>
  );
};

export default CircularProgress;
