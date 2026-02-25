import { useRecoilValue } from "recoil";
import { useNavigateFromGraph } from "../../../dashboard/hooks/useNavigateFromGraph";
import {
  ScreenMode,
  screenModeState,
} from "../../../dashboard/stores/screenMode.store";
import {
  IComponent,
  PieWithExpectedData,
} from "../../../dashboard/types/component.types";
import { calcPercent } from "../../../shared/utils/percentage.util";
import DevelopmentGraph from "../DevelopmentGraph/DevelopmentGraph";
import KshirutPieGraph from "../PieGraph/KshirutPieGraph";
import "./PieWithExpectedGraph.scss";

interface IPieWithExpectedGraphProps {
  componentId: IComponent["id"];
  kshirutData: PieWithExpectedData;
  toWarningThreshold?: number;
  toSevereThreshold?: number;
}

const PieWithExpectedGraph = ({
  componentId,
  kshirutData,
  toWarningThreshold,
  toSevereThreshold,
}: IPieWithExpectedGraphProps) => {
  const screenMode = useRecoilValue<ScreenMode>(screenModeState);
  const { handleNavigateFromPieGraph } = useNavigateFromGraph();

  return (
    <div className="expandedKshirutDevelopement">
      <div
        className="expandedKshirutDevelopement__PieGraph"
        onClick={(e) => {
          screenMode === ScreenMode.ReadOnly &&
            handleNavigateFromPieGraph(componentId, e);
        }}
      >
        <KshirutPieGraph
          toWarningThreshold={toWarningThreshold}
          toSevereThreshold={toSevereThreshold}
          totalEquipmentsCount={kshirutData.total}
          kashirEquipmentsCount={kshirutData.kashir}
        />
      </div>
      <div className="expandedKshirutDevelopement__separateLine"></div>
      <div className="expandedKshirutDevelopement__barGraph">
        <DevelopmentGraph
          componentId={componentId}
          toWarningThreshold={toWarningThreshold}
          toSevereThreshold={toSevereThreshold}
          data={[
            {
              amountAll: kshirutData.total,
              amountNotKashir: kshirutData.total - kshirutData.kashirOn24,
              hoursLabel: "24 שעות",
              amountLabel: `${kshirutData.kashirOn24}/${kshirutData.total}`,
              tooltipValue: `${kshirutData.kashirOn24} כשירים\n ${kshirutData.total - kshirutData.kashirOn24} לא כשירים`,
              percent: calcPercent(kshirutData.kashirOn24, kshirutData.total),
            },
            {
              amountAll: kshirutData.total,
              amountNotKashir: kshirutData.total - kshirutData.kashirOn48,
              hoursLabel: "48 שעות",
              amountLabel: `${kshirutData.kashirOn48}/${kshirutData.total}`,
              tooltipValue: `${kshirutData.kashirOn48} כשירים\n ${kshirutData.total - kshirutData.kashirOn48} לא כשירים`,
              percent: calcPercent(kshirutData.kashirOn48, kshirutData.total),
            },
            {
              amountAll: kshirutData.total,
              amountNotKashir: kshirutData.total - kshirutData.kashirOn72,
              hoursLabel: "72 שעות",
              amountLabel: `${kshirutData.kashirOn72}/${kshirutData.total}`,
              tooltipValue: `${kshirutData.kashirOn72} כשירים\n ${kshirutData.total - kshirutData.kashirOn72} לא כשירים`,
              percent: calcPercent(kshirutData.kashirOn72, kshirutData.total),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PieWithExpectedGraph;
