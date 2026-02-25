import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

export enum SitePaths {
  HOME = "home",
  FAMILY = "family",
  KSHIRUT_REPORT = "kshirut",
  FAULT_REPORT = "fault",
  FAULT_LIST = "faultList",
  WELCOME = "welcome",
  GDUD_METAMREN = "timrun",
  ORG_LEVEL = "level",
  ORG_LEVEL_SELECT = "level/select",
  ALL = "*",
  EMPTY = "",
  CHAT = "chat",
  FAULT_HH_EMZ = "faultHhEmz",
  PAGE_NOT_FOUND = "pageNotFound",

  // dashboard routes
  TOP_VIEW = "topView",
  TOP_VIEW_FAMILIES = "topViewFamilies/",
  DASHBOARD_LIST_FAULT = "dbFaultList",
  DASHBOARD_LIST_EQUIPMENT = "dbEquipmentList",
  CUSTOM_SCREEN = "customScreen",
  DRILL_DOWN_SCREEN = "component",
  SCREEN_CATALOG = "catalog"
}

// Record<keyof typeof SitePaths, string>
export const FullPaths = {
  HOME: SitePaths.HOME,
  FAMILY: `${SitePaths.FAMILY}/:familyCode`,
  KSHIRUT_REPORT: `${SitePaths.KSHIRUT_REPORT}/:zadikId`,
  FAULT_LIST: `${SitePaths.FAULT_LIST}/:zadikId`,
  // Fault Report's URLParameters will be accessed through JS's default URL handling and not react-router-dom
  FAULT_REPORT: SitePaths.FAULT_REPORT,
  WELCOME: SitePaths.WELCOME,
  GDUD_METAMREN: SitePaths.GDUD_METAMREN,
  ORG_LEVEL: SitePaths.ORG_LEVEL,
  ORG_LEVEL_SELECT: `${SitePaths.ORG_LEVEL_SELECT}`,
  ALL: SitePaths.ALL,
  EMPTY: SitePaths.EMPTY,
  CHAT: `${SitePaths.CHAT}/:faultId`,
  FAULT_HH_EMZ: `${SitePaths.FAULT_HH_EMZ}/:faultId`,
  PAGE_NOT_FOUND: SitePaths.PAGE_NOT_FOUND,

  // dashboard routes
  TOP_VIEW: SitePaths.TOP_VIEW,
  TOP_VIEW_FAMILIES: `${SitePaths.TOP_VIEW_FAMILIES}/`,
  DASHBOARD_LIST_FAULT: SitePaths.DASHBOARD_LIST_FAULT,
  DASHBOARD_LIST_EQUIPMENT: SitePaths.DASHBOARD_LIST_EQUIPMENT,
  CUSTOM_SCREEN: `${SitePaths.CUSTOM_SCREEN}/:id`,
  DRILL_DOWN_SCREEN: `${SitePaths.DRILL_DOWN_SCREEN}/:id`,
  SCREEN_CATALOG: SitePaths.SCREEN_CATALOG
} as const;

export type SiteRouteObject = RouteObject & {
  path: string;
  action?: () => void;
};

const ReportFault = lazy(
  () => import("../report/pages/ReportFault/FaultReport")
);
const KshirutReport = lazy(
  () => import("../report/pages//KshirutReport/KshirutReport")
);
const OrgLevel = lazy(() => import("../report/pages/OrgLevel/OrgLevel"));
const OrgLevelSelect = lazy(
  () => import("../report/pages//OrgLevelSelect/OrgLevelSelect")
);
const GdudMetamren = lazy(
  () => import("../report/pages//GdudMetamren/GdudMetamren")
);
const Chat = lazy(() => import("../report/pages/Chat/Chat"));
const Welcome = lazy(() => import("../report/pages//Welcome/Welcome"));
const FaultList = lazy(() => import("../report/pages/FaultList/FaultList"));
const FamiliesList = lazy(
  () => import("../report/pages/FamiliesList/FamiliesList")
);
const PageNotFound = lazy(
  () => import("../shared/pages/PageNotFound/PageNotFound")
);
const FaultHhEmz = lazy(() => import("../report/pages/FaultHhEmz/FaultHhEmz"));
const FamilyEquipmentsList = lazy(
  () => import("../report/pages/FamilyEquipments/FamilyEquipmentsList")
);

