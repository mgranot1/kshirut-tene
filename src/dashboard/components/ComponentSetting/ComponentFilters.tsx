import AddIcon from "@mui/icons-material/AddRounded";
import Button from "@mui/material/Button";
import { useState } from "react";

import { useComponentFilters } from "../../hooks/useComponentFilters";
import { TComponentFilters } from "../../types/component.types";
import { IDashboardFiltersValue } from "../../types/filters.types";
import DashboardFilters from "../DashboardFilters/DashboardFilters";
import FilterList from "../DashboardFilters/FilterList";
import "./ComponentFilters.scss";

interface IComponentFiltersProps {
  disableMode?: boolean;
  selectedFilters: IDashboardFiltersValue<TComponentFilters>[];
  setSelectedFilters: (
    newFilters: IDashboardFiltersValue<TComponentFilters>[]
  ) => void;
}

const ComponentFilters = ({
  selectedFilters,
  setSelectedFilters,
  disableMode = false,
}: IComponentFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const { componentFiltersFields } = useComponentFilters();

  const handleFiltersButton = () => {
    setIsFiltersOpen((prev) => !prev);
  };

  return (
    <div className="componentFilters">
      {!disableMode && (
        <Button
          className="componentFilters__button"
          onClick={handleFiltersButton}
        >
          <AddIcon sx={{ width: "1.2rem" }} />
          <span> הוספת סינון </span>
        </Button>
      )}
      <div className="componentFilters__tags">
        <FilterList
          isEditMode={!disableMode}
          filters={selectedFilters}
          onChangeFilters={setSelectedFilters}
          disableMode={disableMode}
        />
      </div>
      {isFiltersOpen && (
        <DashboardFilters<TComponentFilters>
          title="סננים"
          isOpen={isFiltersOpen}
          setIsOpen={setIsFiltersOpen}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          fields={componentFiltersFields}
        />
      )}
    </div>
  );
};

export default ComponentFilters;
