import { useRecoilValue } from "recoil";
import KshirutPieGraph from "../../../report/components/PieGraph/KshirutPieGraph";
import PieWithExpectedGraph from "../../../report/components/PieWithExpectedGraph/PieWithExpectedGraph";
import { useNavigateFromGraph } from "../../hooks/useNavigateFromGraph";
import { ScreenMode, screenModeState } from "../../stores/screenMode.store";
import type {
  FreeTextData,
  GraphDataMap,
  IComponent,
  PieWithExpectedData,
} from "../../types/component.types";
import { ComponentType } from "../../types/component.types";
import FreeTextCard from "../FreeTextCard/FreeTextCard";
import "./GraphGenerator.scss";

interface IGraphGeneratorProps<T extends ComponentType> {
  type: T;
  graphData: GraphDataMap[T];
  componentId: IComponent["id"];
  toWarningThreshold?: number;
  toSevereThreshold?: number;
}

const GraphGenerator = <T extends ComponentType>({
  componentId,
  type,
  graphData,
  toWarningThreshold,
  toSevereThreshold,
}: IGraphGeneratorProps<T>) => {
  const screenMode = useRecoilValue<ScreenMode>(screenModeState);
  const { handleNavigateFromPieGraph } = useNavigateFromGraph();

  switch (type) {
    case ComponentType.Pie:
      return (
        <div
          className="graphGenerator__pieGraphContainer"
          onClick={(e) => {
            screenMode === ScreenMode.ReadOnly &&
              handleNavigateFromPieGraph(componentId, e);
          }}
        >
          <KshirutPieGraph
            toWarningThreshold={toWarningThreshold}
            toSevereThreshold={toSevereThreshold}
            totalEquipmentsCount={graphData.total}
            kashirEquipmentsCount={graphData.kashir}
          />
        </div>
      );
    case ComponentType.PieWithExpected:
      return (
        <PieWithExpectedGraph
          componentId={componentId}
          toWarningThreshold={toWarningThreshold}
          toSevereThreshold={toSevereThreshold}
          kshirutData={graphData as PieWithExpectedData}
        />
      );
    case ComponentType.FreeText:
      return (
        <div className="graphGenerator__freeTextContainer">
          <FreeTextCard
            data={graphData as FreeTextData}
          />
        </div>
      );
    default:
      return <p>Unsupported graph type</p>;
  }
};
export default GraphGenerator;
