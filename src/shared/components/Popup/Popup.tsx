import React, { PropsWithChildren } from "react";
import "./Popup.scss";

export interface AddYrmPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  closePopup: () => void;
}

const Popup: React.FC<PropsWithChildren<AddYrmPopupProps>> = ({
  closePopup,
  children,
  ...divProps
}) => {
  return (
    <div className="dialog" onMouseDown={closePopup}>
      <div
        {...divProps}
        className={`dialogBlock ${divProps.className ?? ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
export default Popup;
