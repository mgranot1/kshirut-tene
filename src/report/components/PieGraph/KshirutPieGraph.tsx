import ProgressNumber from "../../../dashboard/components/ComponentCard/ProgressNumber";
import { KshirutAmount } from "../../../dashboard/types/topview.types";
import { getGraphColor } from "../../../shared/utils/kshirutPercentColor";
import { calcPercent } from "../../../shared/utils/percentage.util";
import CircularProgress from "../CircularProgress/CircularProgress";
import "./KshirutPieChart.scss";

export interface IKshirutPieGraphProps extends KshirutAmount {
  toWarningThreshold?: number;
  toSevereThreshold?: number;
}

const KshirutPieGraph = (props: IKshirutPieGraphProps) => {
  const chartPercent = calcPercent(
    props.kashirEquipmentsCount,
    props.totalEquipmentsCount
  );

  return (
    <div className="kshirutPie-container">
      <CircularProgress
        indicatorColor={getGraphColor(
          props.totalEquipmentsCount,
          props.totalEquipmentsCount - props.kashirEquipmentsCount,
          props.toWarningThreshold,
          props.toSevereThreshold
        )}
        size="8rem"
        value={chartPercent}
        renderText={(value) => (
          <div>
            <p style={{ fontSize: "2rem", fontWeight: "700" }}>
              <ProgressNumber number={chartPercent} />%
            </p>
            כשירים
          </div>
        )}
      />
      <div className="kshirutPie-data">
        <p className="kshirutPie-row">
          <span className="kshirutPie-label">כשיר</span>
          <span className="kshirutPie-value">
            {props.kashirEquipmentsCount}
          </span>
        </p>
        <p className="kshirutPie-row">
          <span className="kshirutPie-label">לא כשיר</span>
          <span className="kshirutPie-value">
            {props.totalEquipmentsCount - props.kashirEquipmentsCount}
          </span>
        </p>
        <hr />
        <p className="kshirutPie-row">
          <span className="kshirutPie-sum">{'סה"כ כלים'}</span>
          <span>{props.totalEquipmentsCount}</span>
        </p>
      </div>
    </div>
  );
};

export default KshirutPieGraph;