const DashboardFaultList = lazy(
  () => import("../dashboard/pages/DbFaultListPage/DbFaultList")
);
const DashboardEquipmentList = lazy(
  () => import("../dashboard/pages/DbEquipmentListPage/DbEquipmentList")
);

const TopView = lazy(() => import("../dashboard/pages/TopViewPage/TopView"));
const TopViewFamilies = lazy(
  () => import("../dashboard/pages/TopViewFamiliesPage/TopViewFamilies")
);
const CustomScreen = lazy(
  () => import("../dashboard/pages/CustomScreen/CustomScreen")
);
const DrillDownScreen = lazy(
  () => import("../dashboard/pages/DrillDownScreen/DrillDownScreen")
);
const ScreenCatalog = lazy(
  () => import("../dashboard/pages/ScreenCatalog/ScreenCatalog")
);

export const REPORT_ROUTES: SiteRouteObject[] = [
  {
    path: FullPaths.HOME,
    element: <FamiliesList />,
  },
  {
    path: FullPaths.FAMILY,
    element: <FamilyEquipmentsList />,
  },
  {
    path: FullPaths.KSHIRUT_REPORT,
    element: <KshirutReport />,
  },
  {
    path: FullPaths.FAULT_REPORT,
    element: <ReportFault />,
  },
  {
    path: FullPaths.ORG_LEVEL,
    element: <OrgLevel />,
  },
  {
    path: FullPaths.ORG_LEVEL_SELECT,
    element: <OrgLevelSelect />,
  },
  {
    path: FullPaths.GDUD_METAMREN,
    element: <GdudMetamren />,
  },
  {
    path: FullPaths.WELCOME,
    element: <Welcome />,
  },
  {
    path: FullPaths.FAULT_LIST,
    element: <FaultList />,
  },
  {
    path: FullPaths.CHAT,
    element: <Chat />,
  },
  {
    path: FullPaths.EMPTY,
    element: <Navigate to={FullPaths.WELCOME} />,
  },
  {
    path: FullPaths.FAULT_HH_EMZ,
    element: <FaultHhEmz />,
  },
  {
    path: FullPaths.ALL,
    element: <PageNotFound />,
  },
];

export const GENERAL_ROUTES: SiteRouteObject[] = [
  {
    path: SitePaths.EMPTY,
    element: <Navigate to={`king/${SitePaths.WELCOME}`} />,
  },
  {
    path: SitePaths.ALL,
    element: <h1>general path doesn't exist</h1>,
  },
];

export const DASHBOARD_ROUTES: SiteRouteObject[] = [
  {
    path: SitePaths.DASHBOARD_LIST_EQUIPMENT,
    element: <DashboardEquipmentList />,
  },
  {
    path: SitePaths.DASHBOARD_LIST_FAULT,
    element: <DashboardFaultList />,
  },

  {
    path: SitePaths.TOP_VIEW_FAMILIES,
    element: <TopViewFamilies />,
  },
  {
    path: SitePaths.EMPTY,
    element: <Navigate to={SitePaths.TOP_VIEW} />,
  },
  {
    path: SitePaths.TOP_VIEW,
    element: <TopView />,
  },
  {
    path: FullPaths.CUSTOM_SCREEN,
    element: <CustomScreen />,
  },
  {
    path: `${FullPaths.CUSTOM_SCREEN}/${FullPaths.DRILL_DOWN_SCREEN}`,
    element: <DrillDownScreen />,
  },
   {
    path: `${FullPaths.SCREEN_CATALOG}`,
    element: <ScreenCatalog />,
  },
  {
    path: SitePaths.ALL,
    element: <PageNotFound dashboard />,
  },
];
