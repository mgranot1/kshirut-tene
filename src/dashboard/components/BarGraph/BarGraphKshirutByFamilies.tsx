import PinOutlinedIcon from "@mui/icons-material/PinOutlined";
import { useState } from "react";
import { HierLevel } from "../../types/family.types";
import { KshirutByFamily } from "../../types/topview.types";
import BarGraph from "./BarGraph";
import "./BarGraphKshirutByFamilies.scss";

type BarGraphKshirutByFamiliesProps = {
  minimalHierarchy: HierLevel;
  kshirutByFamilies: KshirutByFamily[];
};

const BarGraphKshirutByFamilies = (props: BarGraphKshirutByFamiliesProps) => {
  const [isAmountVisible, setIsAmountVisible] = useState<boolean>(true);

  const familiesThatHaveEquipments = props.kshirutByFamilies.filter(
    (f) => f.total > 0
  );

  const getTitleByFamilyLevel = () => {
    if (props.minimalHierarchy === HierLevel.All) return "כשירות לפי משפחות";

    if (props.minimalHierarchy === HierLevel.Family)
      return "כשירות לפי פלטפורמות";

    if (props.minimalHierarchy === HierLevel.Platform)
      return "כשירות לפי תתי פלטפורמות";

    return "כשירות לפי חומרים ";
  };

  return (
    <div className="bar-graph-container">
      <div className="bar-graph-container_TitlesContainer">
        <div className="bar-graph-container__title">
          {getTitleByFamilyLevel()}
        </div>
        <div
          className=" bar-graph-container__displayModeBtn"
          onClick={(e) => {
            e.stopPropagation();
            setIsAmountVisible((prev) => !prev);
          }}
        >
          <div className="bar-graph-container__iconContainer">
            <PinOutlinedIcon />
          </div>
        </div>
      </div>
      <div className="bar-graph-container__families">
        {familiesThatHaveEquipments.length ? (
          familiesThatHaveEquipments
            .sort((fam1, fam2) => (fam1.code > fam2.code ? 1 : -1))
            .map((familyData) => (
              <BarGraph
                isAmountVisible={isAmountVisible}
                key={familyData.code}
                family={familyData.title}
                amountAll={familyData.total}
                amountKashir={familyData.kshirim}
              />
            ))
        ) : (
          <div className="bar-graph-container__error">
            לא קיימים נתונים מהבחירה הנוכחית
          </div>
        )}
      </div>
    </div>
  );
};

export default BarGraphKshirutByFamilies;
