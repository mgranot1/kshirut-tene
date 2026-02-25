import Tooltip from "@mui/material/Tooltip";
import { HTMLAttributes, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { ITsavIrgunLevel } from "../../../shared/types/tsavIrgun.types";
import { truncate_text } from "../../../shared/utils/general.utils";
import { calcKshirutPercent } from "../../../shared/utils/kshirut.utils";
import { getGraphColor } from "../../../shared/utils/kshirutPercentColor";
import { useGroupedEquipments } from "../../hooks/useGroupedEquipments";
import { Drilltype } from "../../pages/CustomScreen/CustomScreen";
import { EquipmentsByFamily } from "../../pages/TopViewFamiliesPage/TopViewFamilies";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { OrgLevelOptions } from "../../stores/nextOrgLevel.store";
import { OrgLevelCode } from "../../types/dashboardOrgLevel.types";
import { HierLevel } from "../../types/family.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import { KshirutAmount } from "../../types/topview.types";
import KshirutPercentage from "../KshirutPercentage/KshirutPercentage";
import "./KshirutFamilyCard.scss";

export type CardDetails = {
  description: string;
  hierLevel: OrgLevelCode | HierLevel;
  code: string;
  index: number;
};
interface IKshirutFamilyCardProps {
  isOverallCard: boolean;
  isPieVisible: boolean;
  cardDetails: CardDetails;
  columns: CardDetails[];
  equipments: GeneralDashboardTableRow[];
  kshirutAmount: KshirutAmount;
  onSelect: (cardDetails: CardDetails, drillType: Drilltype) => void;
  isRoutineTree: boolean;
  nextOrgLevel: OrgLevelOptions;
  percentageTabProps?: React.DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

export const OrgLevelFieldName = {
  [OrgLevelCode.PIKUD]: "pikud",
  [OrgLevelCode.UGDA]: "ugda",
  [OrgLevelCode.UTZVA]: "utzva",
  [OrgLevelCode.GDUD]: "routineTplnr",
};

export type EquipmentsByOrgLevel = {
  [orgLevel: ITsavIrgunLevel["funcLoc"]]: {
    equipments: GeneralDashboardTableRow[];
    notKashirAmount: number;
  };
};

const KshirutFamilyCard = ({
  isOverallCard,
  isPieVisible,
  cardDetails,
  equipments,
  columns,
  kshirutAmount,
  onSelect,
  isRoutineTree,
  percentageTabProps,
  nextOrgLevel,
}: IKshirutFamilyCardProps) => {
  const kshirutType = useRecoilValue(kshirutTypeState);
  const { groupedEquipmentsByFamilies } = useGroupedEquipments();

  const notKashirAmount =
    kshirutAmount.totalEquipmentsCount - kshirutAmount.kashirEquipmentsCount;
  const groupedEquipments: EquipmentsByFamily = useMemo(() => {
    return groupedEquipmentsByFamilies(
      equipments,
      kshirutType.value,
    );
  }, [equipments, kshirutType]);

  return (
    <div
      className={` kshirut-family-card 
      ${isOverallCard ? "overallContainer" : ""}
       ${isPieVisible ? "" : "compactView"}`}
      style={{
        borderRight: `solid 7px ${getGraphColor(kshirutAmount.totalEquipmentsCount, notKashirAmount)}`,
      }}
    >
      <div className="kshirut-family-card__data">
        <div className="kshirut-family-card__rightSide">
          <Tooltip title={cardDetails.description}>
            <span
              className={`kshirut-family-card__title ${isOverallCard ? "overallFontColor overallHoverSetting" : ""}`}
              onClick={() => onSelect(cardDetails, Drilltype.ByOrgLevel)}
            >
              {truncate_text(cardDetails.description)}
            </span>
          </Tooltip>
          <span
            className={`kshirut-family-card__content--value ${isOverallCard ? "overallFontColor" : ""} }`}
          >
            {`${kshirutAmount.kashirEquipmentsCount}`}/
            {`${kshirutAmount.totalEquipmentsCount}`}
          </span>
        </div>
        <div className="kshirut-family-card__LeftSide">
          <span
            style={{
              color: getGraphColor(
                kshirutAmount.totalEquipmentsCount,
                notKashirAmount
              ),
            }}
          >
            {`${calcKshirutPercent(kshirutAmount.totalEquipmentsCount, notKashirAmount)}%`}{" "}
          </span>
        </div>
        <div className="kshirut-family-card__section-divider"></div>
      </div>
      <div className="kshirut-family-card__container">
        <span></span>
        <div
          {...percentageTabProps}
          className={`kshirut-family-card__kshirut-percentage ${percentageTabProps?.className ?? ""}`}
        >
          {columns?.map(
            (column) =>
              groupedEquipments[column.code] && (
                <>
                  <KshirutPercentage
                    isOverallCard={isOverallCard}
                    isPieVisible={isPieVisible}
                    key={column.code}
                    kshirutAmount={{
                      kashirEquipmentsCount:
                        groupedEquipments[column.code].equipments.length -
                        groupedEquipments[column.code].notKashirAmount,
                      totalEquipmentsCount:
                        groupedEquipments[column.code].equipments.length,
                    }}
                  />
                  <div className="kshirut-family-card__divider"></div>
                </>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default KshirutFamilyCard;
