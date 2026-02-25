import TsavIrgunService from "../../shared/services/tsavIrgunService/tsavIrgun.service";
import { IOption } from "../../shared/types/general.types";
import { ROUTINE_TREE_TYPE } from "../../shared/utils/constants";
import { removeOperationFromString } from "../../shared/utils/orgLevel.utils";
import { FilterChange } from "../hooks/useDbdFilters";
import {
  FilterOrgLevel,
  FilterType,
  IComponentFilter,
} from "../types/componentFilter.types";
import {
  OrganizationalLevel,
  OrgLevelCode,
} from "../types/dashboardOrgLevel.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";

const getFilterKey = (field: FilterType): string => {
  const fieldString = Object.keys(FilterType).find(
    (key) => FilterType[key as keyof typeof FilterType] === field
  );
  if (!fieldString) throw new Error("invalid enum value");
  return fieldString?.charAt(0).toLowerCase() + fieldString?.slice(1);
};

export const getTsavIrgunFilters = (
  filters: IComponentFilter[]
): IComponentFilter[] => {
  return filters.filter((filter) =>
    [
      FilterOrgLevel[OrgLevelCode.TREE_TYPE],
      FilterOrgLevel[OrgLevelCode.PIKUD],
      FilterOrgLevel[OrgLevelCode.UGDA],
      FilterOrgLevel[OrgLevelCode.UTZVA],
      FilterOrgLevel[OrgLevelCode.GDUD],
    ].includes(filter.field)
  );
};

export const getFamilyFilters = (
  filters: IComponentFilter[]
): IComponentFilter[] => {
  return filters.filter((filter) =>
    [
      FilterType.MaterialFamily,
      FilterType.MainPlatform,
      FilterType.SecPlatform,
      FilterType.Material
    ].includes(filter.field)
  );
};

export const mapComponentFiltersToFilterChanges = (
  componentFilters: IComponentFilter[]
): {
  filters: FilterChange<GeneralDashboardTableRow>[];
  orgLevel: OrganizationalLevel;
} => {
  const organizationalFilters = componentFilters.filter((filter) =>
    [
      FilterOrgLevel[OrgLevelCode.TREE_TYPE],
      FilterOrgLevel[OrgLevelCode.PIKUD],
      FilterOrgLevel[OrgLevelCode.UGDA],
      FilterOrgLevel[OrgLevelCode.UTZVA],
      FilterOrgLevel[OrgLevelCode.GDUD],
    ].includes(filter.field)
  );

  const nonOrganizationalFilters = componentFilters.filter(
    (filter) => !organizationalFilters.includes(filter)
  );
  const grouped = nonOrganizationalFilters.reduce(
    (acc, filter) => {
      const fieldKey = getFilterKey(filter.field);
      if (!acc[fieldKey]) {
        acc[fieldKey] = [];
      }
      acc[fieldKey].push(filter.value);
      return acc;
    },
    {} as Record<string, (string | number | boolean)[]>
  );
  const filters = Object.keys(grouped).map((fieldKey) => ({
    fieldKey: fieldKey as keyof GeneralDashboardTableRow,
    filterValues: grouped[fieldKey],
  }));
  const orgLevel: OrganizationalLevel = ConvertFromFilterToOrgLevel(
    organizationalFilters
  );
  return {
    filters,
    orgLevel,
  };
};

const ConvertFromFilterToOrgLevel = (
  organizationalFilters: IComponentFilter[]
): OrganizationalLevel => {
  const orgLevel: OrganizationalLevel = {
    [OrgLevelCode.TREE_TYPE]: [],
    [OrgLevelCode.PIKUD]: [],
    [OrgLevelCode.UGDA]: [],
    [OrgLevelCode.UTZVA]: [],
    [OrgLevelCode.GDUD]: [],
  };
  organizationalFilters.forEach((filter) => {
    switch (filter.field) {
      case FilterOrgLevel[OrgLevelCode.TREE_TYPE]:
        orgLevel[OrgLevelCode.TREE_TYPE].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      case FilterOrgLevel[OrgLevelCode.PIKUD]:
        orgLevel[OrgLevelCode.PIKUD].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      case FilterOrgLevel[OrgLevelCode.UGDA]:
        orgLevel[OrgLevelCode.UGDA].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      case FilterOrgLevel[OrgLevelCode.UTZVA]:
        orgLevel[OrgLevelCode.UTZVA].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      case FilterOrgLevel[OrgLevelCode.GDUD]:
        orgLevel[OrgLevelCode.GDUD].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
    }
  });
  return orgLevel;
};

/*
~function completeTsavTreeInfo:
  Takes an OrganizationLevel object with incomplete data, i.e an object where the label is missing, but the tsav identifier ( objid for war and tlnr for routine )
  and returns a copy of the object but with the complete data

*/
export const completeTsavTreeInfo = async (
  tsavTree: OrganizationalLevel
): Promise<OrganizationalLevel> => {
  const completedTsavTree: OrganizationalLevel = { ...tsavTree };

  const operation = completedTsavTree[OrgLevelCode.TREE_TYPE][0];

  // Get from the input all the specified tsavs identifiers
  const tsavIdentifiers: string[] = Object.values(completedTsavTree).flatMap(
    (tsavsInLevel) => tsavsInLevel.map((tsav) => tsav.value)
  );

  const tsavInfo = await TsavIrgunService.getTsav(
    operation.value,
    tsavIdentifiers
  ); // Fetch the complete information for all the necessary tsavs

  // Routine tree is a special tsav that doesn't have a funcLocDesc. So add one to it, if it's included in the tsavInfo.
  const routineTreeIndex = tsavInfo.findIndex(
    (fullTsavInfo) => fullTsavInfo.funcLoc == ROUTINE_TREE_TYPE
  );
  if (routineTreeIndex !== -1) {
    tsavInfo[routineTreeIndex].funcLocDesc = 'צה"ל';
  }

  const isWar = operation.value != ROUTINE_TREE_TYPE;

  const identifierKey: "objid" | "funcLoc" = isWar ? "objid" : "funcLoc";
  const operationInfo = tsavInfo.find(
    (tsavInfo) => tsavInfo[identifierKey] == operation.value
  );

  // Fill the completedTsavTree with the labels we fetched from the server
  tsavInfo.forEach((fullTsav) => {
    const tsavIdentifier = fullTsav[identifierKey];
    // We need to find the place of the tsav in the tree. Both it's levelCode, and it's index in the array of that level
    let tsavLevel: OrgLevelCode = fullTsav.hierLevel ?? OrgLevelCode.TREE_TYPE; // Starting position for the level search
    let tsavIndexInLevel: number = -1; // index in the tsav array of the level. -1 if not found
    while (tsavLevel <= OrgLevelCode.GDUD) {
      tsavIndexInLevel = completedTsavTree[tsavLevel].findIndex(
        (tsav) => tsav.value == tsavIdentifier
      );
      if (tsavIndexInLevel !== -1) {
        break;
      }
      tsavLevel++;
    }
    if (tsavIndexInLevel !== -1)
      // If the index for the tsav was found, than naturally the correct level was also found.
      completedTsavTree[tsavLevel][tsavIndexInLevel].label = // <--- Sets the tsav's label
        tsavLevel != OrgLevelCode.TREE_TYPE
          ? removeOperationFromString(
            operationInfo?.funcLocDesc ?? "",
            fullTsav.funcLocDesc
          )
          : fullTsav.funcLocDesc; // If the funcLoc is a TreeType than we want to keep the tree name/operation in the label
  });

  return completedTsavTree;
};
