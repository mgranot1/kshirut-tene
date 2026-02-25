import { IDashboardFiltersValue } from "../../types/filters.types";
import FilterChip from "./FilterChip";
import "./FilterList.scss";

type FilterListProps<T> = {
  isEditMode: boolean;
  filters: IDashboardFiltersValue<T>[];
  onChangeFilters: (newValues: IDashboardFiltersValue<T>[]) => void;
  disableMode?: boolean;
};

const FilterList = <T,>({
  isEditMode,
  filters,
  onChangeFilters,
  disableMode = false,
}: FilterListProps<T>) => {
  const deleteFilter = (
    field: keyof T,
    value: string | boolean | Date | number
  ) => {
    const newFilters = filters.map((f) => {
      return f.fieldKey === field
        ? { ...f, values: f.values.filter((val) => val.value !== value) }
        : f;
    });

    onChangeFilters(newFilters.filter((fi) => fi.values.length > 0));
  };

  return filters.length === 0 ? (
    <></>
  ) : (
    <section className="filtersList">
      <ul className="filtersList-tags">
        {filters.map((field) =>
          field.values.map((val) => (
            <li
              key={`${String(field.fieldKey)}-${val.value}`}
              className={isEditMode ? "editable" : ""}
            >
              <FilterChip
                headerText={field.fieldTitle}
                isNotEqual={val.isNotEqual}
                value={val.text}
                onDelete={() => deleteFilter(field.fieldKey, val.value)}
              />
            </li>
          ))
        )}
      </ul>
      {!disableMode && (
        <footer>
          <hr />
          <button
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onChangeFilters([])}
          >
            <strong>נקה הכל</strong>
          </button>
        </footer>
      )}
    </section>
  );
};

export default FilterList;
