import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import DashboardDropdown, {
  DropdownStyle,
} from "../../../shared/components/DashboardDropdown/DashboardDropdown";
import { IOption } from "../../../shared/types/general.types";
import { ITsavIrgunLevel } from "../../../shared/types/tsavIrgun.types";
import { ROUTINE_TREE_TYPE } from "../../../shared/utils/constants";
import {
  filterTsavsByTreeBelonging,
  getLevelsOptions,
} from "../../../shared/utils/orgLevel.utils";
import { emptyLevelsOptions } from "../../stores/filteredLevelsOptions.store";
import {
  levelsData,
  LevelsOptions,
  OrganizationalLevel,
  OrgLevelCode,
} from "../../types/dashboardOrgLevel.types";

interface IBreadcrumbsDropdownsProps {
  openDropdown?: number;
  onLabelClick?: (index: number) => void;
  onOuterClick?: (index: number) => void;
  currentLevel: OrgLevelCode;
  levelsOptions: LevelsOptions;
  onLevelsOptionsChange: Dispatch<SetStateAction<LevelsOptions>>;
  filteredLevelsOptions: LevelsOptions;
  onFilteredOptionsChange: Dispatch<SetStateAction<LevelsOptions>>;
  onSave?: () => void;
  isEmergency: boolean;
  selectedOrgLevel: OrganizationalLevel;
  onSelectOrgLevel: (newOrganizationalLevel: OrganizationalLevel) => void;
  loading?: boolean;
  isMulti?: boolean;
  disableMode?: boolean;
}

