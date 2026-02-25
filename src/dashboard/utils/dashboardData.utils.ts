import { Params } from "../../shared/services/param/useGetValuesRange";
import { MaterialTypes } from "../../shared/types/mean.types";
import {
  CLOSED_FAULT_STATUSES,
  ExpectedTime,
  FaultStatus,
  ParamKey,
  PhysicalLocation,
  PHYSICAL_LOCATIONS_IN_OUR_AREA,
} from "../../shared/types/params.types";
import { areDatesEqual } from "../../shared/utils/dates.utils";
import {
  DashboardFault,
  DashboardFaultMaterial,
} from "../types/FaultTable.types";
import { IDashboardFiltersValue } from "../types/filters.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";

export const localStorageEffect =
  <T>(key: string) =>
    ({ setSelf, onSet }) => {
      const savedFilters = localStorage.getItem(key);
      if (savedFilters) {
        setSelf(JSON.parse(savedFilters));
      }

      onSet(
        (
          newValue: IDashboardFiltersValue<T>[],
          oldValue: IDashboardFiltersValue<T>[],
          isReset: boolean
        ) => {
          isReset
            ? localStorage.removeItem(key)
            : localStorage.setItem(key, JSON.stringify(newValue));
        }
      );
    };

export const sessionStorageEffect =
  <T>(key: string) =>
    ({ setSelf, onSet }) => {
      const savedFilters = sessionStorage.getItem(key);
      if (savedFilters) {
        setSelf(JSON.parse(savedFilters));
      }

      onSet(
        (
          newValue: IDashboardFiltersValue<T>[],
          oldValue: IDashboardFiltersValue<T>[],
          isReset: boolean
        ) => {
          isReset
            ? sessionStorage.removeItem(key)
            : sessionStorage.setItem(key, JSON.stringify(newValue));
        }
      );
    };

export const filterOutClosedFaults = (
  generalData: GeneralDashboardTableRow[]
): GeneralDashboardTableRow[] =>
  generalData.filter(
    (fault) =>
      fault.faultNum &&
      !CLOSED_FAULT_STATUSES.includes(fault.faultStatus as FaultStatus)
  );

export const filterOutOutOfWarFaults = (
  generalData: GeneralDashboardTableRow[]
): GeneralDashboardTableRow[] =>
  generalData.filter((fault) => fault.expectedTime !== ExpectedTime.OutOfWar);

export const isEntryInOurArea = (entry: GeneralDashboardTableRow): boolean => {
  return PHYSICAL_LOCATIONS_IN_OUR_AREA.includes(
    entry.physicalLocation as PhysicalLocation
  );
};

export const countArrayByCondition = <T>(
  array: T[],
  conditionFunc: (item: T, index?: number, array_?: T[]) => boolean
): number => {
  return array.reduce(
    (acc, item, index, array_) =>
      conditionFunc(item, index, array_) ? ++acc : acc,
    0
  );
};

export const checkForValueInParams = (
  params: Params,
  param: ParamKey,
  value: string
): boolean => {
  return params[param].some((option) => option.value === value);
};

export function filterArrayByParam<T>(
  params: Params,
  paramKey: Extract<ParamKey, keyof T>,
  value: string,
  array: T[]
): T[] {
  if (!checkForValueInParams(params, paramKey, value)) {
    throw new Error("There was an error with parameters from server ");
  }

  return array.filter((entry) => entry[paramKey] === value);
}

export function countArrayByParam<T>(
  params: Params,
  paramKey: Extract<ParamKey, keyof T>,
  value: string,
  array: T[]
): number {
  if (!checkForValueInParams(params, paramKey, value)) {
    throw new Error("There was an error with parameters from server");
  }

  return countArrayByCondition(array, (entry) => entry[paramKey] === value);
}

export const countEquipmentsInFaults = (faults: DashboardFault[]): number => {
  return faults.filter(
    (fault, index) =>
      faults.findIndex(
        (findFault) => findFault.equipment === fault.equipment
      ) === index
  ).length;
};

export const getEquipmentsFromFaults = (faults: DashboardFault[]): string[] => {
  return faults
    .filter(
      (fault, index) =>
        faults.findIndex(
          (findFault) => findFault.equipment === fault.equipment
        ) === index
    )
    .map((e) => e.equipment);
};

export const getLastChangedFaultForEquipments = (
  faults: DashboardFault[]
): DashboardFault[] => {
  const equipments = getEquipmentsFromFaults(faults);

  return equipments.map((equipment) => {
    return faults
      .filter(
        (f) =>
          f.equipment === equipment &&
          f.faultStatus !== FaultStatus.Done &&
          f.changeTimestamp !== undefined
      )
      .sort(
        (a, b) =>
          new Date(b.changeTimestamp!).getTime() -
          new Date(a.changeTimestamp!).getTime()
      )[0];
  });
};

