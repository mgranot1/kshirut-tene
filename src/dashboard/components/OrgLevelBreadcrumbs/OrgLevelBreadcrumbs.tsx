import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGetTreeTypes } from "../../../shared/services/tsavIrgunService/useGetOperations";
import { ITsavIrgunLevel } from "../../../shared/types/tsavIrgun.types";
import { ROUTINE_TREE_TYPE } from "../../../shared/utils/constants";
import {
  filterTsavsByTreeBelonging,
  getLevelsOptions,
  isEmergencyTree,
} from "../../../shared/utils/orgLevel.utils";
import {
  emptyLevelsOptions,
  filteredLevelsOptionsState,
} from "../../stores/filteredLevelsOptions.store";
import { nextOrgLevelState } from "../../stores/nextOrgLevel.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";
import {
  emptyOrganizationalLevel,
  LevelsOptions,
  OrganizationalLevel,
  OrgLevelCode,
} from "../../types/dashboardOrgLevel.types";
import { completeTsavTreeInfo } from "../../utils/componentFilter.utils";
import BreadcrumbsDropdowns from "../BreadcrumbsDropdown/BreadcrumbsDropdown";
import "./OrgLevelBreadcrumbs.scss";
import OrgLevelBreadcrumbsSkeleton from "./OrgLevelBreadcrumbs.skeleton";

