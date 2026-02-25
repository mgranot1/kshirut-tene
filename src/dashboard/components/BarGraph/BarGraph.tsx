import { Tooltip } from "@mui/material";
import { CSSProperties } from "react";
import { calcKshirutPercent } from "../../../shared/utils/kshirut.utils";
import { getGraphColor } from "../../../shared/utils/kshirutPercentColor";
import "./BarGraph.scss";

interface BarGraphProps {
  family: string;
  amountAll: number;
  amountKashir: number;
  isAmountVisible: boolean;
}
const BarGraph = ({
  family,
  amountAll,
  amountKashir,
  isAmountVisible,
}: BarGraphProps) => {
  const percent = calcKshirutPercent(amountAll, amountAll - amountKashir);
  return (
    <div className="bar-graph">
      <Tooltip
        title={
          <>
            {amountKashir} תקינים
            <br />
            {amountAll} כלים
          </>
        }
        placement="top"
      >
        <div className="bar-graph__longLine">
          <div
            className="bar-graph__shortLine"
            style={
              {
                "--percent": percent,
                "--barColor": getGraphColor(amountAll, (amountAll - amountKashir)),
              } as CSSProperties
            }
          />
        </div>
      </Tooltip>
      <div className="bar-graph__text">
        <Tooltip title={family}>
          <>
            <div className="labelsContainer">
              <div className="bar-graph__text--percent">{percent}% </div>
              {isAmountVisible && (
                <div className="bar-graph__text--amount">
                  {amountKashir}/{amountAll}{" "}
                </div>
              )}
              <span>{family}</span>
            </div>
          </>
        </Tooltip>
      </div>
    </div>
  );
};

export default BarGraph;