const filterRelevantFamilies = (
  familyFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[]
): IDashboardFiltersValue<GeneralDashboardTableRow>[] => {
  const familyCodes = familyFilters
    .flatMap((item) => item.values)
    .map((i) => i.value + "");
  const allValuesSet = new Set(familyCodes);

  const allValues = familyCodes.sort(
    (a, b) => b.split(".").length - a.split(".").length
  );
  for (let i = 0; i < allValues.length; i++) {
    for (let j = i + 1; j < allValues.length; j++) {
      if (allValues[i].startsWith(allValues[j])) {
        allValuesSet.delete(allValues[j]);
      }
    }
  }

  return familyFilters.map((level) => ({
    ...level,
    values: level.values.filter((family) =>
      allValuesSet.has(family.value + "")
    ),
  }));
};

export const applyFiltersOnRecord = (
  record: GeneralDashboardTableRow,
  familyFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[],
  freeTextFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[],
  dateFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[],
  arrayLengthFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[],
  arrayFieldFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[],
  normalFieldFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[],
  tplnrFieldFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[]
): boolean => {  
  let hasPassedFilter = true;
  const relevantFamilyFilters = filterRelevantFamilies(familyFilters);
  // Filter by family-platform-subPlatform-material with OR
  hasPassedFilter =
    relevantFamilyFilters.length > 0
      ? relevantFamilyFilters.reduce(
        (
          acc: boolean,
          currFilter: IDashboardFiltersValue<GeneralDashboardTableRow>
        ) => {
          return (
            acc ||
            currFilter.values.some(
              (val) => record[currFilter.fieldKey] === val.value
            )
          );
        },
        false
      )
      : true;


  // Filter by tplnrFields with OR
  if (tplnrFieldFilters.length > 0) {
    let isTplnrFilterInRecord = false;

    tplnrFieldFilters.forEach((currTplnrFilter) => {
      const fieldValue = currTplnrFilter.fieldKey === "warTplnr"
        ? // <-- use the conclusive version of the field
        record["conclusiveWarTplnr"]
        : // <-- normal case – read the field that the filter points to
        record[currTplnrFilter.fieldKey];
      isTplnrFilterInRecord =
        isTplnrFilterInRecord ||
        currTplnrFilter.values.some((filterVal) => fieldValue === filterVal.value);
    });

    // keep the original AND‑with‑other‑filters semantics
    hasPassedFilter = hasPassedFilter && isTplnrFilterInRecord;
  }

  // Filter between other fields with AND. Credit: Yotam Komp
  normalFieldFilters.forEach((normalFieldFilter) => {
    let hasPassedFilterNotEqual = true;
    let hasPassedFilterEqual = false;
    let hasEqualFilter = false;

    normalFieldFilter.values.forEach((filter) => {
      if (filter.isNotEqual) {
        hasPassedFilterNotEqual =
          hasPassedFilterNotEqual &&
          filter.value !== record[normalFieldFilter.fieldKey];
      } else {
        hasEqualFilter = true;
        hasPassedFilterEqual =
          hasPassedFilterEqual ||
          filter.value === record[normalFieldFilter.fieldKey];
      }
    });

    hasPassedFilter =
      hasPassedFilter &&
      hasPassedFilterNotEqual &&
      (hasPassedFilterEqual || !hasEqualFilter);
  });

  arrayLengthFilters.forEach((arrayFilter) => {
    switch (arrayFilter.fieldKey) {
      // ensuring that the Type of the Field is DashboardFaultMaterial[].
      case "faultEmz":
      case "faultHh":
      case "faultEmzProblem":
      case "faultHhProblem":
        const materials: DashboardFaultMaterial[] =
          record[arrayFilter.fieldKey] || [];
        if (
          !arrayFilter.values.some((filter) => {
            const faultArray = materials.filter(
              (material) => material.missingParts === MaterialTypes.Missing
            );

            const arrayLength = faultArray.length ?? 0;
            return !filter.isNotEqual
              ? arrayLength === filter.value
              : arrayLength !== filter.value;
          })
        ) {
          hasPassedFilter = false;
        }
        break;
    }
  });
  arrayFieldFilters.forEach((arrayFilter) => {
    const tags = record[arrayFilter.fieldKey] as String[];
    if (!Array.isArray(tags)) return;
    // checking for any overlap beetween both of the arrays.
    const hasInstersection: boolean =
      tags.filter((tag) =>
        arrayFilter.values.some((filter) => filter.value === tag)
      ).length > 0;
    if (!hasInstersection) {
      hasPassedFilter = false;
    }
  });
  dateFilters.forEach((dateFilter) => {
    const faultTimestamp = record[dateFilter.fieldKey];

    if (!(faultTimestamp instanceof Date)) {
      hasPassedFilter = false;
      return;
    }

    if (
      !dateFilter.values.some((filter) =>
        areDatesEqual(faultTimestamp, filter.value as Date)
      )
    ) {
      hasPassedFilter = false;
    }
  });

  //  Filter by free-text with AND
  freeTextFilters.forEach((textFilter) => {
    if (
      !textFilter.values.some((filter) =>
        (record[textFilter.fieldKey] ?? "")
          .toString()
          .includes(filter.value.toString())
      )
    ) {
      hasPassedFilter = false;
    }
  });

  return hasPassedFilter;
};