const OrgLevelBreadcrumbs = () => {
  const location = useLocation();

  const orgLevelFromDynamicScreen = location.state
    ?.OrgLevel as OrganizationalLevel;

  const [levelsOptions, setLevelsOptions] =
    useState<LevelsOptions>(emptyLevelsOptions);

  const [filteredLevelsOptions, setFilteredLevelsOptions] = useRecoilState(
    filteredLevelsOptionsState
  );

  const setNextOrgLevel = useSetRecoilState(nextOrgLevelState);

  const [orgTree, setOrgTree] = useRecoilState(orgTreeAtom);

  const [currentSelectedTsav, setCurrentSelectedTsav] = useState<
    OrganizationalLevel | undefined
  >(undefined);

  const currentLevelType: OrgLevelCode = useMemo(() => {
    if (!currentSelectedTsav) return OrgLevelCode.TREE_TYPE;
    const nextIndex = Object.values(currentSelectedTsav).findIndex(
      (orgLevel) => !orgLevel.length
    );

    return nextIndex > 0 ? nextIndex - 1 : nextIndex < 0 ? 4 : 0;
  }, [currentSelectedTsav]);

  const [openDropdown, setOpenDropdown] = useState<number>(-1);

  const isEmergency = useMemo(() => {
    if (!currentSelectedTsav) return false;
    return isEmergencyTree(currentSelectedTsav);
  }, [currentSelectedTsav, currentLevelType]);

  const handleNextOrgLevelChanges = (
    currentLevelType: OrgLevelCode,
    levelsOptions: LevelsOptions,
    copyOrganizationalLevel: OrganizationalLevel
  ) => {
    const nextLevelKey = currentLevelType + 1;
    // End of path, save the current level
    if (currentLevelType === OrgLevelCode.GDUD) {
      setNextOrgLevel({
        levelCode: currentLevelType,
        options: [
          levelsOptions[currentLevelType]?.find((o) =>
            isEmergency
              ? o.objid === copyOrganizationalLevel[OrgLevelCode.GDUD][0]?.value
              : o.funcLoc ===
                copyOrganizationalLevel[OrgLevelCode.GDUD][0]?.value
          ) ?? ({} as ITsavIrgunLevel),
        ],
      });
    } else {
      setNextOrgLevel({
        levelCode: nextLevelKey,
        options: levelsOptions[nextLevelKey],
      });
    }
  };

  const handleSave = () => {
    if (!currentSelectedTsav) return;
    setOrgTree(currentSelectedTsav);
    handleNextOrgLevelChanges(
      currentLevelType,
      filteredLevelsOptions,
      currentSelectedTsav
    );
  };

  /*
~ Function handleTsavOptionsChange:
  handles the logic upon getting new tsavOptions from the server. It filters the tsavOptions by the belonging tsavs to the tsavTree
  and sets the nextOrgLevel state that will be the next dropdown available to the user.
*/
  const handleTsavOptionsChange = (
    tsavTree: OrganizationalLevel,
    tsavOptions: LevelsOptions,
    isEmergency: boolean
  ) => {
    const filteredLevels = filterTsavsByTreeBelonging(
      tsavOptions,
      tsavTree,
      isEmergency
    );

    const nextLevelKey = Object.values(tsavTree).findIndex(
      (orgLevel) => !orgLevel.length
    );

    handleNextOrgLevelChanges(
      nextLevelKey === -1 ? OrgLevelCode.GDUD : nextLevelKey - 1,
      filteredLevels,
      tsavTree
    );

    setFilteredLevelsOptions(filteredLevels);
  };

  const { data: treeTypes, isSuccess: getTreeTypesSuccess } = useGetTreeTypes();

  // do on fetching tree types
  useEffect(() => {
    const initialOrganizationLevel: OrganizationalLevel =
      orgLevelFromDynamicScreen ?? orgTree ?? emptyOrganizationalLevel;

    if (initialOrganizationLevel == orgLevelFromDynamicScreen) {
      // A query for the complete tsav labels should only happen if the user came from a custom screen, as the data is not ready-made
      completeTsavTreeInfo(initialOrganizationLevel).then((completeOrgTree) => {
        setCurrentSelectedTsav(completeOrgTree);
      });
      return;
    }

    if (!treeTypes) return;

    setLevelsOptions((prev) => ({
      ...prev,
      [OrgLevelCode.TREE_TYPE]: treeTypes,
    }));

    setFilteredLevelsOptions((prev) => ({
      ...prev,
      [OrgLevelCode.TREE_TYPE]: treeTypes,
    }));

    if (initialOrganizationLevel[OrgLevelCode.TREE_TYPE]) {
      if (
        treeTypes.findIndex(
          (type) =>
            type.funcLoc ===
            initialOrganizationLevel![OrgLevelCode.TREE_TYPE][0]?.value
        ) === -1
      ) {
        setCurrentSelectedTsav(emptyOrganizationalLevel);
        setOrgTree(emptyOrganizationalLevel);
      } else {
        setCurrentSelectedTsav(initialOrganizationLevel);
        // Tree type selected and still exist.
        getLevelsOptions(
          initialOrganizationLevel[OrgLevelCode.TREE_TYPE][0].value,
          treeTypes,
          initialOrganizationLevel[OrgLevelCode.TREE_TYPE][0].value !==
            ROUTINE_TREE_TYPE
        ).then((levels) => {
          setLevelsOptions(levels);
          handleTsavOptionsChange(
            initialOrganizationLevel,
            levels,
            isEmergencyTree(initialOrganizationLevel)
          );
        });
      }
    }
  }, [orgLevelFromDynamicScreen, getTreeTypesSuccess]);

  return !currentSelectedTsav ? (
    <OrgLevelBreadcrumbsSkeleton />
  ) : (
    <>
      <div className="orgLevelBreadcrumbs">
        <BreadcrumbsDropdowns
          currentLevel={currentLevelType}
          levelsOptions={levelsOptions}
          onLevelsOptionsChange={setLevelsOptions}
          filteredLevelsOptions={filteredLevelsOptions}
          onFilteredOptionsChange={setFilteredLevelsOptions}
          onSave={handleSave}
          isEmergency={isEmergency}
          selectedOrgLevel={currentSelectedTsav}
          onSelectOrgLevel={setCurrentSelectedTsav}
          openDropdown={openDropdown}
          onLabelClick={(index) =>
            !orgLevelFromDynamicScreen && setOpenDropdown(index)
          }
          onOuterClick={() => setOpenDropdown(-1)}
          isMulti={!!orgLevelFromDynamicScreen}
        />
      </div>
    </>
  );
};

export default OrgLevelBreadcrumbs;
