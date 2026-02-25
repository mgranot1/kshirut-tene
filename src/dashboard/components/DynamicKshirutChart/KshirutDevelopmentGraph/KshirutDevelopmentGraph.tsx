import PinOutlinedIcon from "@mui/icons-material/PinOutlined";
import { useState } from "react";
import { ExpandedExpectedTime } from "../../../../shared/types/params.types";
import { IDashboardFiltersValue } from "../../../types/filters.types";
import { IDynamicChartFilters } from "../DynamicKshirutChart";
import "./KshirutDevelopementGraph.scss";
import KshirutDevelopmentUnit from "./KshirutDevelopementUnit";

export type BarDevelopment = {
  [equipment: string]: ExpandedExpectedTime[];
};

interface IKshirutDevelopmentGraphProps {
  variantFilters: Array<IDashboardFiltersValue<IDynamicChartFilters>>;
  kshirimIn24: number;
  kshirimIn48: number;
  kshirimIn72: number;
  totalEquipments: number;
  onBarClick: (hours: number) => void;
}

const KshirutDevelopmentGraph = (props: IKshirutDevelopmentGraphProps) => {
  const [isAmountVisible, setIsAmountVisible] = useState<boolean>(true);
  return (
    <div className="kshirutDevelopement">
      <div className="kshirutDevelopement_TitlesContainer">
        <div>
          <p className="kshirutDevelopement__title">התפתחות כשירות</p>
          <p className="kshirutDevelopement__subTitle">
            צפי כשירות לפי תקלות פתוחות
          </p>
        </div>

        <div
          className=" kshirutDevelopement__displayModeBtn"
          onClick={(e) => {
            e.stopPropagation();
            setIsAmountVisible(!isAmountVisible);
          }}
        >
          <div className="kshirutDevelopement__iconContainer">
            <PinOutlinedIcon />
          </div>
        </div>
      </div>

      <div className="kshirutDevelopement__graph">
        <KshirutDevelopmentUnit
          isAmountVisible={isAmountVisible}
          hours={24}
          kashirEquipmentsCount={props.kshirimIn24}
          totalEquipmentsCount={props.totalEquipments}
          variantFilters={props.variantFilters}
          onBarClick={() => props.onBarClick(24)}
        />
        <KshirutDevelopmentUnit
          isAmountVisible={isAmountVisible}
          hours={48}
          kashirEquipmentsCount={props.kshirimIn48}
          totalEquipmentsCount={props.totalEquipments}
          variantFilters={props.variantFilters}
          onBarClick={() => props.onBarClick(48)}
        />
        <KshirutDevelopmentUnit
          isAmountVisible={isAmountVisible}
          hours={72}
          kashirEquipmentsCount={props.kshirimIn72}
          totalEquipmentsCount={props.totalEquipments}
          variantFilters={props.variantFilters}
          onBarClick={() => props.onBarClick(72)}
        />
      </div>
      <div className="kshirutDevelopement__line" />
    </div>
  );
};

export default KshirutDevelopmentGraph;
