import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import KshirutPieGraph from "../../../report/components/PieGraph/KshirutPieGraph";
import { SitePaths } from "../../../router/routes";
import DashboardDropdown from "../../../shared/components/DashboardDropdown/DashboardDropdown";
import { IOption } from "../../../shared/types/general.types";
import { Kshirut } from "../../../shared/types/params.types";
import useDbdGeneralFilters, { FilterChange } from "../../hooks/useDbdFilters";
import { useFamiliesOptions } from "../../hooks/useFamiliesOptions";
import useDeleteVariant from "../../services/variant/useDeleteVariant";
import useUpsertVariant from "../../services/variant/useUpsertVariant";
import { minimalFamily } from "../../stores/DashFilters.store";
import { familiesListState } from "../../stores/families.store";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { DashboardEquipment } from "../../types/EquipmentTable.types";
import { HierLevel, IFamily } from "../../types/family.types";
import {
  FieldType,
  IDashboardFiltersValue,
  IFieldData,
  IOptionVal,
} from "../../types/filters.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import { IVariant, VariantType } from "../../types/variant.types";
import DashboardFilters from "../DashboardFilters/DashboardFilters";
import "./DynamicKshirutChart.scss";
import KshirutDevelopmentGraph from "./KshirutDevelopmentGraph/KshirutDevelopmentGraph";

export type IDynamicChartFilters = Pick<
  DashboardEquipment,
  "materialFamily" | "mainPlatform" | "secPlatform"
> & { others: boolean };

export const FamilyFilters: Record<
  Exclude<HierLevel, HierLevel.All>,
  string
> = {
  [HierLevel.Family]: "materialFamily",
  [HierLevel.Platform]: "mainPlatform",
  [HierLevel.SubPlatform]: "secPlatform",
  [HierLevel.Material]: "material",
};

const configVariantFields: (keyof IVariant)[] = ["isDefault", "isGlobal"];

const FamilyTitle: Record<
  Exclude<HierLevel, HierLevel.All | HierLevel.Material>,
  string
> = {
  [HierLevel.Family]: "משפחה",
  [HierLevel.Platform]: "פלטפורמה",
  [HierLevel.SubPlatform]: "תת-פלטפורמה",
};

const getFiltersOfVariant = (selectedVariant: IVariant | undefined) => {
  if (!selectedVariant) return [];
  const variantFilters = Object.values(FamilyFilters).map((f) => ({
    fieldKey: f as keyof IDynamicChartFilters,
    fieldTitle: FamilyTitle[f],
    values: selectedVariant?.values
      .filter((v) => v.field === f)
      .map((v) => ({ text: v.field, value: v.value })),
  }));

  const configValues: IOptionVal[] = [];

  configVariantFields.forEach((config) => {
    if (selectedVariant[config]) {
      configValues.push({ text: config, value: config });
    }
  });

  const config: IDashboardFiltersValue<IDynamicChartFilters> = {
    fieldKey: "others" as keyof IDynamicChartFilters,
    fieldTitle: "",
    values: configValues,
  };

  return [...variantFilters, config];
};

type DynamicKshirutChartProps = {
  equipmentsCount: number;
  kashirEquipmentsCount: number;
  kshirimIn24: number;
  kshirimIn48: number;
  kshirimIn72: number;
  variants: IVariant[] | undefined;
  currVariant: IVariant | undefined;
  selectedTopViewFilters?: IDashboardFiltersValue<GeneralDashboardTableRow>[];
  setCurrVariant: React.Dispatch<React.SetStateAction<IVariant | undefined>>;
  onExpectedKshirutBarClick: (
    hours: number,
    variantFilters: IDashboardFiltersValue<IDynamicChartFilters>[]
  ) => void;
};

