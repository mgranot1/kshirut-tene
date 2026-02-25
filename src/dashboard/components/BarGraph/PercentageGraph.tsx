import { CSSProperties } from "react";
import { getGraphColor } from "../../../shared/utils/kshirutPercentColor";
import "./PercentageGraph.scss";
interface IPercentageGraphProps {
  percent: number;
  amountAll: number,
  amountNotKashir: number,
}
const PercentageGraph = ({ percent,amountAll,amountNotKashir }: IPercentageGraphProps) => {
  return (
    <div className="percentage-graph">
      <div
        className="percentage-graph__short-line"
        style={
          {
            "--percent": percent,
            "--color": getGraphColor(amountAll, amountNotKashir),
          } as CSSProperties
        }
      />
    </div>
  );
};

export default PercentageGraph;
