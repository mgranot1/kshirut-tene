import KeyboardReturnSharpIcon from "@mui/icons-material/KeyboardReturnSharp";
import { Box, Button } from "@mui/material";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useGetTsavIrgun } from "../../../shared/services/tsavIrgunService/useGetTsavIrgun";
import { ROUTINE_TREE_TYPE } from "../../../shared/utils/constants";
import ComponentCard from "../../components/ComponentCard/ComponentCard";
import ComponentSetting from "../../components/ComponentSetting/ComponentSetting";
import { useComponentFilters } from "../../hooks/useComponentFilters";
import { useGetSplitComponent } from "../../services/component/useGetSplitComponent";
import { ComponentSettingMode } from "../../stores/componentSettingMode.store";
import { drillStackAtom } from "../../stores/drillStack.store";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { ComponentType, IComponent } from "../../types/component.types";
import {
  FilterOrgLevel,
  IComponentFilter,
} from "../../types/componentFilter.types";
import { OrgLevelCode } from "../../types/dashboardOrgLevel.types";
import { TDrillStack } from "../../types/drilldown.types";
import {
  getFamilyFilters,
  getTsavIrgunFilters,
} from "../../utils/componentFilter.utils";
import { isEndOfLevels } from "../../utils/drilldown.utils";
import { Drilltype } from "../CustomScreen/CustomScreen";
import "./DrillDownScreen.scss";
import DrillDownScreenSkeleton from "./DrillDownScreenSkeleton";
import { useGetMaterials } from "../../services/material/useGetMaterials";

export const CardWidthRem: Record<ComponentType, CSSProperties["width"]> = {
  [ComponentType.Pie]: "20rem",
  [ComponentType.PieWithExpected]: "40rem",
};
export const MAIN_COMPONENT_INDEX = -1;

