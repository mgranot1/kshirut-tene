import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserUnit } from "../../../../report/hooks/useUserUnit";
import { SitePaths } from "../../../../router/routes";
import SharedIcon from "../../SharedIcon/SharedIcon";
import "./ScreenCard.scss";

interface IScreenCardProps {
  name: string;
  id: string;
  category: string;
  creator: string;
  color: string;
  isShared: boolean;
  onToggleSharedStatus: (value: boolean) => void;
}

const ScreenCard = ({
  name,
  id,
  category,
  creator,
  color,
  isShared,
  onToggleSharedStatus,
}: IScreenCardProps) => {
  const [userUnit] = useUserUnit();
  const navigate = useNavigate();

  return (
    <div
      className={`screen-card ${creator.includes(userUnit.username) ? "my-screen" : ""}`}
      onClick={() =>
        navigate(`../${SitePaths.CUSTOM_SCREEN}/${id}`, {
          state: { screenName: name, isShared: isShared },
        })
      }
    >
      <div className="screen-card__header">
        <div className="screen-card__header-right">
          <div
            className="screen-card__header--color"
            style={{ backgroundColor: `${color}` }}
          ></div>
          <Tooltip
            title={name}
            children={<span className="screen-card__header--title">{name}</span>}
          />
        </div>
        <div className="screen-card__header-left">
          <SharedIcon
            isShared={isShared}
            onToggleSharedStatus={onToggleSharedStatus}
            size="medium"
          />
          <span style={{ direction: "ltr" }}>{`#${id}`}</span>
        </div>
      </div>
      <div className="screen-card__body">
        <div className="screen-card__body--row">
          <span className="screen-card__body--bold">קטגוריה:</span>
          <span>{category}</span>
        </div>
        <div className="screen-card__body--row">
          <span className="screen-card__body--bold">בעלים:</span>
          <span>{creator}</span>
        </div>
      </div>
    </div>
  );
};

export default ScreenCard;
