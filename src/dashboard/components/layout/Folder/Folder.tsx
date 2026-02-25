import ArrowIcon from "@assets/dashboard/down-arrow-gray.svg";
import { IScreen } from "../../../types/screen.types";
import ScreenRecord from "../ScreenRecord/ScreenRecord";
import "./Folder.scss";

export type FolderItem = {
  id: string;
  title: string;
  content: string;
};

interface IFolderProps {
  id: string;
  name: string;
  screens: IScreen[];
  isOpen: boolean;
  onToggleFolder: () => void;
}

const Folder = ({
  id,
  name,
  screens,
  isOpen,
  onToggleFolder,
}: IFolderProps) => {
  return (
    <div className="Folder" key={id}>
      <div className="Folder__title" onClick={() => onToggleFolder()}>
        <img
          src={ArrowIcon}
          className={`Folder__title--icon ${!isOpen ? "close" : ""}`}
        />
        <span>{name}</span>
      </div>

      <div className={`Folder__content ${isOpen ? "openFolder" : "closedFolder"}`}
        style={{ "--drawer-height": `${screens.length * 3.5}rem` } as React.CSSProperties}>
        {screens.map((screen) => (
          <ScreenRecord
            key={screen.id}
            id={screen.id}
            text={screen.name}
            color={screen.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Folder;
