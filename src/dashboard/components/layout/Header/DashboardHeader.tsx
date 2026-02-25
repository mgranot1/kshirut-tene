import { PropsWithChildren, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useUserUnit } from "../../../../report/hooks/useUserUnit";
import { SitePaths } from "../../../../router/routes";
import KshirutTypeDropDown from "../../../../shared/components/KshirutTypeDropDown/KshirutTypeDropDown";
import { useCurrentPath } from "../../../../shared/hooks/useCurrentPath";
import useGetScreens from "../../../services/screen/useGetScreens";
import { AdvancedScreenSearch } from "../../AdvancedScreenSearch/AdvancedScreenSearch";
import OrgLevelBreadcrumbs from "../../OrgLevelBreadcrumbs/OrgLevelBreadcrumbs";
import ActionButtons from "../ActionButtons/ActionButtons";
import "./DashboardHeader.scss";

const DashboardHeader: React.FC<PropsWithChildren> = () => {
  const location = useLocation();
  const path = location.pathname;
  const currentScreenId = useCurrentPath();
  const [userUnit] = useUserUnit();
  const { data: screens } = useGetScreens();

  const isCurrentScreenBelongToMe =
    screens?.find((screen) => screen.id === currentScreenId)?.creator ===
    userUnit.username;

  const getHeaderComponentByPath = (): JSX.Element => {
    if (
      !path.includes(SitePaths.CUSTOM_SCREEN) &&
      !path.includes(SitePaths.DRILL_DOWN_SCREEN) &&
      !path.includes(SitePaths.SCREEN_CATALOG)
    )
      return <OrgLevelBreadcrumbs />;

    if (path.includes(SitePaths.DRILL_DOWN_SCREEN)) return <div></div>;
    if (path.includes(SitePaths.SCREEN_CATALOG)) {
      return <AdvancedScreenSearch />;
    }

    // Allow editing only on my screens
    if (path.includes(SitePaths.CUSTOM_SCREEN) && isCurrentScreenBelongToMe)
      return (
        <Suspense fallback={<span></span>}>
          <ActionButtons />
        </Suspense>
      );

    return <div></div>;
  };

  return (
    <div className="DashboardHeader">
      {getHeaderComponentByPath()}
      {!path.includes(SitePaths.SCREEN_CATALOG) && <KshirutTypeDropDown />}
    </div>
  );
};

export default DashboardHeader;
