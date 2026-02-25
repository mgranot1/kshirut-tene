import questionIcon from "@assets/report/questionMark.svg";
import { Badge, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import Contact from "../../../../shared/components/Contact/Contact";
import "./Header.scss";
import ConcatPopover from "../../../../shared/components/Contact/ConcatPopover";

export interface IHeaderButton {
  button: JSX.Element;
  function: () => void;
}

interface HeaderProps {
  title: string;
  subTitle?: string;
  backButton?: IHeaderButton;
  leftButton?: JSX.Element;
  navButton?: JSX.Element;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subTitle,
  backButton,
  leftButton,
  navButton,
}) => {
  const [openContact, setOpenContact] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <div className="header">
      <div className="header__rightButtonContainer">
        <button
          className="header__rightButton generalButton"
          onClick={backButton?.function}
        >
          {backButton?.button}
        </button>
      </div>
      <div className="header__titles">
        <p className="header__mainTitle">{title}</p>
        {subTitle && <p className="header__subTitle">{subTitle}</p>}
      </div>

      <div className="header__leftButtonContainer">
        {leftButton}
        {openContact && <ConcatPopover open={openContact} position="right" anchorRef={buttonRef}>
          <Contact opened={openContact} setOpen={setOpenContact} />
        </ConcatPopover>}
        <Tooltip title="לפניות ושאלות לחץ כאן" placement="right" disableInteractive>
          <Badge
            className="header__contact--question-icon generalButton"
            color="primary"
            onClick={() => setOpenContact(true)}
          >
            <img src={questionIcon} />
          </Badge>
        </Tooltip>
        {navButton}
      </div>
    </div>
  );
};

export default Header;
