import AddIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { SitePaths } from "../../../router/routes";
import Loader from "../../../shared/components/Loader/Loader";
import {
  ExpectedTime,
  FaultStatus,
  GrindType,
  Kshirut,
  PhysicalLocation,
} from "../../../shared/types/params.types";
import BarGraphKshirutByFamilies from "../../components/BarGraph/BarGraphKshirutByFamilies";
import DashboardFilters from "../../components/DashboardFilters/DashboardFilters";
import FilterList from "../../components/DashboardFilters/FilterList";
import DynamicKshirutChart, {
  IDynamicChartFilters,
} from "../../components/DynamicKshirutChart/DynamicKshirutChart";
import FamiliesFilters from "../../components/FamilyFilter/FamiliesFilters";
import HHTablePopUp from "../../components/HHTablePopup/HHTablePopUp";
import DashboardTitle from "../../components/layout/DashboardTitle/DashboardTitle";
import {
  TitleValueArrayCard,
  TitleValueCard,
  TitleValueGraphCard,
} from "../../components/TopViewComponents/TopViewComponents";
import useDbdGeneralFilters, { FilterChange } from "../../hooks/useDbdFilters";
import useTopViewFilters from "../../hooks/useTopViewFilters";
import { useGetTopViewDynamicFilters } from "../../services/dashboard/useGetTopViewDynamicFilters";
import useTopViewKPIData from "../../services/dashboard/useTopViewKPIData";
import useGetVariants from "../../services/variant/useGetVariants";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";
import { HierLevel } from "../../types/family.types";
import { IDashboardFiltersValue } from "../../types/filters.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import { TopViewDynamicFilters } from "../../types/topview.types";
import { IVariant } from "../../types/variant.types";
import "./TopView.scss";

