import { atom, selector } from "recoil";
import { GeneralDashboardTableRow } from "../types/generalTable.types";
import { applyFiltersOnRecord } from "../utils/dashboardData.utils";
import { generalFiltersState } from "./DashFilters.store";

export const dashboardGeneralDataAtom = atom<GeneralDashboardTableRow[]>({
  key: "generalDataState",
  default: [],
});

export const dashboardFilteredGeneralData = selector<
  GeneralDashboardTableRow[]
>({
  key: "dashboardFilteredGeneralData",
  get: ({ get }) => {
    const generalData = get(dashboardGeneralDataAtom);

    const freeTextFields: (keyof GeneralDashboardTableRow)[] = [
      "physicalLocationDetails",
      "note",
      "phoneNumber",
      "contact",
      "essence",
      "description",
      "pluga",
      "job",
    ];
    const familyFields: (keyof GeneralDashboardTableRow)[] = [
      "materialFamily",
      "mainPlatform",
      "secPlatform",
      "material"
    ];
    const arrayLengthFields: (keyof GeneralDashboardTableRow)[] = [
      "faultEmz",
      "faultEmzProblem",
      "faultHh",
      "faultHhProblem",
    ];
    const arrayFields: (keyof GeneralDashboardTableRow)[] = ["tags"];
    const dateFields: (keyof GeneralDashboardTableRow)[] = [
      "createTimestamp",
      "changeTimestamp",
      "lastUpdateTimestamp",
    ];
    const tplnrFields: (keyof GeneralDashboardTableRow)[] = [
      "warTplnr",
      "routineTplnr"
    ]

    const filters = get(generalFiltersState);

    const normalFieldFilters = filters.filter(
      (fv) =>
        !familyFields.includes(fv.fieldKey) &&
        !freeTextFields.includes(fv.fieldKey) &&
        !arrayLengthFields.includes(fv.fieldKey) &&
        !arrayFields.includes(fv.fieldKey) &&
        !dateFields.includes(fv.fieldKey) &&
        !tplnrFields.includes(fv.fieldKey)
    );

    const arrayLengthFilters = filters.filter((fv) =>
      arrayLengthFields.includes(fv.fieldKey)
    );
    const dateFilters = filters.filter((fv) =>
      dateFields.includes(fv.fieldKey)
    );
    const freeTextFilters = filters.filter((fv) =>
      freeTextFields.includes(fv.fieldKey)
    );
    const familyFilters = filters.filter((fv) =>
      familyFields.includes(fv.fieldKey)
    );
    const arrayFieldsFilters = filters.filter((fv) =>
      arrayFields.includes(fv.fieldKey)
    );
    const tplnrFilters = filters.filter((fv) =>
      tplnrFields.includes(fv.fieldKey)
    );

    return generalData.filter((record) =>
      applyFiltersOnRecord(
        record,
        familyFilters,
        freeTextFilters,
        dateFilters,
        arrayLengthFilters,
        arrayFieldsFilters,
        normalFieldFilters,
        tplnrFilters
      )
    );
  },
});

export const dashboardFilteredEquipmentData = selector<
  GeneralDashboardTableRow[]
>({
  key: "dashboardFilteredEquipmentData",
  get: ({ get }) => {
    const filteredGeneralData = get(dashboardFilteredGeneralData);
    return Object.values(
      filteredGeneralData.reduce((acc, item) => {
        if (!acc[item.equipment]) {
          acc[item.equipment] = item;
        }
        return acc;
      }, {})
    );
  },
});
