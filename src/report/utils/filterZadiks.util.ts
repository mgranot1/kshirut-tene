import { IDashboardFiltersValue } from "../../dashboard/types/filters.types";
import { Kshirut } from "../../shared/types/params.types";
import { IZadikData } from "../../shared/types/ZadikData.types";
import {
  DefectStatus,
  emptyFilters,
  IFilters,
  ToolStatus,
} from "../components/FilterSheet/FilterSheet";

export type zadikFilter = {
  toolStatus: ToolStatus[];
  defectStatus: DefectStatus;
  kshirutWar: Kshirut;
  kshirutRoutine: Kshirut;
};

export const getFilteredZadiks = (
  allZadiks: IZadikData[],
  selectedFilters: IFilters
) => {
  if (!selectedFilters) {
    selectedFilters = { ...emptyFilters };
  }

  if (isNoFilter(selectedFilters)) {
    return allZadiks;
  } else {
    const filtered = allZadiks.filter((z) => {
      const toolStatus: ToolStatus[] = [];
      if (z.fromRoutine) {
        toolStatus.push(ToolStatus.Organic);
      }
      if (z.fromWar) {
        toolStatus.push(ToolStatus.Emergency);
      }

      const currDetails: zadikFilter = {
        toolStatus,
        defectStatus:
          z.openFaults === 0 ? DefectStatus.NotDefect : DefectStatus.Defect,
        kshirutWar:
          z.warKshirut === Kshirut.Not_Kashir
            ? Kshirut.Not_Kashir
            : Kshirut.Kashir,
        kshirutRoutine:
          z.kshirut === Kshirut.Not_Kashir
            ? Kshirut.Not_Kashir
            : Kshirut.Kashir,
      };

      return (
        (selectedFilters.toolStatus.length === 0 ||
          currDetails.toolStatus.some((toolStatus: ToolStatus) =>
            selectedFilters.toolStatus.includes(toolStatus)
          )) &&
        (selectedFilters.defectStatus.length === 0 ||
          selectedFilters.defectStatus.includes(currDetails.defectStatus)) &&
        (selectedFilters.kshirutWar.length === 0 ||
          selectedFilters.kshirutWar.includes(currDetails.kshirutWar)) &&
        (selectedFilters.kshirutRoutine.length === 0 ||
          selectedFilters.kshirutRoutine.includes(currDetails.kshirutRoutine))
      );
    });

    return filtered;
  }
};

export const isNoFilter = (selectedFilters: IFilters): boolean => {
  return (
    !selectedFilters ||
    (selectedFilters.toolStatus?.length === 0 &&
      selectedFilters.defectStatus?.length === 0 &&
      selectedFilters.kshirutWar?.length === 0 &&
      selectedFilters.kshirutRoutine?.length === 0)
  );
};
export const isFilterAlreadyExists = <T,>(
  currentFiltersList: IDashboardFiltersValue<T>[],
  filterCode: string,
  fieldKey: keyof T
) => {
  const selectedFilter: IDashboardFiltersValue<T> | null =
    currentFiltersList?.find((f) => f.fieldKey === fieldKey) ?? null;
  const filterValues = selectedFilter?.values.map((mat) => mat.value);
  return filterValues?.includes(filterCode);
};
