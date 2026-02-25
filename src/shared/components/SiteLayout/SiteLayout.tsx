import React, { PropsWithChildren, Suspense } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../../dashboard/components/layout/DashboardLayout";
import { DASHBOARD_PREFIX } from "../../../router/router.constant";
import Loader from "../Loader/Loader";
import "./DashboardLayout.scss";

interface ILayoutProps {}

const SiteLayout = (props: PropsWithChildren<ILayoutProps>) => {
  const location = useLocation();

  const isInKingdom = React.useMemo<boolean>(
    () => location.pathname.includes(`${DASHBOARD_PREFIX}`),
    [location]
  );

  return isInKingdom ? (
    <DashboardLayout>{props.children}</DashboardLayout>
  ) : (
    <Suspense fallback={<Loader />}>{props.children}</Suspense>
  );
};

export default SiteLayout;
