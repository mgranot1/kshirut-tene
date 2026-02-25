import EditIcon from "@assets/dashboard/edit.svg";
import FamilyIcon from "@assets/dashboard/fam-icon.svg";
import InfoIcon from "@assets/dashboard/info-icon.svg";
import OrgLevelIcon from "@assets/dashboard/org-icon.svg";
import TrashIcon from "@assets/dashboard/trash.svg";
import { Tooltip } from "@mui/material";
import { useRecoilValue } from "recoil";
import { useCustomScreenActions } from "../../hooks/useCustomScreenActions";
import { Drilltype } from "../../pages/CustomScreen/CustomScreen";
import { ScreenMode, screenModeState } from "../../stores/screenMode.store";
import {
  ComponentType,
  GraphDataMap,
  IComponent,
} from "../../types/component.types";
import GraphGenerator from "../GraphGenerator/GraphGenerator";
import "./ComponentCard.scss";

interface IComponentCardProps<T extends ComponentType> {
  name: string;
  type: T;
  id: IComponent["id"];
  data: GraphDataMap[T];
  toWarningThreshold?: number;
  toSevereThreshold?: number;
  onView: (id: IComponent["id"]) => void;
  onDelete?: (id: IComponent["id"]) => void;
  onEdit?: (id: IComponent["id"]) => void;
  onDrilldown?: (componentIndex: IComponent["id"], by: Drilltype) => void;
}

const ComponentCard = <T extends ComponentType>({
  name,
  type,
  id,
  data,
  toWarningThreshold,
  toSevereThreshold,
  onDelete,
  onEdit,
  onView,
  onDrilldown,
}: IComponentCardProps<T>) => {
  const screenMode = useRecoilValue<ScreenMode>(screenModeState);
  const { handleSubmitScreenActions } = useCustomScreenActions();

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title">
          <Tooltip title={name} children={<p>{name}</p>}></Tooltip>
        </div>
        {screenMode === ScreenMode.Edit ? (
          <div className="card__buttons">
            <img
              className="card__icon edit-icon"
              onClick={() => {
                onEdit?.(id);
                handleSubmitScreenActions();
              }}
              src={EditIcon}
            />
            <img
              className="card__icon delete-icon"
              onClick={() => onDelete?.(id)}
              src={TrashIcon}
            />
          </div>
        ) : (
          <div className="card__buttons">
            {onDrilldown && type !== ComponentType.FreeText && (
              <Tooltip
                title="צלילה לפי צו ארגון"
                children={
                  <img
                    className="card__icon"
                    onClick={() => onDrilldown(id, Drilltype.ByOrgLevel)}
                    src={OrgLevelIcon}
                  />
                }
              />
            )}
            {onDrilldown && type !== ComponentType.FreeText && (
              <Tooltip
                title="צלילה לפי משפחות"
                children={
                  <img
                    className="card__icon"
                    onClick={() => onDrilldown(id, Drilltype.ByFamily)}
                    src={FamilyIcon}
                  />
                }
              />
            )}
            <Tooltip
              title="הגדרות רכיב"
              children={
                <img
                  className="card__icon"
                  onClick={() => onView(id)}
                  src={InfoIcon}
                />
              }
            />
          </div>
        )}
      </div>

      <div className="card__content">
        <GraphGenerator
          key={id}
          componentId={id}
          toWarningThreshold={toWarningThreshold}
          toSevereThreshold={toSevereThreshold}
          graphData={data}
          type={type}
        />
      </div>
    </div>
  );
};

export default ComponentCard;
