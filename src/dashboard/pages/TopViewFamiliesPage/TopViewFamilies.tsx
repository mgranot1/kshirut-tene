import { KeyboardReturn } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/AddRounded";
import Button from "@mui/material/Button";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import hiddenSpeed from "../../../assets/dashboard/hidden_speed.png";
import speed from "../../../assets/dashboard/speed.png";
import { isFilterAlreadyExists } from "../../../report/utils/filterZadiks.util";
import { SitePaths } from "../../../router/routes";
import Loader from "../../../shared/components/Loader/Loader";
import useLocalStorage from "../../../shared/hooks/useLocalStorage";
import { ITsavIrgunLevel } from "../../../shared/types/tsavIrgun.types";
import {
  ORG_LEVEL_KEY,
  ROUTINE_TREE_TYPE,
} from "../../../shared/utils/constants";
import exportTopViewFamiliesToExcel from "../../../shared/utils/exceljs.utils";
import { findLastValidFamilyPath } from "../../../shared/utils/family.utils";
import { findFamilyDetails } from "../../../shared/utils/familyLevel.utils";
import { padTo8Digits } from "../../../shared/utils/general.utils";
import {
  getLastValidFromSelectedTsav,
  getLevelCodeFromSelectedTsav,
  orgLevelFilterCode,
} from "../../../shared/utils/orgLevel.utils";
import DashboardFilters from "../../components/DashboardFilters/DashboardFilters";
import FilterList from "../../components/DashboardFilters/FilterList";
import { FamilyFilters } from "../../components/DynamicKshirutChart/DynamicKshirutChart";
import { familyLevelFilter } from "../../components/FamilyFilter/FamiliesFilters";
import KshirutFamilyCard, {
  CardDetails,
} from "../../components/KshirutFamilyCard/KshirutFamilyCard";
import DashboardTitle from "../../components/layout/DashboardTitle/DashboardTitle";
import TopViewPath, {
  TopViewPathValue,
} from "../../components/TopViewPath/TopViewPath";
import useDbdGeneralFilters, { FilterChange } from "../../hooks/useDbdFilters";
import { useGroupedEquipments } from "../../hooks/useGroupedEquipments";
import { useKshirutByFamilies } from "../../hooks/useKshirutByFamilies";
import useTopViewFilters from "../../hooks/useTopViewFilters";
import useGetDashboardEquipments from "../../services/dashboard/useGetDashboardEquipments";
import { useGetMaterials } from "../../services/material/useGetMaterials";
import { dashboardFilteredEquipmentData } from "../../stores/DashboardData.store";
import { IFamilyType, minimalFamily } from "../../stores/DashFilters.store";
import { familiesListState } from "../../stores/families.store";
import {
  defaultFamiliesPath,
  familiesPathState,
  familyLevelDesc,
  FamilyPath,
} from "../../stores/familiesPath.store";
import { filteredLevelsOptionsState } from "../../stores/filteredLevelsOptions.store";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import {
  nextOrgLevelState,
  OrgLevelOptions,
} from "../../stores/nextOrgLevel.store";
import {
  OrgLevelPath,
  orgLevelPathState,
} from "../../stores/orgLevelPath.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";
import {
  OrganizationalLevel,
  OrgLevelCode,
} from "../../types/dashboardOrgLevel.types";
import { HierLevel, IFamily } from "../../types/family.types";
import { DashboardFault } from "../../types/FaultTable.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import { Drilltype } from "../CustomScreen/CustomScreen";
import "../TopViewFamiliesPage/TopViewFamilies.scss";
import {
  getGroupedEquipmentsForExcel,
  getTotalRowForExcel,
} from "./handleTopViewFamiliesToExcel";

