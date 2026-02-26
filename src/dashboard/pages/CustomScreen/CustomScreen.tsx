import EditIcon from "@assets/dashboard/edit.svg";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCurrentPath } from "../../../shared/hooks/useCurrentPath";
import ComponentCardWrapper from "../../components/ComponentCard/ComponentCardWrapper";
import ComponentSetting from "../../components/ComponentSetting/ComponentSetting";
import CustomScreenGrid, {
  Box,
} from "../../components/CustomScreenGrid/CustomScreenGrid";
import DashboardTitle from "../../components/layout/DashboardTitle/DashboardTitle";
import ScreenSetting from "../../components/ScreenSetting/ScreenSetting";
import SharedIcon from "../../components/SharedIcon/SharedIcon";
import useGetScreenComponents from "../../services/component/useGetScreenComponents";
import { TScreenActions } from "../../services/screen/screen.service";
import useGetScreens from "../../services/screen/useGetScreens";
import { useToggleShare } from "../../services/screen/useToggleShare";
import {
  ComponentSettingMode,
  componentSettingModeState,
} from "../../stores/componentSettingMode.store";
import { screenActionsState } from "../../stores/screenActions.store";
import { ScreenMode, screenModeState } from "../../stores/screenMode.store";
import { ComponentType } from "../../types/component.types";
import type {
  IBaseComponent,
  IComponent,
} from "../../types/component.types";
import { IScreen, ScreenAction } from "../../types/screen.types";
import { getNewComponentLocation } from "../../utils/component.utils";
import "./CustomScreen.scss";

export const CardWidth = {
  [ComponentType.Pie]: 1,
  [ComponentType.PieWithExpected]: 2,
  [ComponentType.FreeText]: 1,
};

export enum Drilltype {
  ByOrgLevel = "01",
  ByFamily = "02",
}

const boxToBaseComponent = (box: Box): IBaseComponent => ({
  id: box.id,
  compColumn: box.x,
  compRow: box.y,
  type: ComponentType.Pie, // Default for import mock
  screenId: "", // Not used in location calculation
});

