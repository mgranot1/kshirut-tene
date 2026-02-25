import { CSSProperties } from "react";
import { getGraphColor } from "../../utils/kshirutPercentColor";
import "./PercentGraph.scss";

const PercentGraph = ({ percent,amountAll, amountNotKashir  }) => {
  return (
    <div className="longLine">
      <div
        className="shortLine"
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

export default PercentGraph;
