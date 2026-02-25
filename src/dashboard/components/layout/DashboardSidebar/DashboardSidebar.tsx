import EditIcon from "@assets/dashboard/edit.svg";
import TopViewIcon from "@assets/dashboard/label.svg";
import FaultListIcon from "@assets/dashboard/note.svg";
import EquipmentListIcon from "@assets/dashboard/track.svg";
import questionIcon from "@assets/shared/questionCircle.svg";
import {
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import {
  DASHBOARD_PREFIX,
  REPORT_PREFIX,
} from "../../../../router/router.constant";
import { SitePaths } from "../../../../router/routes";
import Contact from "../../../../shared/components/Contact/Contact";
import { useCurrentPath } from "../../../../shared/hooks/useCurrentPath";
import { trackPageView } from "../../../../shared/utils/matomo.utils";
import { useAlertifyBeforeNavigateCustomScreen } from "../../../hooks/useAlertifyBeforeNavigateCustomScreen";
import {
  generalFiltersState,
  topViewFiltersState,
} from "../../../stores/DashFilters.store";
import { triggerReloadState } from "../../../stores/triggerReload.store";
import ScreensList from "../ScreensList/ScreensList";
import "./DashboardSidebar.scss";
import ShaharLogo from "@assets/shared/shaharLogo.svg";
import BinaLogo from "@assets/shared/binaLogo.png"
import TikshuvLogo from "@assets/shared/tikshuvLogo.png"
import ConcatPopover from "../../../../shared/components/Contact/ConcatPopover";
import { useAdvancedSearch } from "../../../hooks/useAdvancedSearch";
import { SearchFields } from "../../../types/advancedSearch.type";
import { catalogSearchAtom, INITIAL_SEARCH_FEILDS } from "../../../stores/catalogSearch.store";

type NavButton = {
  key: SitePaths;
  text: string;
  iconSrc: string;
  prefix: string;
  reloadData?: boolean;
};

const navButtons: NavButton[] = [
  {
    key: SitePaths.TOP_VIEW,
    text: "מבט על",
    iconSrc: TopViewIcon,
    prefix: DASHBOARD_PREFIX,
    reloadData: true,
  },
  {
    key: SitePaths.DASHBOARD_LIST_EQUIPMENT,
    text: "רשימת כלים",
    iconSrc: EquipmentListIcon,
    prefix: DASHBOARD_PREFIX,
  },
  {
    key: SitePaths.DASHBOARD_LIST_FAULT,
    text: "רשימת תקלות",
    iconSrc: FaultListIcon,
    prefix: DASHBOARD_PREFIX,
  },
  {
    key: SitePaths.WELCOME,
    text: "דיווח כשירות",
    iconSrc: EditIcon,
    prefix: REPORT_PREFIX,
  },
];

const DashboardSidebar: React.FC<PropsWithChildren> = () => {
  const navigate = useNavigate();
  const currentPath = useCurrentPath();
  const setTriggerReload = useSetRecoilState(triggerReloadState);
  const [selectedDbdFilters, setSelectedDbdFilters] =
    useRecoilState(generalFiltersState);
  const { navigateFromCustomScreen } = useAlertifyBeforeNavigateCustomScreen();
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [selectedTopViewFilters, setSelectedTopViewFilters] =
    useRecoilState(topViewFiltersState);
  const setSearchFields = useSetRecoilState<SearchFields>(catalogSearchAtom);
  const {
    handleReset,
  } = useAdvancedSearch();
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const handleNavigate = useCallback(
    (navButton: NavButton) => {
      navButton.reloadData && setTriggerReload((prev) => !prev);
      if (navButton.key === SitePaths.TOP_VIEW) {
        setSelectedDbdFilters([]);
        setSelectedTopViewFilters([]);
      }
      if (
        (navButton.key === SitePaths.DASHBOARD_LIST_EQUIPMENT ||
          navButton.key === SitePaths.DASHBOARD_LIST_FAULT) &&
        !selectedDbdFilters.length
      ) {
        setSelectedDbdFilters(selectedTopViewFilters);
      }

      const path = `../${navButton.prefix}/${navButton.key}`;
      navButton.prefix === DASHBOARD_PREFIX
        ? navigate(path)
        : window.open("#", "_blank");
    },
    [navButtons, selectedDbdFilters, selectedTopViewFilters]
  );

  useEffect(() => {
    trackPageView("/#.kingdom", "kingdom");
  }, []);

  return (
    <div className="DashboardSidebar">
      <div className="DashboardSidebar__headline">
        <div className="DashboardSidebar__headline-header">
          {/* <img src={KingdomLogo} className="DashboardSidebar__headline-logo" /> */}
          {/* <h2 className="DashboardSidebar__headline-name">ממלכה</h2> */}
          <h2
            className="DashboardSidebar__headline-name"
            onClick={() =>
              navigate(`../${DASHBOARD_PREFIX}/${SitePaths.TOP_VIEW}`)
            }
          >
            מערכת מרכזת למעקב <br /> כשירות הטנ"א
          </h2>
        </div>
        {/* <div className="DashboardSidebar__headline-desc">מערכת לכשירות</div> */}
      </div>
      <div className="DashboardSidebar__pages">
        {navButtons.map((navButton) => {
          return (
            <button
              key={navButton.key}
              className={`DashboardSidebar__pages--navButton ${currentPath
                .toLocaleLowerCase()
                .includes(navButton.key.toLocaleLowerCase()) ||
                (currentPath === "" && navButton.key === SitePaths.TOP_VIEW)
                ? "clicked"
                : ""
                }`}
              onClick={() =>
                navigateFromCustomScreen(() => handleNavigate(navButton))
              }
            >
              <img
                className="DashboardSidebar__pages--icon"
                src={navButton.iconSrc}
              />
              <span>{navButton.text}</span>
            </button>
          );
        })}
        <Suspense fallback={<span>...</span>}>
          <ScreensList />
        </Suspense>
        <span
          className="DashboardSidebar__pages--navButton screen-catalog"
          onClick={() => {
            setSearchFields({ ...INITIAL_SEARCH_FEILDS })
            handleReset()
            navigate(`../${DASHBOARD_PREFIX}/${SitePaths.SCREEN_CATALOG}`)
          }}
        >לקטלוג המסכים</span>
      </div>

      <div className="DashboardSidebar__variants"></div>
      <div className="DashboardSidebar__bottom">
        <div className="button-wrapper">
          <div className="DashboardSidebar__contact--container">
            <img
              src={questionIcon}
              className="DashboardSidebar__contact--container--question-icon"
            />
            <p
              className="DashboardSidebar__contact--container--link"
              onClick={() => setOpenContact(true)}
            >
              לפניות ושאלות לחץ כאן
            </p>
          </div>
          {openContact && <ConcatPopover open={openContact} position="top" anchorRef={buttonRef}>
            <Contact opened={openContact} setOpen={setOpenContact} />
          </ConcatPopover>}
        </div>

        <div className="DashboardSidebar__credit">
          פותח ע"י יחידת שחר

          <div className="DashboardSidebar__credit-logos">
            <img src={ShaharLogo} className="DashboardSidebar__credit-logo" />
            <img src={BinaLogo} className="DashboardSidebar__credit-logo" />
            <img src={TikshuvLogo} className="DashboardSidebar__credit-logo" />
          </div>
        </div>
      </div>
    </div>

  );
};

export default DashboardSidebar;
