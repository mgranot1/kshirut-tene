import { useRecoilValue } from "recoil";
import { dashboardGeneralDataAtom } from "../stores/DashboardData.store";
import { IOptionVal } from "../types/filters.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";

export const useOptionsFromColumn = () => {
  const dataState = useRecoilValue(dashboardGeneralDataAtom);

  const getOptionsFromColumn = (
    colKeys: (keyof GeneralDashboardTableRow)[],
    isPromise = true
  ) => {
    const options = dataState
      .reduce((acc: IOptionVal[], curr: GeneralDashboardTableRow) => {
        const value = curr[colKeys[0]] as string;
        if (!value) return acc;
        const text = colKeys.map((k) => curr[k] as string).join(" - ");
        if (!acc.find((opt) => opt.value === value))
          acc.push({ text: text, value: value });
        return acc;
      }, [])
      .sort((a, b) => (a.value > b.value ? 1 : -1));
    return isPromise ? Promise.all(options) : options;
  };

  return { getOptionsFromColumn };
};
