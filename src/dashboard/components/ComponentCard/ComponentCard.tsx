import EditIcon from "@assets/dashboard/edit.svg";
import FamilyIcon from "@assets/dashboard/fam-icon.svg";
import InfoIcon from "@assets/dashboard/info-icon.svg";
import OrgLevelIcon from "@assets/dashboard/org-icon.svg";
import TrashIcon from "@assets/dashboard/trash.svg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Tooltip } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCustomScreenActions } from "../../hooks/useCustomScreenActions";
import { Drilltype } from "../../pages/CustomScreen/CustomScreen";
import { ScreenMode, screenModeState } from "../../stores/screenMode.store";
import { selectedComponentsState } from "../../stores/selectedComponents.store";
import {
  ComponentType,
} from "../../types/component.types";
import type {
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
  isImporting?: boolean;
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
  isImporting,
}: IComponentCardProps<T>) => {
  const screenMode = useRecoilValue<ScreenMode>(screenModeState);
  const [selectedComponents, setSelectedComponents] = useRecoilState(selectedComponentsState);
  const { handleSubmitScreenActions } = useCustomScreenActions();

  const isSelected = selectedComponents.includes(id);

  const handleToggleSelect = () => {
    if (screenMode !== ScreenMode.Select) return;
    setSelectedComponents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={`card ${screenMode === ScreenMode.Select ? "select-mode" : ""} ${isSelected ? "selected" : ""
        } ${isImporting ? "importing" : ""}`}
      onClick={handleToggleSelect}
    >
      {isImporting && (
        <div className="card__import-badge">
          <span>נוסף כעת</span>
        </div>
      )}
      <div className="card__header">
        <div className="card__title">
          <Tooltip title={name} children={<p>{name}</p>}></Tooltip>
        </div>
        {screenMode === ScreenMode.Edit ? (
          <div className="card__buttons">
            <img
              className="card__icon edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(id);
                handleSubmitScreenActions();
              }}
              src={EditIcon}
            />
            <img
              className="card__icon delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(id);
              }}
              src={TrashIcon}
            />
          </div>
        ) : screenMode === ScreenMode.Select ? (
          <div className="card__buttons">
            {isSelected && (
              <CheckCircleIcon sx={{ color: "#3b82f6", fontSize: "1.5rem" }} />
            )}
          </div>
        ) : (
          <div className="card__buttons">
            {onDrilldown && type !== ComponentType.FreeText && (
              <Tooltip
                title="צלילה לפי צו ארגון"
                children={
                  <img
                    className="card__icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDrilldown(id, Drilltype.ByOrgLevel);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onDrilldown(id, Drilltype.ByFamily);
                    }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(id);
                  }}
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