const TopView = () => {
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [openHHPopUp, setOpenHHPopUp] = useState(false);
  const dynamicFiltersInitialized = useRef<boolean>(false);
  const [dynamicFilters, setDynamicFilters] = useState<
    TopViewDynamicFilters | undefined
  >();

  const {
    fields: topViewFields,
    selectedFilters: selectedTopViewFilters,
    setSelectedFilters: setSelectedTopViewFilters,
  } = useTopViewFilters(dynamicFilters);
  const {
    addFilters: addDbdGeneralFilters,
    clearFilters: clearDbdGeneralFilters,
  } = useDbdGeneralFilters();
  const selectedOrganizationalLevel = useRecoilValue(orgTreeAtom);

  const kshirutType = useRecoilValue(kshirutTypeState);

  const { data: variants } = useGetVariants();

  const [currVariant, setCurrVariant] = useState<IVariant | undefined>(
    variants?.find((v) => v.isDefault) ?? undefined
  );

  const { data: kpiData, isPending } = useTopViewKPIData(
    selectedTopViewFilters,
    currVariant?.variantId
  );

  const { data: dynamicFilters_ } = useGetTopViewDynamicFilters(
    kpiData?.cacheKey,
    dynamicFiltersInitialized.current === false
  );

  // this is in order to update the dynamicFilters state which helps to connect between
  // the topview fetch and the dynamic filters fetch as they are co-dependent
  useEffect(() => {
    if (Object.values(dynamicFilters_ ?? {}).flat().length) {
      setDynamicFilters(dynamicFilters_);
      dynamicFiltersInitialized.current = true;
    }
  }, [dynamicFilters_]);

  // This here is to make sure that the dynamicFilters update happens only on startup and whenever the dynamic filters become empty
  useEffect(() => {
    if (
      dynamicFiltersInitialized.current == true &&
      selectedTopViewFilters.findIndex((filter) =>
        ["warTplnr", "routineTplnr"].includes(filter.fieldKey)
      ) === -1
    ) {
      dynamicFiltersInitialized.current = false;
    }
  }, [selectedTopViewFilters]);

  useEffect(() => {
    clearDbdGeneralFilters();
  }, []);

  const minimalFamilyHierarchy: HierLevel = !!selectedTopViewFilters.find(
    (f) => f.fieldKey === "material"
  )
    ? HierLevel.Material
    : !!selectedTopViewFilters.find((f) => f.fieldKey === "secPlatform")
      ? HierLevel.SubPlatform
      : !!selectedTopViewFilters.find((f) => f.fieldKey === "mainPlatform")
        ? HierLevel.Platform
        : !!selectedTopViewFilters.find((f) => f.fieldKey === "materialFamily")
          ? HierLevel.Family
          : HierLevel.All;

  const handleFiltersButton = () => {
    setIsFiltersOpen(true);
  };

  const addFiltersIncludingTopView = (
    filtersToAdd: FilterChange<GeneralDashboardTableRow>[]
  ) => {
    addDbdGeneralFilters(
      [
        ...filtersToAdd,
        ...(selectedTopViewFilters?.map(
          (filter) =>
            ({
              fieldKey: filter.fieldKey,
              filterValues: [...filter.values.map((value) => value.value)],
            }) as FilterChange<GeneralDashboardTableRow>
        ) || []),
      ],
      { clear: false }
    );
  };

  const onAgamClick = () => {
    if (!kpiData?.agamKshirutTotal) return;
    addFiltersIncludingTopView([
      { fieldKey: "isAgamForce", filterValues: [true] },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`);
  };

  const onLogisticsClick = () => {
    if (!kpiData?.logisticKshirutTotal) return;
    addFiltersIncludingTopView([
      { fieldKey: "isLogisticForce", filterValues: [true] },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`);
  };

  const onZadikInAreaClick = () => {
    if (!kpiData?.malfunctionedEquipmentsInOurArea[0].value) return;
    addFiltersIncludingTopView([
      {
        fieldKey: "physicalLocation",
        filterValues: [
          PhysicalLocation.Eged,
          PhysicalLocation.InOurTerritory,
          PhysicalLocation.Industries,
          PhysicalLocation.Masha,
          PhysicalLocation.OperationalYamah,
        ],
      },
      {
        fieldKey: "faultStatus",
        filterValues: [
          FaultStatus.InWork,
          FaultStatus.MovedToHighRank,
          FaultStatus.Opened,
          FaultStatus.WaitingForMaintenance,
          FaultStatus.WaitingForParts,
          FaultStatus.WaitingForRecovery,
          FaultStatus.WaitingForSquad,
          FaultStatus.WaitingForTransportation,
        ],
      },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_FAULT}`);
  };

  const onZadikInWarClick = () => {
    if (!kpiData?.malfunctionedEquipmentsInWar[0].value) return;
    addFiltersIncludingTopView([
      {
        fieldKey: "physicalLocation",
        filterValues: [PhysicalLocation.CombatSpace],
      },
      {
        fieldKey: "faultStatus",
        filterValues: [
          FaultStatus.InWork,
          FaultStatus.MovedToHighRank,
          FaultStatus.Opened,
          FaultStatus.WaitingForMaintenance,
          FaultStatus.WaitingForParts,
          FaultStatus.WaitingForRecovery,
          FaultStatus.WaitingForSquad,
          FaultStatus.WaitingForTransportation,
        ],
      },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_FAULT}`);
  };

  const onHHClick = () => {
    setOpenHHPopUp((prev) => !prev);
  };

  const onRecoveryClick = () => {
    if (!kpiData?.recoveryAwaitingFaultsCount) return;
    addFiltersIncludingTopView([
      {
        fieldKey: "faultStatus",
        filterValues: [FaultStatus.WaitingForRecovery],
      },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_FAULT}`);
  };

  const onTransportClick = () => {
    if (!kpiData?.transportAwaitingFaultCount) return;
    addFiltersIncludingTopView([
      {
        fieldKey: "faultStatus",
        filterValues: [FaultStatus.WaitingForTransportation],
      },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_FAULT}`);
  };

  const onGrindClick = () => {
    if (!kpiData?.technicalGrinds && !kpiData?.operationalGrinds) return;
    addFiltersIncludingTopView([
      {
        fieldKey: "grindType",
        filterValues: [GrindType.Operational, GrindType.Technical],
      },
      {
        fieldKey: "faultStatus",
        fieldOptions: { isNotEqual: true },
        filterValues: [FaultStatus.Done],
      },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_FAULT}`);
  };

  const onExpectedKshirutBarClick = (
    hours: number,
    variantFilters: IDashboardFiltersValue<IDynamicChartFilters>[]
  ) => {
    addFiltersIncludingTopView([
      {
        fieldKey: "expectedTime",
        filterValues: [6, 12, 24, 48, 72]
          .filter((i) => hours >= i)
          .map((i) => ExpectedTime[`LessThan${i}`]),
        fieldOptions: { isNotEqual: true },
      },
      {
        fieldKey: kshirutType.value,
        filterValues: [Kshirut.Not_Kashir],
      },
      {
        fieldKey: "faultStatus",
        filterValues: [FaultStatus.Done, FaultStatus.Cancelled],
        fieldOptions: { isNotEqual: true },
      },
      ...variantFilters
        .filter((f) => f.fieldKey !== "others")
        .map(
          (filter) =>
            ({
              fieldKey: filter.fieldKey,
              filterValues: [...filter.values.map((value) => value.value)],
            }) as FilterChange<GeneralDashboardTableRow>
        ),
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_EQUIPMENT}`, {
      state: {
        visibleColumns: ["expectedTime", "faultNum"],
      },
    });
  };

  const onHuliaClick = () => {
    if (!kpiData?.squadAwaitingFaultsCount) return;
    addFiltersIncludingTopView([
      {
        fieldKey: "faultStatus",
        filterValues: [FaultStatus.WaitingForSquad],
      },
    ]);
    navigate(`../${SitePaths.DASHBOARD_LIST_FAULT}`);
  };

  if (
    !selectedOrganizationalLevel ||
    !selectedOrganizationalLevel["0"].length
  ) {
    return (
      <div className="topView__emptyOrgLevelText">יש לבחור רמה ארגונית.</div>
    );
  }

  return (
    <section>
      <DashboardTitle title="מבט על" subTitle={kshirutType.label} />
      <div className="topView__buttons">
        <Button
          className="topView__filtersButton"
          onClick={handleFiltersButton}
        >
          <AddIcon sx={{ width: "1.2rem" }} />
          <span> הוספת סינון </span>
        </Button>
      </div>
      <div className="dbd-table-toolbox__filters-tags">
        <FilterList
          isEditMode={true}
          filters={selectedTopViewFilters}
          onChangeFilters={setSelectedTopViewFilters}
        />
      </div>
      {isFiltersOpen && (
        <DashboardFilters<GeneralDashboardTableRow>
          title="סננים"
          isOpen={isFiltersOpen}
          setIsOpen={setIsFiltersOpen}
          selectedFilters={selectedTopViewFilters || []}
          setSelectedFilters={setSelectedTopViewFilters}
          fields={topViewFields}
        />
      )}
      <FamiliesFilters
        selectedFilters={selectedTopViewFilters}
        setSelectedFilters={setSelectedTopViewFilters}
      />
      {!kpiData || isPending ? (
        <Loader />
      ) : (
        <div className="top-view-grid">
          <div className={`kshirut-pie-chart-and-prediction title-value-card`}>
            <DynamicKshirutChart
              equipmentsCount={kpiData.totalEquipmentsCountPie}
              kashirEquipmentsCount={kpiData.rnKashirEquipmentsCountPie}
              kshirimIn24={kpiData["24KashirEquipmentsCountPie"]}
              kshirimIn48={kpiData["48KashirEquipmentsCountPie"]}
              kshirimIn72={kpiData["72KashirEquipmentsCountPie"]}
              variants={variants}
              currVariant={currVariant}
              setCurrVariant={setCurrVariant}
              onExpectedKshirutBarClick={onExpectedKshirutBarClick}
              selectedTopViewFilters={selectedTopViewFilters}
            />
          </div>
          <TitleValueGraphCard
            title="כשירות מכפילי כח אגמיים"
            className="kshirut-agam"
            sum={kpiData.agamKshirutAmount}
            disabled={!kpiData.agamKshirutTotal}
            total={kpiData.agamKshirutTotal}
            onClick={onAgamClick}
          />
          <TitleValueGraphCard
            title="כשירות מכפילי כח לוגיסטיים"
            className="kshirut-logistic"
            sum={kpiData.logisticKshirutAmount}
            total={kpiData.logisticKshirutTotal}
            disabled={!kpiData.logisticKshirutTotal}
            onClick={onLogisticsClick}
          />
          <TitleValueArrayCard<number>
            className="zadik-in-area"
            arr={kpiData.malfunctionedEquipmentsInOurArea}
            value={(item) => item}
            disabled={!kpiData.malfunctionedEquipmentsInOurArea[0].value}
            onClick={onZadikInAreaClick}
          />
          <TitleValueArrayCard<number>
            className="zadik-in-war"
            arr={kpiData.malfunctionedEquipmentsInWar}
            value={(item) => item}
            disabled={!kpiData.malfunctionedEquipmentsInWar[0].value}
            onClick={onZadikInWarClick}
          />
          <div
            className={`kshirut-by-family title-value-card active`}
            onClick={() => navigate(`../${SitePaths.TOP_VIEW_FAMILIES}`)}
          >
            <BarGraphKshirutByFamilies
              kshirutByFamilies={kpiData.kshirutByFamily}
              minimalHierarchy={minimalFamilyHierarchy}
            />
          </div>

          <TitleValueCard
            title={`ממתינים לחוליה מטכ"לית`}
            className="fault-measure item1"
            value={kpiData.squadAwaitingEquipmentsCount.toString()}
            disabled={!kpiData.squadAwaitingFaultsCount}
            onClick={onHuliaClick}
            footer={
              <div>{kpiData.squadAwaitingFaultsCount.toString()} תקלות</div>
            }
          />
          <TitleValueCard
            title="פערי חלפים"
            className="fault-measure item2"
            disabled={!kpiData.materialsCount}
            value={kpiData.equipmentsWithMissingCount.toString()}
            onClick={onHHClick}
            footer={
              <div>
                {kpiData.materialsCount} מק"טים |{" "}
                <span style={{ color: "red" }}>
                  {" "}
                  <b> {kpiData.invalidHHsCount} חריגים </b>
                </span>
              </div>
            }
          />
          <HHTablePopUp
            closePopUp={() => setOpenHHPopUp((prev) => !prev)}
            open={openHHPopUp}
          />
          <TitleValueCard
            title="ממתינים לחילוץ"
            className="fault-measure item3"
            disabled={!kpiData.recoveryAwaitingFaultsCount}
            value={kpiData.recoveryAwaitingEquipmentsCount.toString()}
            onClick={onRecoveryClick}
            footer={<div>{kpiData.recoveryAwaitingFaultsCount} תקלות</div>}
          />
          <TitleValueCard
            title="ממתינים להובלה"
            className="fault-measure item4"
            disabled={!kpiData.transportAwaitingFaultCount}
            value={kpiData.transportAwaitingEquipmentCount.toString()}
            subText={`עבור ${kpiData.WinchRequiredEquipmentsCount} נדרש מוביל כננת`}
            onClick={onTransportClick}
            footer={<div>{kpiData.transportAwaitingFaultCount} תקלות</div>}
          />
          <TitleValueArrayCard<number>
            className="fault-measure grinding"
            arr={[
              {
                title: "שחיקה",
                value: kpiData.grindEquipmentsCount,
                valueDesc: "כלים",
                subtitle: `${kpiData.grindFaultsCount} תקלות`,
              },
              {
                title: "שחיקה טכנית",
                value: kpiData.technicalGrinds,
              },
              {
                title: `שחיקה מבצעית`,
                value: kpiData.operationalGrinds,
              },
            ]}
            value={(item) => item}
            disabled={!(kpiData.technicalGrinds + kpiData.operationalGrinds)}
            onClick={onGrindClick}
          />
        </div>
      )}
    </section>
  );
};
export default TopView;