// Family BY Organization level
const subTitle: Record<OrgLevelCode, string> = {
  [OrgLevelCode.TREE_TYPE]: "",
  [OrgLevelCode.PIKUD]: "לפי פיקודים",
  [OrgLevelCode.UGDA]: "לפי אוגדות",
  [OrgLevelCode.UTZVA]: "לפי חטיבות",
  [OrgLevelCode.GDUD]: "לפי גדודים",
};

export type EquipmentsByFamily = {
  [family: IFamily["code"]]: {
    equipments: GeneralDashboardTableRow[];
    notKashirAmount: number;
  };
};

export type TotalRow = {
  all: number;
  notKashirAmount: number;
  equipments: GeneralDashboardTableRow[];
};

const TopViewFamilies = () => {
  const minFamilyFilter = useRecoilValue<IFamilyType>(minimalFamily);
  const families = useRecoilValue(familiesListState);
  const { filteredFamilies, getFamiliesByLevelAndFilter } =
    useKshirutByFamilies(families);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedOrganizationalLevel] =
    useLocalStorage<OrganizationalLevel>(ORG_LEVEL_KEY);
  const kshirutType = useRecoilValue(kshirutTypeState);
  const {
    data: dashboardEquipments,
    isFetched,
    isLoading,
  } = useGetDashboardEquipments(useRecoilValue(orgTreeAtom));
  const equipmentsData = useRecoilValue<GeneralDashboardTableRow[]>(
    dashboardFilteredEquipmentData
  );
  const [filteredEquipmentByCurrentLevel, setFilteredEquipmentByCurrentLevel] =
    useState<GeneralDashboardTableRow[]>();
  const [nextOrgLevelFromSession] = useRecoilState(nextOrgLevelState);
  const [orgLevelHeaders, setOrgLevelHeaders] = useState<OrgLevelOptions>(
    nextOrgLevelFromSession
  );
  const filteredLevelsOptions = useRecoilValue(filteredLevelsOptionsState);
  const [isPieVisible, setIsPieVisible] = useState(false);
  const [familiesPath, setFamiliesPath] = useRecoilState(familiesPathState);
  const [orgLevelPathFromRecoil] = useRecoilState(orgLevelPathState);
  const [orgLevelPath, setOrgLevelPath] = useState<OrgLevelPath>(
    orgLevelPathFromRecoil
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { groupedEquipmentsByFamilies, groupedEquipmentsByOrgLevel } =
    useGroupedEquipments();
  const {
    fields,
    selectedFilters: selectedDbdGFilters,
    setSelectedFilters: setSelectedDbdGFilters,
    addFilters,
  } = useDbdGeneralFilters();
  const materialsList = useGetMaterials();
  const { selectedFilters: topViewSelectedFilters } = useTopViewFilters();

  const isRoutineTree = useMemo(() => {
    return selectedOrganizationalLevel
      ? selectedOrganizationalLevel[OrgLevelCode.TREE_TYPE][0]?.value ===
          ROUTINE_TREE_TYPE
      : false;
  }, [selectedOrganizationalLevel]);
  const percScrollRefs = useRef<HTMLDivElement[]>([]);
  // The ref bellow keeps track of the scrollbar to trigger the percScroll event.
  // This is because scrolling all the percentage tabs triggers the scroll event of every element and only the scrollbar that the user dragged should trigger the event.
  const percScrollTrigger = useRef<boolean[]>([]);

  const handlePercScroll = (
    index: number,
    event: React.UIEvent<HTMLDivElement, UIEvent>
  ) => {
    const scrollAmount = event.currentTarget.scrollLeft;
    percScrollRefs.current.forEach((div, divIndex) => {
      if (divIndex !== index) {
        div.scrollLeft = scrollAmount;
        percScrollTrigger.current[divIndex] = false;
      }
    });
  };
  useEffect(() => {
    if (topViewSelectedFilters.length > 0) {
      setSelectedDbdGFilters(() => [...topViewSelectedFilters]);
    }
  }, [topViewSelectedFilters]);

  const convertFamilyToCardDetails = (family: IFamily): CardDetails => {
    return {
      code: family.code,
      description: family.description,
      hierLevel: family.hierLevel,
      index: 0,
    };
  };

  const getInitialColumns = (): CardDetails[] => {
    return filteredFamilies(minFamilyFilter.codes, minFamilyFilter.level).map(
      (family) => convertFamilyToCardDetails(family)
    );
  };
  const [columns, setColumns] = useState<CardDetails[]>(getInitialColumns());

  const getFamilyPath = (): FamilyPath | OrgLevelPath => {
    const path = { ...defaultFamiliesPath };

    Object.keys(path).forEach((key) => {
      if (Number(key) <= Number(minFamilyFilter.level) + 1) {
        path[key] = {
          hierLevel: key,
        } as TopViewPathValue;
      }
    });
    return path;
  };

  const navigateToEquipments = (
    selectedCardDetails: CardDetails,
    drillType: Drilltype
  ) => {
    const lastValidOrgPath =
      drillType === Drilltype.ByOrgLevel
        ? selectedCardDetails
        : getLastValidFromSelectedTsav(orgLevelPath);
    const lastValidFamilyPath =
      drillType === Drilltype.ByFamily
        ? selectedCardDetails
        : findLastValidFamilyPath(familiesPath);
    const simulValues = lastValidOrgPath?.hierLevel
      ? filteredLevelsOptions[lastValidOrgPath?.hierLevel]?.find(
          (option) =>
            (isRoutineTree ? option.funcLoc : option.objid) ===
            lastValidOrgPath.code
        )
      : null;
    // different string handling in useDbdFilters - in case
    //  of  Gdud, no need for padding, but padding is required in other cases.
    const relevantCodes = simulValues?.relevantSimuls
      ? simulValues.relevantSimuls
      : [
          lastValidOrgPath?.hierLevel === OrgLevelCode.GDUD
            ? lastValidOrgPath?.code
            : isRoutineTree
              ? simulValues?.funcLoc
              : lastValidOrgPath?.code && padTo8Digits(lastValidOrgPath?.code),
        ];

    // Determine the org filter key with special case for Gdud (4) in war
    const orgFilterKey = lastValidOrgPath
      ? lastValidOrgPath.hierLevel === OrgLevelCode.GDUD
        ? isRoutineTree
          ? "routineTplnr"
          : "warTplnr"
        : orgLevelFilterCode[lastValidOrgPath.hierLevel]
      : undefined;

    const familyFilterKey = lastValidFamilyPath
      ? familyLevelFilter[lastValidFamilyPath.hierLevel]?.key
      : undefined;
    let familyFilter: FilterChange<GeneralDashboardTableRow>[] = [];

    if (lastValidFamilyPath && familyFilterKey) {
      if (familyFilterKey === "material") {
        const materialAlreadyExists = isFilterAlreadyExists(
          selectedDbdGFilters,
          String(lastValidFamilyPath.code),
          "material"
        );

        if (!materialAlreadyExists) {
          familyFilter = [
            {
              fieldKey: familyFilterKey as keyof DashboardFault,
              filterValues: [String(lastValidFamilyPath.code)],
            },
          ];
        }
      } else {
        familyFilter = [
          {
            fieldKey: familyFilterKey as keyof DashboardFault,
            filterValues: [String(lastValidFamilyPath.code)],
          },
        ];
      }
    }
    const filters = [
      // orgLevel‑filter
      ...(lastValidOrgPath && orgFilterKey
        ? [
            {
              fieldKey: orgFilterKey as keyof DashboardFault,
              filterValues: relevantCodes,
            },
          ]
        : []),

      // familyLevel‑filter
      ...familyFilter,
    ] as FilterChange<GeneralDashboardTableRow>[];
    addFilters(filters, { clear: false });

    const orgCode = lastValidOrgPath ? String(lastValidOrgPath.code) : "";
    navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`, {
      state: {
        code: [orgCode],
      },
    });
  };

  const handleTopViewPathChange = (level: HierLevel) => {
    const prevPath: FamilyPath = { ...familiesPath };
    Object.keys(prevPath).forEach((key) => {
      if (Number(key) > Number(level)) {
        prevPath[key] = null;
      } else if (Number(key) === Number(level)) {
        prevPath[key] = {
          ...prevPath[key],
          optionalDesc: null,
          code: null,
        };
      }
    });

    setFamiliesPath(prevPath as OrgLevelPath);

    const codes = getFamiliesByLevelAndFilter(
      minFamilyFilter.codes,
      Number(level)
    );
    setColumns(
      families
        .filter(
          (family) =>
            codes.includes(family.code) &&
            (level === HierLevel.Family ||
              !prevPath[(Number(level) - 1).toString()].code ||
              family.parentCode ===
                prevPath[(Number(level) - 1).toString()]?.code)
        )
        .map((f) => convertFamilyToCardDetails(f))
    );
  };
  const createPathUpdate = (selectedCardDetails: CardDetails) => {
    const currentLevel: TopViewPathValue = {
      hierLevel: selectedCardDetails.hierLevel,
      code: selectedCardDetails.code,
      optionalDesc: selectedCardDetails.description,
    };

    return {
      [selectedCardDetails.hierLevel]: currentLevel,
    };
  };
  const getMaterialColumns = (selectedCardDetails: CardDetails) => {
    const relevantMaterials = materialsList.data?.filter(
      (mat) => mat.parentCode === selectedCardDetails.code
    );
    const newColumns =
      relevantMaterials?.map(
        (mat, i) =>
          ({
            code: mat.material,
            description: `${mat.material} - ${mat.materialDesc}`,
            hierLevel: HierLevel.Material,
          }) as CardDetails
      ) ?? [];
    return newColumns;
  };
  const handleSelectCard = (
    selectedCardDetails: CardDetails,
    drillType: Drilltype
  ) => {
    if (drillType === Drilltype.ByOrgLevel) {
      if (
        selectedCardDetails?.hierLevel === (OrgLevelCode.GDUD as OrgLevelCode)
      ) {
        navigateToEquipments(selectedCardDetails, drillType);
        return;
      }
      const pathUpdate = createPathUpdate(selectedCardDetails);
      setOrgLevelPath((prev) => ({ ...prev, ...pathUpdate }));

      setOrgLevelHeaders((prev) => ({
        levelCode: prev.levelCode + 1,
        options: filteredLevelsOptions[
          Number(selectedCardDetails.hierLevel) + 1
        ]?.filter(
          (option: ITsavIrgunLevel) =>
            option.fatherIndex === selectedCardDetails.index
        ),
      }));
      if (
        (selectedCardDetails.hierLevel as OrgLevelCode) !== OrgLevelCode.GDUD
      ) {
        handleDiveIn(selectedCardDetails, drillType);
      }
    } else {
      if (selectedCardDetails?.hierLevel === HierLevel.SubPlatform) {
        // navigateToEquipments(selectedCardDetails, drillType);
        setColumns(getMaterialColumns(selectedCardDetails));
        const pathUpdate = createPathUpdate(selectedCardDetails);
        setFamiliesPath((prev) => ({ ...prev, ...pathUpdate }));
        handleDiveIn(selectedCardDetails, drillType);
        return;
      }
      if (selectedCardDetails?.hierLevel === HierLevel.Material) {
        navigateToEquipments(selectedCardDetails, drillType);
        return;
      }
      const pathUpdate = createPathUpdate(selectedCardDetails);
      setFamiliesPath((prev) => ({ ...prev, ...pathUpdate }));

      const currentColumns = families
        .filter((family) => family.parentCode === selectedCardDetails.code)
        .map((f) => convertFamilyToCardDetails(f));
      setColumns(currentColumns);
      handleDiveIn(selectedCardDetails, drillType);
    }
  };
  useEffect(() => {
    setFilteredEquipmentByCurrentLevel(equipmentsData);
  }, [equipmentsData]);

  const handleGoBackByOrgLevel = () => {
    // Limit the user to not revert past the given tsav.
    if (
      orgLevelHeaders.levelCode >
      getLevelCodeFromSelectedTsav(selectedOrganizationalLevel) + 1
    ) {
      setOrgLevelHeaders((prev) => ({
        levelCode: prev.levelCode - 1,
        options: filteredLevelsOptions[prev.levelCode - 1],
      }));
      const prevHierLevelKey =
        OrgLevelCode[orgLevelHeaders.levelCode - 1].toLowerCase();
      const lastSelectedOrgLevel = filteredLevelsOptions[
        orgLevelHeaders.levelCode - 1
      ].find(
        (option: ITsavIrgunLevel) =>
          (isRoutineTree ? option.funcLoc : option.objid) ===
          orgLevelPath[orgLevelHeaders.levelCode - 1]?.code
      );
      const prevOrgLevelCodes =
        filteredLevelsOptions[orgLevelHeaders.levelCode - 1]
          ?.filter(
            (option: ITsavIrgunLevel) =>
              option.fatherIndex === lastSelectedOrgLevel?.fatherIndex
          )
          .map((option: ITsavIrgunLevel) =>
            isRoutineTree ? option.funcLoc : option.objid
          ) || [];
      setFilteredEquipmentByCurrentLevel(() =>
        equipmentsData.filter((equipment) =>
          prevOrgLevelCodes.includes(
            isRoutineTree
              ? equipment[prevHierLevelKey]
              : Number(equipment[prevHierLevelKey])
          )
        )
      );
    }
  };
  const handleDiveIn = (
    selectedCardDetails: CardDetails,
    drillType: Drilltype
  ) => {
    const currentLevelKey =
      drillType === Drilltype.ByOrgLevel
        ? OrgLevelCode[selectedCardDetails.hierLevel].toLowerCase()
        : FamilyFilters[selectedCardDetails.hierLevel];
    setFilteredEquipmentByCurrentLevel((prev) =>
      prev?.filter((equipment) => {
        if (isRoutineTree) {
          return equipment[currentLevelKey] === selectedCardDetails.code;
        }
        return (
          Number(equipment[currentLevelKey]).toString() ===
          selectedCardDetails.code.toString()
        );
      })
    );
  };

  const rows = useMemo((): CardDetails[] => {
    return (
      orgLevelHeaders.options?.map((orgLevel) => ({
        code:
          isRoutineTree || orgLevel.hierLevel === OrgLevelCode.GDUD
            ? orgLevel.funcLoc
            : orgLevel.objid,
        description: orgLevel.funcLocDesc,
        hierLevel: orgLevel.hierLevel as OrgLevelCode,
        index: orgLevel.index,
      })) ?? []
    );
  }, [orgLevelHeaders, minFamilyFilter]);

  const handleOverallCardClick = (familyTree: FamilyPath) => {
    const familyLevelDetails = findFamilyDetails(familyTree);
    const lastValidOrgPath = getLastValidFromSelectedTsav(orgLevelPath);
    let orgFilterKey: string | undefined;

    if (lastValidOrgPath) {
      if (lastValidOrgPath.hierLevel === OrgLevelCode.GDUD) {
        if (isRoutineTree) {
          orgFilterKey = "routineTplnr";
        } else {
          orgFilterKey = "warTplnr";
        }
      } else {
        orgFilterKey = orgLevelFilterCode[lastValidOrgPath.hierLevel];
      }
    } else {
      orgFilterKey = undefined;
    }

    const simulValues = lastValidOrgPath?.hierLevel
      ? filteredLevelsOptions[lastValidOrgPath?.hierLevel]?.find(
          (option) =>
            (isRoutineTree ? option.funcLoc : option.objid) ===
            lastValidOrgPath.code
        )
      : null;
    const relevantCodes = simulValues?.relevantSimuls ?? [
      isRoutineTree
        ? simulValues?.funcLoc
        : lastValidOrgPath?.code && padTo8Digits(lastValidOrgPath?.code),
    ];

    const orgLevelFilters = [
      ...(lastValidOrgPath && orgFilterKey
        ? [
            {
              fieldKey: orgFilterKey as keyof DashboardFault,
              filterValues: relevantCodes,
            },
          ]
        : []),
    ];
    const familyLevelFilters = [
      ...(familyLevelDetails
        ? [
            {
              fieldKey:
                `${FamilyFilters[familyLevelDetails["hierLevel"]]}` as keyof DashboardFault,
              filterValues: [`${familyLevelDetails["code"]}`],
            },
          ]
        : []),
    ];
    const filtersArray = [
      ...orgLevelFilters,
      ...familyLevelFilters,
    ] as FilterChange<GeneralDashboardTableRow>[];

    addFilters(filtersArray, { clear: false });

    navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`);
  };
  const isEquipmentInSelectedCodes = (
    equipment: GeneralDashboardTableRow,
    filterField: string,
    codes: string[]
  ) => {
    const fieldValue = equipment[filterField];
    return codes.includes(fieldValue);
  };
  const groupedEquipments: EquipmentsByFamily = useMemo(() => {
    const codes = columns.map((column) => column.code);
    const filterField = FamilyFilters[columns[0]?.hierLevel];
    const filteredEquipments = equipmentsData?.filter((eq) =>
      isEquipmentInSelectedCodes(eq, filterField, codes)
    );

    return groupedEquipmentsByOrgLevel(
      filteredEquipments,
      isRoutineTree,
      kshirutType.value,
      orgLevelHeaders
    );
  }, [kshirutType, rows, orgLevelHeaders, columns, equipmentsData]);

  const isNoData =
    isFetched &&
    (Object.keys(groupedEquipments).length === 0 ||
      rows.length === 0 ||
      !rows.some((row) => groupedEquipments[row.code]));

  useEffect(() => {
    const selectedLevel = location.state?.fromEquipListTo;

    // handle navigate from EquipmentList comp
    if (selectedLevel) {
      if (familiesPath[Number(selectedLevel) - 1]?.code) {
        setColumns(
          families
            .filter(
              (f) =>
                f.parentCode === familiesPath[Number(selectedLevel) - 1]?.code
            )
            .map((f) => convertFamilyToCardDetails(f))
        );
      } else {
        setColumns(
          filteredFamilies(
            minFamilyFilter.codes,
            (Number(selectedLevel) - 1).toString()
          ).map((f) => convertFamilyToCardDetails(f))
        );
      }

      // To initial locataion.state
      navigate(location, { replace: true });
    } else {
      setColumns(
        filteredFamilies(minFamilyFilter.codes, minFamilyFilter.level).map(
          (f) => convertFamilyToCardDetails(f)
        )
      );
      setFamiliesPath(getFamilyPath() as FamilyPath);
    }
  }, [minFamilyFilter]);

  // TODO: titles and groupedEquipments are very similar. Try to merge them
  const titles: EquipmentsByFamily = useMemo(() => {
    return groupedEquipmentsByFamilies(
      filteredEquipmentByCurrentLevel ?? [],
      kshirutType.value
    );
  }, [
    filteredEquipmentByCurrentLevel,
    kshirutType,
    rows,
    orgLevelHeaders,
    columns,
  ]);

  const [totalEquipments, notKashirAmount] = Object.values(rows).reduce<
    [GeneralDashboardTableRow[], number]
  >(
    (acc, row) => {
      const equipments = groupedEquipments?.[row.code]?.equipments ?? [];
      return [
        [...acc[0], ...equipments], // Safely concatenate arrays
        acc[1] + (groupedEquipments?.[row.code]?.notKashirAmount ?? 0),
      ];
    },
    [[], 0] as [GeneralDashboardTableRow[], number] // Type-asserted initial value
  );
  const totalRow: TotalRow = {
    all: totalEquipments?.length,
    notKashirAmount: notKashirAmount,
    equipments: totalEquipments,
  };

  const totalRowDetails: CardDetails = {
    description: 'סה"כ',
    hierLevel: columns[0]?.hierLevel,
    code: "0",
    index: 0,
  };
  const handleExportToExcel = () => {
    const rowsDataToExcel = getGroupedEquipmentsForExcel(
      rows,
      groupedEquipments,
      isRoutineTree,
      kshirutType.value,
      orgLevelHeaders,
      columns,
      groupedEquipmentsByFamilies
    );

    const totalRowToExcel = getTotalRowForExcel(
      columns,
      totalRow.equipments,
      isRoutineTree,
      kshirutType.value,
      orgLevelHeaders,
      groupedEquipmentsByFamilies
    );
    exportTopViewFamiliesToExcel(
      columns.filter((column) => {
        const title = titles[column.code];
        return title && title.equipments;
      }),
      rows
        .sort((fam1, fam2) => (fam1.code > fam2.code ? 1 : -1))
        .filter(
          (row) =>
            groupedEquipments[row.code] &&
            groupedEquipments[row.code].equipments.length > 0
        ),
      rowsDataToExcel,
      totalRowToExcel
    );
  };
  useEffect(() => {
    setOrgLevelHeaders(nextOrgLevelFromSession);
  }, [nextOrgLevelFromSession]);
  useEffect(() => {
    setOrgLevelPath(orgLevelPathFromRecoil);
  }, [orgLevelPathFromRecoil]);
  return (
    <div className="top-view-families">
      <TopViewPath
        path={familiesPath}
        onTopViewPathChange={handleTopViewPathChange}
      />
      <DashboardTitle
        title={`כשירות ${familyLevelDesc[rows[0]?.hierLevel] ?? ""}`}
        subTitle={
          selectedOrganizationalLevel &&
          selectedOrganizationalLevel[OrgLevelCode.GDUD].length
            ? "לפי הגדוד הנבחר"
            : subTitle[orgLevelHeaders.levelCode]
        }
      />
      <div className="top-view-families__buttons">
        <Button
          className="top-view-families__buttons--button"
          onClick={() => setIsFiltersOpen((prev) => !prev)}
        >
          <AddIcon sx={{ width: "1.2rem" }} />
          <span> הוספת סינון </span>
        </Button>
        <Button
          className="top-view-families__buttons--button"
          onClick={() => setIsPieVisible((prev) => !prev)}
        >
          <img
            src={isPieVisible ? speed : hiddenSpeed}
            alt="toggle"
            style={{
              width: "1.2rem",
              marginRight: "0.5rem",
              marginLeft: "0.5rem",
            }}
          />
          <span> שנה מצב תצוגה</span>
        </Button>

        <Button
          className="top-view-families__buttons--button"
          onClick={() => handleGoBackByOrgLevel()}
        >
          <KeyboardReturn
            sx={{ width: "1.2rem", transform: "rotate(180deg)" }}
          />
          <span>חזור לפי צו ארגון</span>
        </Button>

        <Button
          onClick={() => {
            handleExportToExcel();
          }}
          className="top-view-families__buttons--button table-button save-report-button"
        >
          ייצוא לאקסל
        </Button>
      </div>
      <FilterList<GeneralDashboardTableRow>
        isEditMode
        filters={selectedDbdGFilters}
        onChangeFilters={setSelectedDbdGFilters}
      />
      <div className="top-view-families__content">
        {isLoading ? (
          <></>
        ) : (
          !isNoData && (
            <div className="header">
              <div className="top-view-families__cardsTitle">
                <div
                  ref={(tabDiv) => {
                    tabDiv ? (percScrollRefs.current[0] = tabDiv) : undefined;
                  }}
                  onScroll={(scrollEvent) => {
                    if (percScrollTrigger.current[0]) {
                      handlePercScroll(0, scrollEvent);
                    }
                    percScrollTrigger.current[0] = true;
                  }}
                  className="top-view-families__titles"
                >
                  {columns.map(
                    (i) =>
                      titles[i.code] && (
                        <>
                          <div
                            className="top-view-families__title"
                            onClick={() =>
                              handleSelectCard(i, Drilltype.ByFamily)
                            }
                          >
                            {i.description}
                          </div>
                          <div className="top-view-families__divider"> </div>
                        </>
                      )
                  )}
                </div>
              </div>
            </div>
          )
        )}
        <div className="top-view-families__cards">
          {isLoading ? (
            <Loader></Loader>
          ) : !isNoData ? (
            <>
              <KshirutFamilyCard
                isOverallCard={true}
                cardDetails={totalRowDetails}
                columns={columns}
                isPieVisible={isPieVisible}
                kshirutAmount={{
                  kashirEquipmentsCount:
                    totalRow.all - totalRow.notKashirAmount,
                  totalEquipmentsCount: totalRow.all,
                }}
                nextOrgLevel={orgLevelHeaders}
                equipments={totalRow.equipments}
                onSelect={() => handleOverallCardClick(familiesPath)}
                isRoutineTree={isRoutineTree}
                percentageTabProps={{
                  ref: (tabDiv) => {
                    tabDiv ? (percScrollRefs.current[1] = tabDiv) : undefined;
                  },
                }}
              />

              {rows
                .sort((fam1, fam2) => (fam1.code > fam2.code ? 1 : -1))
                .filter(
                  (row) =>
                    groupedEquipments[row.code] &&
                    groupedEquipments[row.code].equipments.length > 0
                )
                .map((row, kshirutTabIndex) => (
                  <KshirutFamilyCard
                    nextOrgLevel={orgLevelHeaders}
                    isOverallCard={false}
                    isPieVisible={isPieVisible}
                    key={row.code}
                    cardDetails={row}
                    columns={columns}
                    equipments={groupedEquipments[row.code].equipments}
                    kshirutAmount={{
                      kashirEquipmentsCount:
                        groupedEquipments[row.code].equipments.length -
                        groupedEquipments[row.code].notKashirAmount,
                      totalEquipmentsCount:
                        groupedEquipments[row.code].equipments.length,
                    }}
                    onSelect={handleSelectCard}
                    isRoutineTree={isRoutineTree}
                    percentageTabProps={{
                      ref: (tabDiv) => {
                        tabDiv
                          ? (percScrollRefs.current[kshirutTabIndex + 2] =
                              tabDiv)
                          : undefined;
                      },
                    }}
                  />
                ))}
            </>
          ) : (
            <div className="top-view-families__no-cards">
              -- לא קיימים כלים ברמה הארגונית שנבחרה --
            </div>
          )}
        </div>
      </div>

      {isFiltersOpen && (
        <DashboardFilters<GeneralDashboardTableRow>
          title={"סננים"}
          isOpen={isFiltersOpen}
          setIsOpen={setIsFiltersOpen}
          selectedFilters={selectedDbdGFilters}
          setSelectedFilters={setSelectedDbdGFilters}
          fields={fields.filter(
            (field) =>
              !(
                familiesPath[HierLevel.Platform]
                  ? (Object.values(
                      FamilyFilters
                    ) as (keyof GeneralDashboardTableRow)[])
                  : []
              ).includes(field.fieldKey)
          )}
        />
      )}
    </div>
  );
};

export default TopViewFamilies;
