import { HashRouter, Route, Routes } from "react-router-dom";
import { useUserUnit } from "../report/hooks/useUserUnit";
import SiteLayout from "../shared/components/SiteLayout/SiteLayout";
import PageTitle from "./PageTitle";
import {
  DASHBOARD_PREFIX,
  DASHBOARD_TITLE,
  REPORT_PREFIX,
  REPORT_TITLE,
} from "./router.constant";
import {
  DASHBOARD_ROUTES,
  GENERAL_ROUTES,
  REPORT_ROUTES,
  SitePaths,
  SiteRouteObject,
} from "./routes";

const generateRoutes = (routes: SiteRouteObject[], title: string) =>
  routes.map((route) => {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <>
            <PageTitle pagetitle={title} />
            {route.element}
          </>
        }
        index={route.path === SitePaths.EMPTY}
      />
    );
  });

const RouterProvider = () => {
  const _ = useUserUnit();

  return (
    <HashRouter>
      <SiteLayout>
        <Routes>
          <Route path="/">{generateRoutes(GENERAL_ROUTES, REPORT_TITLE)}</Route>
          <Route path={REPORT_PREFIX}>
            {generateRoutes(REPORT_ROUTES, REPORT_TITLE)}
          </Route>
          <Route path={DASHBOARD_PREFIX}>
            {generateRoutes(DASHBOARD_ROUTES, DASHBOARD_TITLE)}
          </Route>
        </Routes>
      </SiteLayout>
    </HashRouter>
  );
};

export default RouterProvider;
