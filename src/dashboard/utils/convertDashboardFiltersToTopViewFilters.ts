import { FilterType, SelectableFilter } from "../types/componentFilter.types";
import { IDashboardFiltersValue } from "../types/filters.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";

const dashKeyToFieldType = (
  dashboardKey: keyof GeneralDashboardTableRow
): FilterType => {
  return FilterType[
    dashboardKey.charAt(0).toUpperCase() + dashboardKey.slice(1)
  ];
};

export const convertDashboardFiltersToTopViewFilters = (
  filters: IDashboardFiltersValue<GeneralDashboardTableRow>[] | undefined
): SelectableFilter[] => {
  const newFilters: SelectableFilter[] =
    filters
      ?.map((f) => {
        return f.values.map((val) => ({
          field: dashKeyToFieldType(f.fieldKey),
          value: val.value,
        }));
      })
      .flat() || [];

  return newFilters;
};
