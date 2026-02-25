import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { IDevelopmentData } from "../../report/components/DevelopmentGraph/DevelopmentGraph";
import { getFiltersByComponentId } from "../../report/services/kshirutData/filter.service";
import { SitePaths } from "../../router/routes";
import {
  ExpectedTime,
  FaultStatus,
  Kshirut,
} from "../../shared/types/params.types";
import { MAIN_COMPONENT_INDEX } from "../pages/DrillDownScreen/DrillDownScreen";
import { drillStackAtom } from "../stores/drillStack.store";
import { kshirutTypeState } from "../stores/kshirutType.store";
import { IComponent } from "../types/component.types";
import { IComponentFilter } from "../types/componentFilter.types";
import { TDrillStack } from "../types/drilldown.types";
import { mapComponentFiltersToFilterChanges } from "../utils/componentFilter.utils";
import useDbdGeneralFilters from "./useDbdFilters";

export const useNavigateFromGraph = () => {
  const navigate = useNavigate();
  const kshirutType = useRecoilValue(kshirutTypeState);
  const drillStack = useRecoilValue<TDrillStack[]>(drillStackAtom);
  const { addFilters } = useDbdGeneralFilters();

  const getGraphFilters = async (componentId: IComponent["id"]) => {
    let filters: IComponentFilter[];

    // If the componet id is pure number (only digit) - navigation from drilldown screen => data from drillStack store.
    if (componentId === MAIN_COMPONENT_INDEX.toString()) {
      filters = drillStack[drillStack.length - 1].mainComponent?.filters;
    } else if (/^\d+$/.test(componentId)) {
      filters =
        drillStack[drillStack.length - 1].components[componentId]?.filters;
    } else {
      filters = await getFiltersByComponentId(componentId);
    }

    return mapComponentFiltersToFilterChanges(filters);
  };

  const handleNavigateFromBarGraph = async (
    graphUnit: IDevelopmentData,
    componentId: IComponent["id"],
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    const convertedData = await getGraphFilters(componentId);

    addFilters(
      [
        {
          fieldKey: "expectedTime",
          filterValues: [6, 12, 24, 48, 72]
            .filter((i) => Number(graphUnit.hoursLabel.split(" ")[0]) >= i)
            .map((i) => {
              return ExpectedTime[`LessThan${i}`];
            }),
          fieldOptions: { isNotEqual: true },
        },
        {
          fieldKey: kshirutType.value,
          filterValues: [Kshirut.Not_Kashir],
        },
        {
          fieldKey: "faultStatus",
          filterValues: [FaultStatus.Done],
          fieldOptions: { isNotEqual: true },
        },

        ...convertedData.filters,
      ],
      { clear: true }
    );
    navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`, {
      state: {
        visibleColumns: ["expectedTime", "faultNum"],
        OrgLevel: convertedData.orgLevel,
      },
    });
  };

  const handleNavigateFromPieGraph = async (
    componentId: IComponent["id"],
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    const convertedData = await getGraphFilters(componentId);

    addFilters(
      [
        {
          fieldKey: kshirutType.value,
          filterValues: [Kshirut.Not_Kashir],
        },

        ...convertedData.filters,
      ],
      { clear: true }
    );

    navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`, {
      state: {
        visibleColumns: ["expectedTime", "faultNum"],
        OrgLevel: convertedData.orgLevel,
      },
    });
  };
  return { handleNavigateFromBarGraph, handleNavigateFromPieGraph };
};
