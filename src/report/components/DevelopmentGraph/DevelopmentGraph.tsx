import PinOutlinedIcon from "@mui/icons-material/PinOutlined";
import { Tooltip } from "@mui/material";
import { CSSProperties, useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigateFromGraph } from "../../../dashboard/hooks/useNavigateFromGraph";
import {
  ScreenMode,
  screenModeState,
} from "../../../dashboard/stores/screenMode.store";
import { IComponent } from "../../../dashboard/types/component.types";
import { getGraphColor } from "../../../shared/utils/kshirutPercentColor";
import "./DevelopementGraph.scss";

export interface IDevelopmentData {
  hoursLabel: string;
  tooltipValue: string;
  percent: number;
  amountLabel: string;
  amountAll: number;
  amountNotKashir: number;
}
interface IDevelopmentGraphProps {
  componentId: IComponent["id"];
  data: IDevelopmentData[];
  toWarningThreshold?: number;
  toSevereThreshold?: number;
}

const DevelopmentGraph = ({
  componentId,
  data,
  toWarningThreshold,
  toSevereThreshold,
}: IDevelopmentGraphProps) => {
  const [isAmountVisible, SetIsAmountVisible] = useState<boolean>(true);
  const screenMode = useRecoilValue<ScreenMode>(screenModeState);
  const { handleNavigateFromBarGraph } = useNavigateFromGraph();

  return (
    <div className="developementGraph">
      <div className="developementGraph__header">
        <div>
          <p className="title">התפתחות כשירות</p>
          <p className="subTitle">צפי כשירות לפי תקלות פתוחות</p>
        </div>
        <div className="developementGraph__buttonContainer">
          <div
            className="developementGraph__displayModeBtn"
            onClick={(e) => {
              e.stopPropagation();
              SetIsAmountVisible((prev) => !prev);
            }}
          >
            <div className="developementGraph__icon">
              <PinOutlinedIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="developementGraph__graph">
        {data.map((graphUnit, i) => {
          return (
            <div className="graph__unit" key={graphUnit.hoursLabel + i}>
              <Tooltip
                title={graphUnit.tooltipValue.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
                placement="top"
                arrow
              >
                <div
                  className="graph__longLine"
                  onClick={(e) => {
                    screenMode === ScreenMode.ReadOnly &&
                      handleNavigateFromBarGraph(graphUnit, componentId, e);
                  }}
                >
                  <div
                    className="graph__shortLine"
                    style={
                      {
                        "--percent": graphUnit.percent,
                        "--barColor": getGraphColor(
                          data[i].amountAll,
                          data[i].amountNotKashir,
                          toWarningThreshold,
                          toSevereThreshold
                        ),
                        "--invert-percentage": `${100 - graphUnit.percent}rem`,
                      } as CSSProperties
                    }
                  >
                    <p className="graph__percentText">{graphUnit.percent}%</p>
                  </div>
                </div>
              </Tooltip>
              <div className="graph__labelText">
                {isAmountVisible && (
                  <p className="graph__amountText">{graphUnit.amountLabel}</p>
                )}
                <p>{graphUnit.hoursLabel}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="line"></div>
    </div>
  );
};

export default DevelopmentGraph;