const CustomScreen = () => {
  const currentScreenId = useCurrentPath();
  const screenMode = useRecoilValue<ScreenMode>(screenModeState);
  const [openScreenSetting, setOpenScreenSetting] = useState<boolean>(false);
  const [openComponentSetting, setOpenComponentSetting] =
    useState<boolean>(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string>("0");
  const [componentMode, setComponentMode] =
    useRecoilState<ComponentSettingMode>(componentSettingModeState);
  const [currentComponents, setCurrentComponents] = useState<Box[]>([]);
  const { data: components, isLoading: isLoadingComponents } =
    useGetScreenComponents(currentScreenId);
  const { data: screens, isLoading: isLoadingScreens } = useGetScreens();
  const setScreenActions =
    useSetRecoilState<TScreenActions>(screenActionsState);
  const location = useLocation();
  const { mutate: mutateToggle } = useToggleShare();
  const processedImports = useRef<string[]>([]);
  const lastScreenId = useRef<string>(currentScreenId);

  const handleDeleteComponent = (id: IComponent["id"]) => {
    setCurrentComponents((prev) => prev.filter((i) => i.id !== id));
    setScreenActions((prev) => ({
      ...prev,
      id: currentScreenId,
      compMeta: [
        ...prev.compMeta.filter((comp) => comp.id !== id),
        { id: id, compColumn: 0, compRow: 0, deletionFlag: true },
      ],
    }));
  };

  const handleComponentAction = (
    id: IComponent["id"],
    mode: ComponentSettingMode
  ) => {
    setComponentMode(mode);
    setSelectedComponentId(id);
    setOpenComponentSetting(true);
  };

  useEffect(() => {
    if (!components) return;

    if (lastScreenId.current !== currentScreenId) {
      processedImports.current = [];
      lastScreenId.current = currentScreenId;
    }

    const baseBoxes: Box[] = (components ?? [])?.map((component) => {
      const componentCard = (
        <ComponentCardWrapper
          id={component.id}
          type={component.type}
          onDelete={handleDeleteComponent}
          onEdit={() => {
            handleComponentAction(component.id, ComponentSettingMode.Edit);
          }}
          onView={() =>
            handleComponentAction(component.id, ComponentSettingMode.View)
          }
        />
      );

      return {
        x: component.compColumn,
        y: component.compRow,
        id: component.id,
        width: CardWidth[component.type],
        children: componentCard,
      } as Box;
    });

    let finalBoxes = [...baseBoxes];
    const importedIds = location.state?.importedComponents;

    if (importedIds?.length > 0 && processedImports.current !== importedIds) {
      const newImportBoxes: Box[] = [];

      importedIds.forEach((id: string) => {
        const type = ComponentType.Pie;
        const currentBaseComponents = [...finalBoxes, ...newImportBoxes].map(boxToBaseComponent);
        const pos = getNewComponentLocation(currentBaseComponents, type);

        const componentCard = (
          <ComponentCardWrapper
            id={id}
            type={type}
            onDelete={handleDeleteComponent}
            onEdit={() => {
              handleComponentAction(id, ComponentSettingMode.Edit);
            }}
            onView={() =>
              handleComponentAction(id, ComponentSettingMode.View)
            }
            isImporting={true}
          />
        );

        newImportBoxes.push({
          x: pos.compColumn,
          y: pos.compRow,
          id: `import-${id}-${currentScreenId}`,
          width: CardWidth[type],
          children: componentCard,
        } as Box);
      });

      finalBoxes = [...finalBoxes, ...newImportBoxes];
      processedImports.current = importedIds;

      // Clear the importing state after 5 seconds
      setTimeout(() => {
        setCurrentComponents(prev =>
          prev.map(box => {
            if (box.id.startsWith("import-")) {
              // Re-clone children to remove isImporting prop
              const child = box.children as React.ReactElement;
              return {
                ...box,
                children: React.cloneElement(child, { isImporting: false })
              };
            }
            return box;
          })
        );
      }, 5000);
    }

    setCurrentComponents(finalBoxes);
  }, [currentScreenId, components, location.state]);

  const { currentScreenName, isCurrentScreenShared } = useMemo(() => {
    const currentScreen: IScreen | undefined = (screens ?? []).find(
      (screen) => screen.id === currentScreenId
    );
    return {
      currentScreenName:
        currentScreen?.name ?? location.state?.screenName ?? "אינו זמין לצפיה",
      isCurrentScreenShared:
        currentScreen?.isShared ?? location.state?.isShared ?? false,
    };
  }, [currentScreenId, screens, location.state]);

  return (
    <>
      <div className="CustomScreen">
        {!isLoadingScreens && (
          <span className="CustomScreen__title">
            <div className="CustomScreen__title--text">
              <SharedIcon
                key={isCurrentScreenShared}
                isShared={isCurrentScreenShared}
                onToggleSharedStatus={() => {
                  mutateToggle({
                    action: isCurrentScreenShared
                      ? ScreenAction.Unshare
                      : ScreenAction.Share,
                    id: currentScreenId,
                  });
                }}
                size="large"
              />
              <DashboardTitle
                title={currentScreenName}
                subTitle={currentScreenId}
              />
            </div>
            {screenMode === ScreenMode.Edit && (
              <img
                className="CustomScreen__title--edit"
                onClick={() => setOpenScreenSetting(true)}
                src={EditIcon}
              />
            )}
          </span>
        )}
        {!isLoadingComponents && (
          <CustomScreenGrid
            boxes={currentComponents}
            setBoxes={setCurrentComponents}
          />
        )}
      </div>

      {openScreenSetting && (
        <ScreenSetting
          key={currentScreenId}
          open={openScreenSetting}
          setOpen={setOpenScreenSetting}
          currentScreenId={currentScreenId}
        />
      )}
      {openComponentSetting && (
        <ComponentSetting
          mode={componentMode}
          open={openComponentSetting}
          setOpen={setOpenComponentSetting}
          componentId={selectedComponentId}
        />
      )}
    </>
  );
};

export default CustomScreen;