const DrillDownScreen = () => {
  const [drillStack, setDrillStack] =
    useRecoilState<TDrillStack[]>(drillStackAtom);
  const [openComponentSetting, setOpenComponentSetting] =
    useState<boolean>(false);
  const [selectedComponentIndex, setSelectedComponentIndex] =
    useState<number>();
  const kshirutType = useRecoilValue(kshirutTypeState);
  const { data: componentDataAndOffspring, isLoading } = useGetSplitComponent(
    drillStack[drillStack.length - 1]?.drillBy,
    drillStack[drillStack.length - 1]?.mainComponent.filters,
    kshirutType.value,
    drillStack[0]?.mainComponent.data.type
  );
  const {data: materials} = useGetMaterials()
  const { componentFiltersFields } = useComponentFilters();
  const location = useLocation();
  const navigate = useNavigate();

  const currentMainComponent = useMemo(
    () => drillStack[drillStack.length - 1]?.mainComponent.data,
    [drillStack]
  );

  const addNextScreenToDrillStack = (screen: TDrillStack) => {
    const updatedScreen = {
      ...screen,
      mainComponent: {
        ...screen.mainComponent,
        data: {
          ...screen.mainComponent.data,
          id: MAIN_COMPONENT_INDEX.toString(),
        },
      },
    } as TDrillStack;

    setDrillStack((prev) => [...prev, updatedScreen]);
  };

  const removeCurrentScreenFromDrillStack = () => {
    setDrillStack((prev) => prev.slice(0, -1));
  };

  const handleDrilldown = (
    componentIndex: IComponent["id"],
    drillBy: Drilltype
  ) => {
    const prevStackItem = drillStack[drillStack.length - 1];

    if (
      isEndOfLevels(prevStackItem.components[componentIndex]?.filters, drillBy, materials??[])
    ) {
      toast("יותר נמוך מזה אין לאן לרדת :)", {
        style: {
          border: "1px solid rgb(235, 129, 58)",
          color: "rgb(235, 129, 58)",
        },
      });
      return;
    }

    addNextScreenToDrillStack({
      mainComponent: {
        filters: prevStackItem.components[componentIndex].filters,
        data: {
          ...prevStackItem.mainComponent.data,
          name:
            prevStackItem.mainComponent.data.name +
            " / " +
            prevStackItem.components[componentIndex].name,
          componentData: prevStackItem.components[componentIndex].data,
        },
      },
      components: [],
      drillBy: drillBy,
    });
  };

  const handleViewClick = (index: number) => {
    setSelectedComponentIndex(index);
    setOpenComponentSetting(true);
  };

  const currentOperation = useMemo(() => {
    return drillStack[0]?.mainComponent?.filters
      .find((f) => f.field === FilterOrgLevel[OrgLevelCode.TREE_TYPE])
      ?.value.toString();
  }, [drillStack[0]]);

  const { data: tsavIrgunData } = useGetTsavIrgun(
    currentOperation === ROUTINE_TREE_TYPE ? undefined : currentOperation
  );

  const getComponentTitle = async (
    filters: IComponentFilter[],
    by: Drilltype
  ): Promise<string> => {
    let componentTitle: string = "";

    if (by === Drilltype.ByOrgLevel) {
      const lowestOrgLevelFilterCode = getTsavIrgunFilters(filters)
        .sort((a, b) => parseInt(b.field, 10) - parseInt(a.field, 10))[0]
        .value.toString();

      const isRoutineTree =
        filters.find(
          (filter) => filter.field === FilterOrgLevel[OrgLevelCode.TREE_TYPE]
        )?.value === ROUTINE_TREE_TYPE;

      componentTitle =
        tsavIrgunData?.find(
          (tsav) =>
            isRoutineTree
              ? tsav.funcLoc === lowestOrgLevelFilterCode
              : tsav.objid.toString() ===
                String(Number(lowestOrgLevelFilterCode)) // objid is a number
        )?.funcLocDesc ??
        lowestOrgLevelFilterCode ??
        "צו ארגון";
    } else if (by === Drilltype.ByFamily) {
      const lowestFamilyFilter = getFamilyFilters(filters).sort(
        (a, b) => parseInt(b.field, 10) - parseInt(a.field, 10)
      )[0];

      const filterOptions = await componentFiltersFields
        .find((field) => field.fieldKey === lowestFamilyFilter?.field)
        ?.options();
        
      componentTitle =
        filterOptions?.find(
          (option) => option.value === lowestFamilyFilter?.value
        )?.text ?? "משפחה";
    }
    return componentTitle;
  };

  const handleBack = () => {
    if (drillStack.length === 1) {
      removeCurrentScreenFromDrillStack();
      navigate(-1);
    } else removeCurrentScreenFromDrillStack();
  };

  useEffect(() => {
    const initDrillStack = async () => {
      // Set components + data of main component of current screen (last item)
      if (componentDataAndOffspring) {
        const lastItemComponents = await Promise.all(
          [...componentDataAndOffspring.offspringFiltersAndData].map(
            async (comp) => ({
              ...comp,
              name: await getComponentTitle(
                comp.filters,
                drillStack[drillStack.length - 1].drillBy
              ),
            })
          )
        );

        setDrillStack((prev) => {
          if (prev.length === 0) return prev;

          return prev.map((item, index) => {
            if (index === prev.length - 1) {
              return {
                ...item,
                components: lastItemComponents,
                mainComponent: {
                  ...item.mainComponent,
                  data: {
                    ...item.mainComponent.data,
                    componentData: componentDataAndOffspring.mainCompData,
                  },
                },
              };
            }
            return item;
          });
        });
      }
    };

    initDrillStack();
  }, [componentDataAndOffspring]);

  // On reload page navigate to screen page
  useEffect(() => {
    if (drillStack.length === 0) {
      const pathParts = location.pathname.split("/");
      pathParts.pop();
      pathParts.pop();
      navigate(pathParts.join("/"));
    }
  }, []);

  if (isLoading)
    return (
      <DrillDownScreenSkeleton type={drillStack[0]?.mainComponent.data.type} />
    );

  return (
    /** @ts-ignore css variable */
    <Box
      className="DrillDownScreen"
      style={{
        ["--card-width"]: CardWidthRem[currentMainComponent?.type],
      }}
    >
      <Button className="DrillDownScreen__back" onClick={() => handleBack()}>
        <KeyboardReturnSharpIcon sx={{ width: "1.2rem" }} />
        <span>חזור </span>
      </Button>
      <Box className="DrillDownScreen__component">
        <ComponentCard
          id={currentMainComponent?.id}
          name={currentMainComponent?.name}
          type={currentMainComponent?.type}
          toWarningThreshold={currentMainComponent?.toWarningThreshold}
          toSevereThreshold={currentMainComponent?.toSevereThreshold}
          data={currentMainComponent?.componentData}
          onView={() => handleViewClick(MAIN_COMPONENT_INDEX)}
        />
      </Box>
      <div className="DrillDownScreen__separationLine"></div>
      <Box className="DrillDownScreen__components">
        {drillStack[drillStack.length - 1]?.components?.map(
          (component, index) => (
            <Box
              className="DrillDownScreen__component"
              key={index + component.name}
            >
              <ComponentCard
                key={index}
                id={index.toString()}
                name={component.name}
                type={currentMainComponent.type}
                toWarningThreshold={currentMainComponent.toWarningThreshold}
                toSevereThreshold={currentMainComponent.toSevereThreshold}
                data={component.data}
                onView={() => handleViewClick(index)}
                onDrilldown={handleDrilldown}
              />
            </Box>
          )
        )}
      </Box>
      {openComponentSetting && (
        <ComponentSetting
          mode={ComponentSettingMode.View}
          open={openComponentSetting}
          setOpen={setOpenComponentSetting}
          componentId={selectedComponentIndex + ""}
        />
      )}
    </Box>
  );
};
export default DrillDownScreen;
