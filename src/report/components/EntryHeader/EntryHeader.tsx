import BackIcon from "@assets/report/backIcon.svg";
import { NavigateOptions, To, useNavigate } from "react-router-dom";
import "./EntryHeader.scss";

interface INavigate {
  to: To;
  options?: NavigateOptions | undefined;
}
interface IEntryHeaderProps {
  centerElement: JSX.Element;
  navigateTo: INavigate; //SitePaths;
}

const EntryHeader = ({ centerElement, navigateTo }: IEntryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="entryHeader">
      <div className="entryHeader__image">{centerElement}</div>
      <div className="entryHeader__back">
        <button
          className="entryHeader__btn"
          onClick={() => navigate(`../${navigateTo.to}`, navigateTo.options)}
        >
          <img src={BackIcon} className="entryHeader__icon" />
        </button>
      </div>
    </div>
  );
};

export default EntryHeader;
