import { useRecoilValue } from "recoil";

import { familiesListState } from "../../stores/families.store";
import { DashboardEquipmentRow } from "../../types/EquipmentTable.types";
import { HierLevel, IFamily } from "../../types/family.types";
import { IDashboardFiltersValue } from "../../types/filters.types";
import "./FamiliesFilters.scss";
import { familiesFiltersPlaster } from "./familiesFiltersPlaster";
import SingleFamilyFilter from "./SingleFamilyFilter";

interface IFamiliesFiltersProps<T> {
  selectedFilters: IDashboardFiltersValue<T>[];
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<IDashboardFiltersValue<T>[]>
  >;
}

export const familyLevelFilter: Record<
  Exclude<HierLevel, HierLevel.All>,
  { key: keyof DashboardEquipmentRow; title: string }
> = {
  [HierLevel.Family]: { key: "materialFamily", title: "משפחה" },
  [HierLevel.Platform]: { key: "mainPlatform", title: "פלטפורמה" },
  [HierLevel.SubPlatform]: { key: "secPlatform", title: "תת פלטפורמה" },
  [HierLevel.Material]: { key: "material", title: "תת פלטפורמה" },
};

function FamiliesFilters<T>(props: IFamiliesFiltersProps<T>) {
  const familiesList = useRecoilValue(familiesListState);

  const FAMILY_LEVEL_FILTERS = [
    "materialFamily",
    "mainPlatform",
    "secPlatform",
  ];

  const setFilter = (family: IFamily) => {
    props.setSelectedFilters((prev) => {
      let flagIsFilterExist = false;

      const newFilters = prev.map((f) => {
        if (f.fieldKey === familyLevelFilter[family.hierLevel].key) {
          flagIsFilterExist = true;
          //In case the value not exists - add it to the filter, else - remove
          if (!f.values.find((i) => i.value === family.code)) {
            return {
              ...f,
              values: [
                ...f.values,
                {
                  text: family.code + " - " + family.description,
                  value: family.code,
                },
              ],
            };
          }
          return {
            ...f,
            values: f.values.filter((i) => i.value !== family.code),
          };
        }
        return f;
      });

      //Create new filter if not exist
      if (!flagIsFilterExist) {
        newFilters.push({
          fieldKey: familyLevelFilter[family.hierLevel].key,
          fieldTitle: familyLevelFilter[family.hierLevel].title,
          values: [
            {
              text: family.code + " - " + family.description,
              value: family.code,
            },
          ],
        });
      }

      return newFilters.filter((family) => family.values.length > 0);
    });
  };

  const deleteAllFamiliesFilter = () => {
    props.setSelectedFilters((prev) => {
      return prev.filter(
        (i) => FAMILY_LEVEL_FILTERS.indexOf(String(i.fieldKey)) === -1
      );
    });
  };

  return (
    <div className="FamiliesFilters">
      <div className="FamiliesFilters__scrollLine">
        <SingleFamilyFilter
          key={0}
          title="כללי"
          code=""
          isSelected={
            props.selectedFilters.filter((i) =>
              FAMILY_LEVEL_FILTERS.includes(String(i.fieldKey))
            ).length === 0
          }
          handleSelect={() => deleteAllFamiliesFilter()}
        />
        {familiesList
          .filter((data) =>
            familiesFiltersPlaster?.map((i) => i.value).includes(data.code)
          )
          .map((fam) => (
            <SingleFamilyFilter
              key={fam.code}
              title={fam.description}
              code={fam.code}
              isSelected={
                props.selectedFilters
                  .find((family) => family.fieldKey === "materialFamily")
                  ?.values.filter((familyName) => familyName.value === fam.code)
                  .length === 1
              }
              handleSelect={() => setFilter(fam)}
            />
          ))}
      </div>
    </div>
  );
}

export default FamiliesFilters;
