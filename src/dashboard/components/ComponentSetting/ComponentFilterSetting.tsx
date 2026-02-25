import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useGetTreeTypes } from "../../../shared/services/tsavIrgunService/useGetOperations";
import { IOption } from "../../../shared/types/general.types";
import { ROUTINE_TREE_TYPE } from "../../../shared/utils/constants";
import {
  filterTsavsByTreeBelonging,
  getLevelsOptions,
} from "../../../shared/utils/orgLevel.utils";
import { ComponentSettingMode } from "../../stores/componentSettingMode.store";
import { emptyLevelsOptions } from "../../stores/filteredLevelsOptions.store";
import { RangePercent, TComponentSetting } from "../../types/component.types";
import {
  emptyOrganizationalLevel,
  LevelsOptions,
  OrganizationalLevel,
  OrgLevelCode,
} from "../../types/dashboardOrgLevel.types";
import BreadcrumbsDropdowns from "../BreadcrumbsDropdown/BreadcrumbsDropdown";
import DisableWrapper from "../DisableWrapper/DisableWrapper";
import DoubleRangeSlider from "../DoubleRangeSlider/DoubleRangeSlider";
import ComponentFilters from "./ComponentFilters";
import "./ComponentFilterSetting.scss";

interface IComponentFilterSettingProps {
  mode: ComponentSettingMode;
  componentSettingForm: TComponentSetting;
  setComponentSettingForm: Dispatch<SetStateAction<TComponentSetting>>;
}

export type FormFields<T> = {
  key: keyof T;
  title: string;
  required: boolean;
  content: React.ReactNode;
};

const ComponentFilterSetting = ({
  mode,
  componentSettingForm,
  setComponentSettingForm,
}: IComponentFilterSettingProps) => {
  const [levelsOptions, setLevelsOptions] =
    useState<LevelsOptions>(emptyLevelsOptions);
  const [filteredLevelsOptions, setFilteredLevelsOptions] =
    useState<LevelsOptions>(emptyLevelsOptions);
  const [loadingOrg, setLoadingOrg] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<number>(-1); // All the dropdowns are close

  const isEmergency = useMemo(
    () =>
      componentSettingForm.orgLevel[OrgLevelCode.TREE_TYPE][0]?.value !==
      ROUTINE_TREE_TYPE,
    [componentSettingForm.orgLevel]
  );

  const currentLevelType: OrgLevelCode = useMemo(() => {
    const nextIndex = Object.values(componentSettingForm.orgLevel).findIndex(
      (orgLevel) => !orgLevel.length
    );

    return nextIndex > 0 ? nextIndex - 1 : nextIndex < 0 ? 4 : 0;
  }, [componentSettingForm.orgLevel]);

  const { data: treeTypes, isSuccess: getTreeTypesSuccess } = useGetTreeTypes();

  const handleChangeField = (
    fieldName: keyof TComponentSetting,
    newValue: any
  ) => {
    setComponentSettingForm((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  const handleSelect = (newOrgLevel: OrganizationalLevel) => {
    handleChangeField("orgLevel", newOrgLevel);
  };

  const formFields = useMemo(() => {
    const fields = [
      {
        key: "name",
        title: "שם הרכיב",
        required: true,
        content: (
          <DisableWrapper disabled={mode === ComponentSettingMode.View}>
            <input
              className="componentFilterSetting__row--input"
              placeholder="הכנס שם"
              value={componentSettingForm.name}
              onChange={(e) => handleChangeField("name", e.target.value)}
              maxLength={100}
              style={{
                width: `calc(${componentSettingForm.name?.length}* 1ch)`,
              }}
            />
          </DisableWrapper>
        ),
      },
      {
        key: "orgLevel",
        title: "צו ארגון",
        required: true,
        content: (
          <BreadcrumbsDropdowns
            key={currentLevelType}
            currentLevel={currentLevelType}
            filteredLevelsOptions={filteredLevelsOptions}
            onFilteredOptionsChange={setFilteredLevelsOptions}
            levelsOptions={levelsOptions}
            onLevelsOptionsChange={setLevelsOptions}
            selectedOrgLevel={componentSettingForm.orgLevel}
            onSelectOrgLevel={handleSelect}
            isEmergency={isEmergency}
            loading={loadingOrg}
            openDropdown={openDropdown}
            onLabelClick={(index) => setOpenDropdown(index)}
            onOuterClick={() => setOpenDropdown(-1)}
            isMulti={true}
            disableMode={mode === ComponentSettingMode.View}
          />
        ),
      },
      {
        key: "filters",
        title: "סננים",
        required: false,
        content: (
          <ComponentFilters
            disableMode={mode === ComponentSettingMode.View}
            selectedFilters={componentSettingForm.filters}
            setSelectedFilters={(newFilters) =>
              handleChangeField("filters", newFilters)
            }
          />
        ),
      },
      {
        key: "rangePercent",
        title: "פרופיל מדרג",
        required: false,
        content: (
          <DisableWrapper disabled={mode === ComponentSettingMode.View}>
            <DoubleRangeSlider
              valueRange={[
                componentSettingForm.rangePercent.toSevereThreshold,
                componentSettingForm.rangePercent.toWarningThreshold,
              ]}
              setValueRange={(newValue: [number, number]) =>
                handleChangeField("rangePercent", {
                  toSevereThreshold: newValue[0],
                  toWarningThreshold: newValue[1],
                } as RangePercent)
              }
            />
          </DisableWrapper>
        ),
      },
    ];
    return fields;
  }, [componentSettingForm, levelsOptions, currentLevelType, openDropdown]);

  const filterOnLoad = (tsavOptions: LevelsOptions) => {
    const filteredLevels = filterTsavsByTreeBelonging(
      tsavOptions,
      componentSettingForm.orgLevel,
      isEmergency
    );

    setFilteredLevelsOptions(filteredLevels);
  };

  useEffect(() => {
    const getTsavIrgun = async (treeType: IOption) => {
      if (!treeTypes) return;

      try {
        setLevelsOptions((prev) => ({
          ...prev,
          [OrgLevelCode.TREE_TYPE]: treeTypes,
        }));
        setFilteredLevelsOptions((prev) => ({
          ...prev,
          [OrgLevelCode.TREE_TYPE]: treeTypes,
        }));

        if (treeType) {
          if (!treeTypes.some((tree) => tree.funcLoc === treeType.value)) {
            handleChangeField("orgLevel", emptyOrganizationalLevel);

            return;
          }

          setLoadingOrg(true);
          const levels = await getLevelsOptions(
            treeType.value,
            treeTypes,
            treeType.value !== ROUTINE_TREE_TYPE
          );
          setLoadingOrg(false);

          setLevelsOptions(levels);
          filterOnLoad(levels);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getTsavIrgun(
      componentSettingForm.orgLevel[OrgLevelCode.TREE_TYPE][0] ?? undefined
    );
  }, [componentSettingForm.id, getTreeTypesSuccess]);

  return (
    <div className="componentFilterSetting">
      {formFields.map((field) => (
        <div
          className="componentFilterSetting__row"
          key={field.key + field.title}
        >
          <div key={field.key}>
            <span>{field.title}</span>
            {field.required && (
              <span className="componentFilterSetting__required"> * </span>
            )}
          </div>
          {field.content}
        </div>
      ))}
    </div>
  );
};

export default ComponentFilterSetting;
