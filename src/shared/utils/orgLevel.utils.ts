import { trackPromise } from "react-promise-tracker";
import { emptyLevelsOptions } from "../../dashboard/stores/filteredLevelsOptions.store";
import {
  LevelsOptions,
  OrganizationalLevel,
  OrgLevelCode,
  OrgLevelCodeKeys,
} from "../../dashboard/types/dashboardOrgLevel.types";
import TsavIrgunService from "../services/tsavIrgunService/tsavIrgun.service";
import { ITsavIrgunLevel, TsavIdentifier } from "../types/tsavIrgun.types";
import { OPERATIONS_INDEX, ROUTINE_TREE_TYPE } from "./constants";
import { OrgLevelPath } from "../../dashboard/stores/orgLevelPath.store";
import { TopViewPathValue } from "../../dashboard/components/TopViewPath/TopViewPath";

export const orgLevelDesc: Record<
  Exclude<OrgLevelCode, OrgLevelCode.TREE_TYPE>,
  string
> = {
  [OrgLevelCode.PIKUD]: "פיקודים",
  [OrgLevelCode.UGDA]: "אוגדות",
  [OrgLevelCode.UTZVA]: "חטיבות",
  [OrgLevelCode.GDUD]: "גדודים",
};

export const orgLevelFilterCode: Record<
  Exclude<OrgLevelCode, OrgLevelCode.TREE_TYPE>,
  string
> = {
  [OrgLevelCode.PIKUD]: "pikud",
  [OrgLevelCode.UGDA]: "ugda",
  [OrgLevelCode.UTZVA]: "utzva",
  [OrgLevelCode.GDUD]: "gdud",
};

export const checkTreeCompletes = (
  levels: ITsavIrgunLevel[],
  currLevel: ITsavIrgunLevel
): boolean => {
  if (currLevel.hierLevel === OrgLevelCode.GDUD) {
    return true;
  }

  const children = levels.filter((l) => currLevel.index === l.fatherIndex);

  if (children.length === 0) {
    return false;
  }

  return !!children.find((l) => checkTreeCompletes(levels, l));
};