const BreadcrumbsDropdowns = ({
  openDropdown,
  onLabelClick,
  onOuterClick,
  currentLevel,
  levelsOptions,
  onLevelsOptionsChange,
  filteredLevelsOptions,
  onFilteredOptionsChange,
  onSave,
  isEmergency,
  selectedOrgLevel,
  onSelectOrgLevel,
  loading,
  isMulti = false,
  disableMode = false,
}: IBreadcrumbsDropdownsProps) => {
  const [showButton, setShowButton] = useState<boolean>(false);
  const getLevelStatusClassName = (
    selectedLevel: OrgLevelCode,
    currentLevel: OrgLevelCode
  ): DropdownStyle => {
    if (selectedLevel < currentLevel) {
      return "underline"; // selected
    } else if (selectedLevel === currentLevel) {
      return "currentExpandMore"; // current
    } else if (selectedLevel - 1 === currentLevel) {
      return "expandMore"; // next
    } else {
      return "";
    }
  };
  const queryClient = useQueryClient();

  const getOptionsForLevel = (optionKey: OrgLevelCode) => {
    const options = filteredLevelsOptions[optionKey]?.map(
      (option: ITsavIrgunLevel) =>
        ({
          value: isEmergency ? String(option.objid) : String(option.funcLoc),
          label: option.funcLocDesc,
        }) as IOption
    );

    return options ?? [];
  };

  const handleSave = () => {
    setShowButton(false);
    onSave && onSave();
  };

  const handleTreeTypeChange = (
    selectedValue: IOption,
    levels: OrganizationalLevel
  ) => {
    if (Object.keys(selectedValue).length === 0) {
      levels[OrgLevelCode.TREE_TYPE] = [];
    } else {
      onFilteredOptionsChange(emptyLevelsOptions);

      getLevelsOptions(
        selectedValue.value,
        levelsOptions[OrgLevelCode.TREE_TYPE] ?? [],
        selectedValue.value !== ROUTINE_TREE_TYPE
      ).then((levelsOptions_) => {
        onLevelsOptionsChange(levelsOptions_);
        onFilteredOptionsChange(levelsOptions_);
      });
    }
  };

  const calcNextOrgLevelOptions = (
    level: OrgLevelCode,
    selectedValue: IOption,
    currOrgLevelOptions: OrganizationalLevel
  ) => {
    if (Object.keys(selectedValue).length === 0) {
      currOrgLevelOptions[level] = [];
    }
    onFilteredOptionsChange(
      filterTsavsByTreeBelonging(
        levelsOptions,
        currOrgLevelOptions,
        isEmergency
      )
    );
  };

  const handleSelect = (
    selectedLevel: OrgLevelCode,
    selectedValue: IOption,
    isMulti: boolean
  ) => {
    setShowButton(true);

    const levels = { ...selectedOrgLevel };

    for (const level in selectedOrgLevel) {
      if (Number(level) === Number(selectedLevel)) {
        if (isMulti) {
          if (
            levels[Number(selectedLevel)].find(
              (option: IOption) => option.value === selectedValue.value
            )
          ) {
            levels[Number(selectedLevel)] = levels[
              Number(selectedLevel)
            ].filter((option: IOption) => option.value !== selectedValue.value);
          } else {
            levels[Number(selectedLevel)].push(selectedValue);
          }
        } else {
          levels[Number(selectedLevel)] = [selectedValue];
        }
      } else if (Number(level) > selectedLevel) {
        levels[level] = [];
      }
    }

    if (selectedLevel === OrgLevelCode.TREE_TYPE) {
      handleTreeTypeChange(selectedValue, levels);
    } else {
      calcNextOrgLevelOptions(selectedLevel, selectedValue, levels);
    }

    onSelectOrgLevel(levels);
  };

  const getValues = useCallback(
    (levelCode: OrgLevelCode) => {
      return selectedOrgLevel[levelCode]
        ? selectedOrgLevel[levelCode]?.map((option) => {
          const value = option.value;
          const label = option.label;

          if (value && label === "") {
            return {
              value: value,
              label:
                levelsOptions[levelCode]?.find(
                  (option: ITsavIrgunLevel) =>
                    isEmergency
                      ? option.objid == value
                      : option.funcLoc === value // in emergency objid is number
                )?.funcLocDesc ?? "",
            };
          } else return { value: value, label: label };
        })
        : [];
    },
    [selectedOrgLevel, isEmergency, levelsOptions]
  );

  return (
    <div className="orgLevelBreadcrumbs">
      <Breadcrumbs sx={{ filter: loading ? "blur(2px)" : "" }}>
        {Object.keys(filteredLevelsOptions).map(
          (optionKey: string) =>
            (Number(optionKey) <= currentLevel ||
              (selectedOrgLevel[OrgLevelCode.TREE_TYPE].length &&
                Number(optionKey) === Number(currentLevel) + 1)) && (
              <DashboardDropdown
                key={optionKey}
                style={getLevelStatusClassName(Number(optionKey), currentLevel)}
                values={getValues(+optionKey) ?? [{} as IOption]}
                placeholder={levelsData[Number(optionKey)].placeholder}
                title={
                  getValues(+optionKey)?.length > 1
                    ? levelsData[Number(optionKey)].title +
                    " (" +
                    getValues(+optionKey)?.length +
                    ") "
                    : getValues(+optionKey)[0]?.label
                }
                options={getOptionsForLevel(+optionKey)}
                onSelect={(selectedValue) =>
                  handleSelect(
                    Number(optionKey),
                    selectedValue,
                    isMulti && Number(optionKey) !== 0
                  )
                }
                open={!disableMode && openDropdown === +optionKey}
                onLabelClick={() => {
                  onLabelClick?.(+optionKey);
                }}
                onOuterClick={() => {
                  onOuterClick?.(+optionKey);
                }}
                isMulti={isMulti && Number(optionKey) !== 0}
              />
            )
        )}
      </Breadcrumbs>
      {onSave && showButton && (
        <Button
          className="orgLevelBreadcrumbs__button"
          onClick={() => handleSave()}
        >
          החל שינויים
        </Button>
      )}
    </div>
  );
};

export default BreadcrumbsDropdowns;
