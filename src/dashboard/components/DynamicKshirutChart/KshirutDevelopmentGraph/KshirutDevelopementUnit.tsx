import { Tooltip } from "@mui/material";
import { CSSProperties } from "react";
import { getGraphColor } from "../../../../shared/utils/kshirutPercentColor";
import { calcPercent } from "../../../../shared/utils/percentage.util";
import { IDashboardFiltersValue } from "../../../types/filters.types";
import { KshirutAmount } from "../../../types/topview.types";
import { IDynamicChartFilters } from "../DynamicKshirutChart";
import "./KshirutDevelopementUnit.scss";

interface IKshirutDevelopmentUnitProps extends KshirutAmount {
  hours: 6 | 12 | 24 | 48 | 72;
  variantFilters: IDashboardFiltersValue<IDynamicChartFilters>[];
  toWarningThreshold?: number;
  toSevereThreshold?: number;
  isAmountVisible: boolean;
  onBarClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function KshirutDevelopmentUnit(props: IKshirutDevelopmentUnitProps) {
  const percent = calcPercent(
    props.kashirEquipmentsCount,
    props.totalEquipmentsCount
  );

  const notKashirAmount =
    props.totalEquipmentsCount - props.kashirEquipmentsCount;
  return (
    <div className="kshirutDevelopementUnit">
      <Tooltip
        title={
          <>
            {props.kashirEquipmentsCount} כשירים
            <br />
            {notKashirAmount} לא כשירים
          </>
        }
        placement="top"
        arrow
      >
        <div
          className="kshirutDevelopementUnit__longLine"
          onClick={props.onBarClick}
        >
          <div
            className="kshirutDevelopementUnit__shortLine"
            style={
              {
                "--percent": percent,
                "--barColor": getGraphColor(
                  props.totalEquipmentsCount,
                  notKashirAmount,
                  props.toWarningThreshold,
                  props.toSevereThreshold
                ),
                "--invert-percentage": `${100 - percent}rem`,
              } as CSSProperties
            }
          >
            <p className="kshirutDevelopementUnit__percentText">{percent}%</p>
          </div>
        </div>
      </Tooltip>

      <div className="kshirutDevelopementUnit__hours">
        {props.isAmountVisible && (
          <p className="kshirutDevelopementUnit__kshirimText">
            {props.kashirEquipmentsCount}/{props.totalEquipmentsCount}
          </p>
        )}

        <p>{props.hours} שעות</p>
      </div>
    </div>
  );
}

export default KshirutDevelopmentUnit;