export const uniteGdudsBySimulToari = (tsavIrgun: ITsavIrgunLevel[]) => {
  return tsavIrgun?.reduce((acc: ITsavIrgunLevel[], curr: ITsavIrgunLevel) => {
    if (curr.hierLevel === OrgLevelCode.GDUD) {
      const relevantSimuls = [curr.funcLoc];
      const isSecondSimul = Number(curr.funcLoc) % 2 === 0;

      const prevSimul = acc.find(
        (l) => l.funcLoc === (Number(curr.funcLoc) - 1).toString()
      );

      // if it's a second simul and first simul of pair is already in the array(there is no need for second simul)
      if (
        isSecondSimul &&
        prevSimul &&
        curr.simulToari &&
        prevSimul.simulToari === curr.simulToari &&
        prevSimul.fatherIndex === curr.fatherIndex
      )
        return acc;

      const additionalSimul = !isSecondSimul
        ? tsavIrgun.find(
          (l) =>
            curr.simulToari &&
            l.simulToari === curr.simulToari &&
            l.fatherIndex === curr.fatherIndex &&
            Number(l.funcLoc) === Number(curr.funcLoc) + 1
        )
        : undefined;

      const funcLocDesc = additionalSimul
        ? `${curr.funcLoc}/${additionalSimul.funcLoc} - ${curr.funcLocDesc
          .replace(curr.funcLoc, "")
          .replace("-", "")}`
        : curr.funcLocDesc;
      additionalSimul && relevantSimuls.push(additionalSimul.funcLoc);

      acc.push({ ...curr, funcLocDesc, relevantSimuls });
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
};

export const mapFlatToLevels = (
  flatTsavIrgun: ITsavIrgunLevel[],
  selectedTreeType: string,
  treeTypes: ITsavIrgunLevel[]
): LevelsOptions => {
  const levels: LevelsOptions = { ...emptyLevelsOptions };

  OrgLevelCodeKeys.forEach((levelKey) => {
    if (levelKey === OrgLevelCode.TREE_TYPE) {
      levels[levelKey] = treeTypes;
      return;
    }

    levels[levelKey] = flatTsavIrgun.filter(
      (tsavIrgun) => tsavIrgun.hierLevel === Number(levelKey)
    );

    // Remove operation name from Pikud.
    if (levelKey === OrgLevelCode.PIKUD) {
      const operationLabel = levels[OrgLevelCode.TREE_TYPE]?.find(
        (o) => o.funcLoc === selectedTreeType
      );

      if (operationLabel && levels[levelKey])
        levels[levelKey] =
          levels[levelKey]?.map((option) => ({
            ...option,
            funcLocDesc: removeOperationFromString(
              operationLabel.funcLocDesc,
              option.funcLocDesc
            ),
          })) ?? [];
    }
  });

  return levels;
};

export const getLevelsOptions = async (
  selectedTreeType: string,
  treeTypes: ITsavIrgunLevel[],
  isEmergency: boolean
): Promise<LevelsOptions> => {
  let levels: LevelsOptions = { ...emptyLevelsOptions };

  const flatTsavIrgun = await trackPromise(
    isEmergency
      ? TsavIrgunService.getTsavIrgunEmergency(selectedTreeType)
      : TsavIrgunService.getTsavIrgun()
  );

  const completableLevels: ITsavIrgunLevel[] = flatTsavIrgun.filter(
    (tsavIrgun) => checkTreeCompletes(flatTsavIrgun, tsavIrgun)
  );

  if (completableLevels) {
    levels = mapFlatToLevels(completableLevels, selectedTreeType, treeTypes);
  }

  levels[OrgLevelCode.PIKUD] =
    levels[OrgLevelCode.PIKUD]?.map((pikud) => ({
      ...pikud,
      fatherIndex: OPERATIONS_INDEX,
    })) ?? null;

  return levels;
};

export const findTsavsInOptions = (
  tsavOptionsAtTheLevel: ITsavIrgunLevel[] | null,
  tsavsIdentifiers: string[],
  isEmergency: boolean
): ITsavIrgunLevel[] | undefined => {
  const currentTsavIrgun: ITsavIrgunLevel[] | undefined =
    tsavOptionsAtTheLevel?.filter((option: ITsavIrgunLevel) => {
      const relevantKey = getTsavIdentifier(isEmergency);
      return tsavsIdentifiers.includes(String(option[relevantKey]));
    });

  return currentTsavIrgun;
};

export const getLevelCodeFromSelectedTsav = (tsav: OrganizationalLevel | null) => {
  if (!tsav) return 0
  return Number(
    Object.keys(tsav).findLast(
      (levelCode: string) => tsav[Number(levelCode)].length
    ) || "0"
  );
};
export const getLastValidFromSelectedTsav = (
  orgLevelPath: OrgLevelPath
): TopViewPathValue | null => {
  // Extract numeric keys from OrgLevelPath (excluding OrgLevelCode.TREE_TYPE)
  const levels = Object.keys(orgLevelPath)
    .map(Number)
    .sort((a, b) => b - a); // Sort from highest to lowest level

  for (const level of levels) {
    const pathValue = orgLevelPath[level];
    if (
      pathValue &&
      pathValue.code !== undefined &&
      pathValue.optionalDesc !== undefined
    ) {
      return pathValue;
    }
  }

  return null;
}

/*
~ Function filterTsavsByTreeBelonging:
  takes a tsavTree (TreeType,Pikud,Ugda,Hativa,Gdud), and a list of tsavs (seperated by their hierLevel) and returns a copy of that list
  that is filtered so that only tsavs that are children to the tsavTree remain.
*/
export const filterTsavsByTreeBelonging = (
  tsavOptions: LevelsOptions,
  selectedTsav: OrganizationalLevel,
  isEmergency: boolean
): LevelsOptions => {
  const lastFilledLevelCode = getLevelCodeFromSelectedTsav(selectedTsav);

  if (lastFilledLevelCode === OrgLevelCode.TREE_TYPE) return { ...tsavOptions };

  const filteredTsavOptions: LevelsOptions = { ...emptyLevelsOptions };

  // for previous levels keep the same as tsavOptions
  let levelFathers: ITsavIrgunLevel[] | null = null;
  for (
    let levelCode = OrgLevelCode.TREE_TYPE;
    levelCode <= OrgLevelCode.GDUD;
    levelCode++
  ) {
    if (!levelFathers) {
      filteredTsavOptions[levelCode] = tsavOptions[levelCode];
    } else {
      // get indexes for tsavs selected in current level
      const fatherIndices: number[] = levelFathers.map((t) => t.index);

      // for each level, set in filteredTsavOptions all of the tsavs below it
      filteredTsavOptions[levelCode] =
        tsavOptions[levelCode]?.filter((option: ITsavIrgunLevel) =>
          fatherIndices.includes(option.fatherIndex)
        ) ?? [];
    }

    // This sets the levelFathers for the next iteration of the loop. If this level is 'levelA' and the next level is 'levelB', than this sets the fathers of 'levelB':
    // If the iteration is before the lastFilledLevelCode, than the fathers of 'levelB' are already known - They are the selectedTsav options of 'levelA'
    // If we go beyond the lastFilledLevelCode, than selectedTsav['levelA'] has not been selected yet, so it can be the fathers. The fathers then is the filteredTsavOptions of that level.
    levelFathers =
      levelCode <= lastFilledLevelCode
        ? (findTsavsInOptions(
          tsavOptions[levelCode],
          selectedTsav[levelCode].map((tsav) => tsav.value),
          isEmergency
        ) ?? null)
        : filteredTsavOptions[levelCode];
  }

  return filteredTsavOptions;
};

export const removeOperationFromString = (
  operation: string,
  str: string
): string => {
  return str ? str.replace(operation, "").replace("-", "") : "";
};

/*
~ function isEmergencyTree
  returns if an organizationLevel tree is a war one or a routine one
*/
export const isEmergencyTree = (tsavTree: OrganizationalLevel): boolean => {
  return tsavTree[OrgLevelCode.TREE_TYPE][0]?.value !== ROUTINE_TREE_TYPE;
};

/*
~ function getTsavIdentifier
  tsavs have a relevant identifier based on it is searched on. If in war, then the identifier is the objid, In in routine, then it is the funcLoc
*/
export const getTsavIdentifier = (isEmergency: boolean): TsavIdentifier => {
  return isEmergency ? 'objid' : 'funcLoc';
}