const DynamicKshirutChart = (props: DynamicKshirutChartProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const families = useRecoilValue(familiesListState);
  const currFamily = useRecoilValue(minimalFamily);
  const kshirutType = useRecoilValue(kshirutTypeState);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const [newVariantTitle, setNewVariantTitle] = useState<string>("");

  const onUpsertVariant = (data: IVariant | undefined) => {
    setPrevVariant(data);
  };

  const onDeleteVariant = () => {
    setVariantFilters([]);
    props.setCurrVariant(undefined);
  };

  const { mutateAsync: upsertVariant } = useUpsertVariant(onUpsertVariant);
  const { mutateAsync: deleteVariant } = useDeleteVariant(onDeleteVariant);

  const [prevVariant, setPrevVariant] = useState<IVariant | undefined>(
    props.currVariant
  );

  const { getFamilyOptionsByLevel } = useFamiliesOptions();
  const { addFilters } = useDbdGeneralFilters();
  const navigate = useNavigate();

  const getInitialVariantFilters = () => {
    const selectedVariant = props.variants?.find((v) => v.isDefault);
    return getFiltersOfVariant(selectedVariant);
  };

  const [variantFilters, setVariantFilters] = useState<
    IDashboardFiltersValue<IDynamicChartFilters>[]
  >(getInitialVariantFilters());

  const getFamilyFilters = (
    filters: IDashboardFiltersValue<IDynamicChartFilters>[]
  ) => {
    return filters.filter((f) =>
      ["materialFamily", "mainPlatform", "secPlatform"].includes(f.fieldKey)
    );
  };

  const dynamicChartVariantOptions = useMemo(() => {
    return (
      props.variants?.map((v) => ({
        label: v.variantDescription,
        value: v.variantId.toString(),
      })) || []
    );
  }, [props.variants]);

  const fields: IFieldData<IDynamicChartFilters>[] = [
    {
      fieldKey: "materialFamily",
      fieldTitle: "משפחה",
      fieldType: FieldType.Checkbox,
      options: async () => getFamilyOptionsByLevel(HierLevel.Family),
    },
    {
      fieldKey: "mainPlatform",
      fieldTitle: "פלטפורמה",
      fieldType: FieldType.Checkbox,
      options: async () => getFamilyOptionsByLevel(HierLevel.Platform),
    },
    {
      fieldKey: "secPlatform",
      fieldTitle: "תת פלטפורמה",
      fieldType: FieldType.Checkbox,
      options: async () => getFamilyOptionsByLevel(HierLevel.SubPlatform),
    },
    {
      fieldKey: "others",
      fieldTitle: "אחרים",
      fieldType: FieldType.Checkbox,
      options: async () => [
        { label: "isGlobal", value: "isGlobal", text: "גלובלי" },
        // { label: 'isDefault', value: 'isDefault', text: 'ברירת מחדל' },
      ],
    },
  ];

  const getCompletedFamilyHierarchyDown = (family: IFamily[]): IFamily[] => {
    const all = family.map((fam) => {
      const sons = families.filter((f) => f.parentCode === fam.code);

      if (sons.length !== 0) {
        return [...family, ...getCompletedFamilyHierarchyDown(sons)];
      } else {
        return fam;
      }
    });

    return all.flat();
  };

  const onSetSelectedFilters = (
    newFilters: IDashboardFiltersValue<IDynamicChartFilters>[]
  ) => {
    const familyFilters = getFamilyFilters(newFilters);
    const familyFiltersKeys = familyFilters.map((f) => f.fieldKey);
    const otherFilters = newFilters.filter(
      (f) => !familyFiltersKeys.includes(f.fieldKey)
    );

    const families = familyFilters
      .map((filter) =>
        filter.values.map((val) => ({ code: val.value }) as IFamily)
      )
      .flat();
    const completedFamilyHierachyDown: IFamily[] =
      getCompletedFamilyHierarchyDown(families);

    const newCompletedFilters: IDashboardFiltersValue<IDynamicChartFilters>[] =
      [] as IDashboardFiltersValue<IDynamicChartFilters>[];

    for (const key in FamilyFilters) {
      // gets a complete family hierachy for the current key
      const completedValsForKey = completedFamilyHierachyDown
        .filter((fam) => fam.hierLevel === key)
        .map(
          (fam) => ({ value: fam.code, text: fam.description }) as IOptionVal
        );
      // get already checked filters with description at curr family
      const newFilterValsForKey =
        newFilters.find((f) => f.fieldKey === FamilyFilters[key])?.values ?? [];

      const famFilter: IDashboardFiltersValue<IDynamicChartFilters> = {
        fieldKey: FamilyFilters[key],
        fieldTitle: FamilyTitle[key],
        values: [...completedValsForKey, ...newFilterValsForKey],
      };

      newCompletedFilters.push(famFilter);
    }

    const configFilterIndex = otherFilters.findIndex(
      (f) => f.fieldKey === "others"
    );

    // when isDefault variant option is chosen it also becomes global
    if (configFilterIndex !== -1) {
      const isDefault = otherFilters[configFilterIndex].values.some(
        (v) => v.value === "isDefault"
      );

      if (isDefault) {
        const isGlobal = otherFilters[configFilterIndex].values.some(
          (v) => v.value === "isGlobal"
        );

        if (!isGlobal) {
          otherFilters[configFilterIndex].values.push({
            value: "isGlobal",
            text: "גלובלי",
          });
        }
      }
    }

    return [...otherFilters, ...newCompletedFilters];
  };

  // send an update to variant (create new variant or update for existing one)
  const handleVariantValuesChange = async (
    selectedFilters: IDashboardFiltersValue<IDynamicChartFilters>[]
  ): Promise<void> => {
    if (!props.currVariant) return;

    if (
      (!props.currVariant.variantId &&
        (!newVariantTitle || !newVariantTitle?.replace(/\s/g, "").length)) ||
      (props.currVariant.variantId &&
        (!props.currVariant.variantDescription ||
          !props.currVariant.variantDescription?.replace(/\s/g, "").length))
    ) {
      toast("לא הוזנה כותרת לוריאנט", { icon: "❗" });
      throw new Error("");
    } else if (selectedFilters.length === 0) {
      toast("לא נבחרו נתונים לוריאנט", { icon: "❗" });
      throw new Error("");
    }

    const variant: IVariant = props.currVariant.variantId
      ? { ...props.currVariant }
      : ({
          variantDescription: newVariantTitle,
          type: VariantType.dynamicChart,
        } as IVariant);

    const variantConfig = selectedFilters.find((f) => f.fieldKey === "others");

    variant.isGlobal =
      variantConfig?.values.some((v) => v.value === "isGlobal") ?? false;

    variant.isDefault =
      variantConfig?.values.some((v) => v.value === "isDefault") ?? false;

    variant.values = selectedFilters
      .filter((f) => f.fieldKey !== variantConfig?.fieldKey)
      .map((f) => {
        return f.values.map((value) => ({
          field: f.fieldKey,
          value: value.value.toString(),
        }));
      })
      .flat();

    upsertVariant(variant);
  };

  const handleVariantSelect = (option: IOption) => {
    if (!props.variants) return;
    const selectedVariant = props.variants.find(
      (v) => v.variantId.toString() === option.value
    );
    if (!selectedVariant) return;
    const filtersOfVariant = getFiltersOfVariant(selectedVariant);

    props.setCurrVariant(selectedVariant);
    setVariantFilters(filtersOfVariant);
    setPrevVariant(selectedVariant);
  };

  const Title = (): JSX.Element => {
    return (
      <input
        className="dynamicChart-input"
        value={props.currVariant?.variantDescription ?? newVariantTitle}
        autoFocus
        placeholder="כותרת הגרף"
        maxLength={20}
        onChange={(e) => {
          props.currVariant?.variantId
            ? props.setCurrVariant((prev) => {
                if (!prev) return;
                return {
                  ...prev,
                  variantDescription: e.target.value,
                };
              })
            : setNewVariantTitle(e.target.value);
        }}
      />
    );
  };

  const handleAddNewVariant = () => {
    setIsFiltersOpen((prev) => !prev);
    setVariantFilters([]);
    props.setCurrVariant({} as IVariant);
  };

  const handleDeleteVariant = async () => {
    if (!props.currVariant) return;

    deleteVariant(props.currVariant.variantId);
  };

  const handleMenuSelect = () => {
    setOpenOptionsMenu(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    currFamily.level !== HierLevel.All
      ? setVariantFilters([])
      : setVariantFilters(getInitialVariantFilters());
  }, [currFamily.level]);

  const onBarClick = (hours: number) =>
    props.onExpectedKshirutBarClick(hours, variantFilters);

  return (
    <div className="graph-container">
      <div className="dynamicChart-container">
        <div style={{ minHeight: "2rem" }}>
          {currFamily.level === HierLevel.All && (
            <div className="dynamicChart-header">
              <span className="dynamicChart-header-title">
                <Tooltip title={props.currVariant?.variantDescription}>
                  <span style={{ fontWeight: "500" }}>
                    {props.currVariant?.variantDescription}
                  </span>
                </Tooltip>
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ClickAwayListener
                  onClickAway={() => setOpenOptionsMenu(false)}
                >
                  <IconButton
                    id="options"
                    onClick={(e) => {
                      e.currentTarget && setAnchorEl(e.currentTarget);
                      setOpenOptionsMenu((prev) => !prev);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </ClickAwayListener>
                <Menu
                  id="options-menu"
                  anchorEl={anchorEl}
                  open={openOptionsMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuSelect();
                      handleAddNewVariant();
                    }}
                  >
                    <span className="menuItem">
                      <Add className="menuItem-icon" /> יצירה
                    </span>
                  </MenuItem>
                  {props.currVariant && (
                    <MenuItem
                      onClick={() => {
                        handleMenuSelect();
                        handleDeleteVariant();
                      }}
                    >
                      <span className="menuItem">
                        <Delete className="menuItem-icon" /> מחיקה
                      </span>
                    </MenuItem>
                  )}
                  {props.currVariant && (
                    <MenuItem
                      onClick={() => {
                        handleMenuSelect();
                        setIsFiltersOpen((prev) => !prev);
                      }}
                    >
                      <span className="menuItem">
                        <Edit className="menuItem-icon" /> עדכון
                      </span>
                    </MenuItem>
                  )}
                </Menu>
                <DashboardDropdown
                  resettable={false}
                  options={dynamicChartVariantOptions}
                  values={[{ label: "בחר וריאנט", value: "" }]}
                  placeholder=""
                  title={"בחר וריאנט"}
                  style="border"
                  onSelect={handleVariantSelect}
                  textFieldProps={{ inputProps: { maxLength: 20 } }}
                  open={openDropdown}
                  onLabelClick={setOpenDropdown}
                  onOuterClick={() => setOpenDropdown(false)}
                />
              </div>
            </div>
          )}
        </div>
        {isFiltersOpen && (
          <DashboardFilters<IDynamicChartFilters>
            title={<Title />}
            fields={fields}
            isOpen={isFiltersOpen}
            updateFiltersOnChange={onSetSelectedFilters}
            selectedFilters={variantFilters}
            setSelectedFilters={handleVariantValuesChange}
            setIsOpen={() => {
              setIsFiltersOpen((prev) => !prev);
              setNewVariantTitle("");
            }}
            actionButtonText="שמירה"
            onCancel={() => props.setCurrVariant(prevVariant)}
          />
        )}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            addFilters(
              [
                ...(props.selectedTopViewFilters
                  ? props.selectedTopViewFilters
                  : []
                ).map(
                  (filter) =>
                    ({
                      fieldKey: filter.fieldKey,
                      filterValues: [
                        ...filter.values.map((value) => value.value),
                      ],
                    }) as FilterChange<GeneralDashboardTableRow>
                ),
                {
                  fieldKey: kshirutType.value,
                  filterValues: [Kshirut.Not_Kashir],
                },
                ...variantFilters
                  .filter((f) => f.fieldKey !== "others")
                  .map(
                    (filter) =>
                      ({
                        fieldKey: filter.fieldKey,
                        filterValues: [
                          ...filter.values.map((value) => value.value),
                        ],
                      }) as FilterChange<GeneralDashboardTableRow>
                  ),
              ],
              { clear: false }
            );
            navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`, {
              state: {
                visibleColumns: ["expectedTime", "faultNum"],
              },
            });
          }}
        >
          <KshirutPieGraph
            totalEquipmentsCount={props.equipmentsCount}
            kashirEquipmentsCount={props.kashirEquipmentsCount}
          />
        </div>
      </div>
      <div style={{ borderLeft: "1px solid #7d808997", height: "20vh" }} />
      <div className="kshirutDevelopement-container">
        <KshirutDevelopmentGraph
          kshirimIn24={props.kshirimIn24}
          kshirimIn48={props.kshirimIn48}
          kshirimIn72={props.kshirimIn72}
          totalEquipments={props.equipmentsCount}
          variantFilters={variantFilters}
          onBarClick={onBarClick}
        />
      </div>
    </div>
  );
};

export default DynamicKshirutChart;
