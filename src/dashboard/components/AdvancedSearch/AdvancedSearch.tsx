import SearchIcon from "@mui/icons-material/SearchRounded";
import { ClickAwayListener } from "@mui/material";
import React, { useMemo, useState } from "react";
import DashboardDropdown from "../../../shared/components/DashboardDropdown/DashboardDropdown";
import { IOption } from "../../../shared/types/general.types";
import { useAdvancedSearch } from "../../hooks/useAdvancedSearch";
import { ISearchField, SearchFields } from "../../types/advancedSearch.type";
import { FieldType } from "../../types/filters.types";
import "./AdvancedSearch.scss";

// Simple Filter Icon Component ensuring no external libs
const FilterIconComponent = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17v2h6v-2H3zM3 5v2h18V5H3zm0 9h12v-2H3v2z" />
  </svg>
);
export interface IAdvancedSearchProps {
  fields: ISearchField[];
  searchTitle: string;
}

export const AdvancedSearch: React.FC<IAdvancedSearchProps> = ({
  searchTitle,
  fields,
}) => {
  const {
    isOpen,
    setIsOpen,
    searchFields,
    toggleOpen,
    handleInputChange,
    handleSearch,
    handleReset,
  } = useAdvancedSearch();
  const [openDropdown, setOpenDropdown] = useState<string>("");

  const getPlaceholder = (field: ISearchField) => {
    const selectedValue = searchFields[field.fieldKey];
    return `בחר ${field.fieldTitle} ${selectedValue.length > 0 ? `(${selectedValue.length})` : ""}`;
  };

  const optionMap = useMemo<Record<string, IOption[]>>(() => {
    return Object.fromEntries(fields.map((r) => [r.fieldKey, r.options()]));
  }, [fields]);

  return (
    <div className="advanced-search">
      {/* Main Search Bar */}
      <div className="advanced-search__search-bar">
        <SearchIcon className="advanced-search__search-bar--icon" />
        {/* We can use the screen name as the "quick" search field or just a visual trigger */}
        <input
          type="text"
          className="advanced-search__search-bar--main-search-input"
          placeholder={searchTitle}
          value={searchFields.screenName}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.length) {
              handleSearch();
            }
          }}
          onChange={(e) => handleInputChange("screenName", e.target.value)}
        />
        <button
          type="button"
          className={`advanced-search__search-bar--filter-toggle-btn ${isOpen ? "active" : ""}`}
          onClick={toggleOpen}
          aria-label="Advanced search options"
        >
          <FilterIconComponent />
        </button>
      </div>

      {/* Advanced Filter Overlay */}
      {isOpen && (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <div className="advanced-search__popup">
            <div className="advanced-search__popup--form-grid">
              {fields.map((field) => (
                <div
                  className="advanced-search__popup--form-group"
                  key={field.fieldKey}
                >
                  <label>{field.fieldTitle}</label>
                  {field.fieldType === FieldType.TextField && (
                    <input
                      className="advanced-search__popup--form-group__input"
                      id={searchFields[field.fieldKey]}
                      type="text"
                      value={searchFields[field.fieldKey]}
                      onChange={(e) =>
                        handleInputChange(
                          field.fieldKey as keyof SearchFields,
                          e.target.value
                        )
                      }
                    />
                  )}
                  {field.fieldType === FieldType.Checkbox && (
                    <DashboardDropdown
                      key={field.fieldKey}
                      style={"border"}
                      values={searchFields[field.fieldKey].map(
                        (value: string) => ({ value: value, label: value })
                      )}
                      placeholder={`בחר ${field.fieldTitle}`}
                      title={getPlaceholder(field)}
                      options={optionMap[field.fieldKey]}
                      onSelect={(option) => {
                        handleInputChange(
                          field.fieldKey as keyof SearchFields,
                          option.value
                        );
                      }}
                      open={openDropdown === field.fieldKey}
                      isMulti={true}
                      onLabelClick={() => setOpenDropdown(field.fieldKey)}
                      onOuterClick={() => setOpenDropdown("")}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="advanced-search__popup--actions">
              <button
                type="button"
                className="advanced-search__popup--btn reset-btn"
                onClick={handleReset}
              >
                נקה
              </button>
              <button
                type="button"
                className="advanced-search__popup--btn search-btn"
                onClick={handleSearch}
              >
                חפש
              </button>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};
