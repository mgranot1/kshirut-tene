import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Drawer } from "../../../shared/components/DropDown/DropDown.style";
import GeneralButton from "../../../shared/components/GeneralButton/GeneralButton";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { Kshirut } from "../../../shared/types/params.types";
import { SELECTED_FILTERS_SESSION_KEY } from "../../../shared/utils/constants";
import "./FilterSheet.scss";

export enum ToolStatus {
  Organic = "Organic",
  Emergency = "Emergency",
}

export enum DefectStatus {
  Defect = "Defect",
  NotDefect = "NotDefect",
}

export interface IFilters {
  toolStatus: ToolStatus[];
  defectStatus: DefectStatus[];
  kshirutWar: Kshirut[];
  kshirutRoutine: Kshirut[];
}

export const emptyFilters: IFilters = {
  toolStatus: [],
  defectStatus: [],
  kshirutWar: [],
  kshirutRoutine: [],
};

type filterKey = ToolStatus | DefectStatus | Kshirut;

export interface IFilterDetails {
  title: string;
  filterKey: keyof IFilters;
  filters: { key: filterKey; value: string }[];
  show: boolean;
}
interface IFilterProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSheet = (props: IFilterProps) => {
  const [selectedFilters, setSelectedFilters] =
    useState<IFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useSessionStorage<IFilters>(
    SELECTED_FILTERS_SESSION_KEY
  );

  const filterItems: IFilterDetails[] = [
    {
      title: "כלים",
      filterKey: "toolStatus",
      filters: [
        { key: ToolStatus.Organic, value: "אורגניים" },
        { key: ToolStatus.Emergency, value: "ציוות קרבי" },
      ],
      show: true,
    },
    {
      title: "תקולים",
      filterKey: "defectStatus",
      filters: [
        { key: DefectStatus.Defect, value: "תקול" },
        { key: DefectStatus.NotDefect, value: "לא תקול" },
      ],
      show: true,
    },
    {
      title: "כשירות מלחמה",
      filterKey: "kshirutWar",
      filters: [
        { key: Kshirut.Kashir, value: "כשיר" },
        { key: Kshirut.Not_Kashir, value: "לא כשיר" },
      ],
      show: true,
    },
    {
      title: "כשירות שגרה",
      filterKey: "kshirutRoutine",
      filters: [
        { key: Kshirut.Kashir, value: "כשיר" },
        { key: Kshirut.Not_Kashir, value: "לא כשיר" },
      ],
      show: true,
    },
  ];

  const updateFilter = <T extends keyof IFilters>(
    filterKey: T,
    val: IFilters[T][0]
  ) => {
    setSelectedFilters((prev) => {
      const allSelFiltersInKey = [...prev[filterKey]];

      const indexOfFilter = allSelFiltersInKey.findIndex(
        (filter) => filter == val
      );
      // Selected filter hasn't been found in the list of selected filters
      if (indexOfFilter === -1) {
        return { ...prev, [filterKey]: [...prev[filterKey], val] };
      }

      return {
        ...prev,
        [filterKey]: [
          ...allSelFiltersInKey.slice(0, indexOfFilter),
          ...allSelFiltersInKey.slice(indexOfFilter + 1),
        ],
      };
    });
  };

  const clearFilters = () => {
    setAppliedFilters(emptyFilters);
    setSelectedFilters(emptyFilters);
    props.setOpened(false);
  };

  const startFilters = () => {
    setAppliedFilters(selectedFilters);
    props.setOpened(false);
  };

  useEffect(() => {
    if (!appliedFilters) {
      setAppliedFilters(emptyFilters);
      setSelectedFilters(emptyFilters);
    } else {
      setSelectedFilters(appliedFilters);
    }
  }, []);

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    props.setOpened((prev) => !prev);
  };

  return (
    <div className="FilterSheet">
      <Drawer
        classes={{ modal: "bottom-sheet__modal" }}
        anchor={"bottom"}
        open={props.opened}
        onOpen={toggleDrawer}
        onClose={toggleDrawer}
      >
        <div
          className={`bottom-sheet ${props.opened ? "swipe" : ""}`}
          draggable="true"
        >
          <span className="filter-title">סינונים</span>

          <div className="filter-list">
            {filterItems.map(
              (item, index) =>
                item.show && (
                  <div className="top" key={item.title + index}>
                    <span className="filter-subtitle">{item.title}</span>
                    <div className="top-filters">
                      {item.filters.map((filter) => (
                        <Button
                          key={`${item.filterKey}-${filter.key}`}
                          disableRipple
                          className={`filter-button ${
                            selectedFilters &&
                            selectedFilters[item.filterKey]?.includes(
                              filter.key as never
                            )
                              ? "selected"
                              : ""
                          }`}
                          variant="outlined"
                          onClick={() =>
                            updateFilter(item.filterKey, filter.key)
                          }
                        >
                          {filter.value}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
          <div className="action-buttons">
            <GeneralButton text="החל סינונים" onClick={() => startFilters()} />
            <Button className="clear-button" onClick={() => clearFilters()}>
              נקה הכל
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default FilterSheet;
