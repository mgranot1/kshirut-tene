import React from "react";
import "./DisableWrapper.scss";
interface IDisableWrapperProps {
  disabled: boolean;
  children: React.ReactNode;
}
const DisableWrapper = ({ disabled, children }: IDisableWrapperProps) => {
  return (
    <div className={`disableWrapper ${disabled && "disabled"}`}>{children}</div>
  );
};

export default DisableWrapper;
