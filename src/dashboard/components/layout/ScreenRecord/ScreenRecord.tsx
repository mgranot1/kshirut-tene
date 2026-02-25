import { useLocation, useNavigate } from "react-router-dom";

import { useSetRecoilState } from "recoil";
import { DASHBOARD_PREFIX } from "../../../../router/router.constant";
import {
  MatomoCategory,
  matomoEvent,
} from "../../../../shared/utils/matomo.utils";
import { useAlertifyBeforeNavigateCustomScreen } from "../../../hooks/useAlertifyBeforeNavigateCustomScreen";
import { drillStackAtom } from "../../../stores/drillStack.store";
import { IScreen } from "../../../types/screen.types";
import "./ScreenRecord.scss";

interface IScreenRecordProps {
  id: IScreen["id"];
  text: IScreen["name"];
  color: IScreen["color"];
}

export const CUSTOM_SCREEN_PATH = "customScreen";

const ScreenRecord = ({ id, text, color }: IScreenRecordProps) => {
  const { navigateFromCustomScreen } = useAlertifyBeforeNavigateCustomScreen();
  const navigate = useNavigate();
  const location = useLocation();
  const setDrillStack = useSetRecoilState(drillStackAtom);

  const handleNavigate = (id: string) => {
    navigate(`../${DASHBOARD_PREFIX}/${CUSTOM_SCREEN_PATH}/${id}`);
  };

  return (
    <div
      className={`ScreenRecord ${location.pathname.includes(id) ? "clicked" : ""}`}
      onClick={() => {
        matomoEvent("view custom screen", MatomoCategory.VIEW, text, 0);
        setDrillStack([]);
        navigateFromCustomScreen(() => handleNavigate(id));
      }}
    >
      <div
        className="ScreenRecord__square"
        style={{ backgroundColor: `${color}` }}
      ></div>
      <span className="ScreenRecord__text">{text}</span>
    </div>
  );
};

export default ScreenRecord;
