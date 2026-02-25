import { useEffect } from "react";
import { useAlertify } from "../../../contexts/AlertContext";
import {
  DASHBOARD_PREFIX,
  REPORT_PREFIX,
} from "../../../router/router.constant";
import { SitePaths } from "../../../router/routes";

interface SessionEndedAlertProps {}

const SessionEndedAlert = (props: SessionEndedAlertProps) => {
  const { alertify } = useAlertify();

  const goToLogin = () => {
    const currentLocation = window.location.href;
    window.location.href = `${import.meta.env.VITE_APP_BASE_URL}/auth8/login?redirectUri=${currentLocation}`;
  };

  useEffect(() => {
    const handleSessionEnded = () => {
      if (
        [
          "",
          "/",
          `/#/${REPORT_PREFIX}`,
          `/#/${REPORT_PREFIX}/${SitePaths.WELCOME}`,
          `/#/${REPORT_PREFIX}/${SitePaths.HOME}`,
          `/#/${DASHBOARD_PREFIX}`,
          `/#/${DASHBOARD_PREFIX}/${SitePaths.TOP_VIEW}`,
          `/#/${DASHBOARD_PREFIX}/${SitePaths.DASHBOARD_LIST_EQUIPMENT}`,
          `/#/${DASHBOARD_PREFIX}/${SitePaths.DASHBOARD_LIST_FAULT}`,
        ].includes(window.location.hash)
      ) {
        goToLogin();
        return;
      }

      alertify({
        closeButton: { disableCloseButton: true },
        messageType: "Error",
        msgContent: { message: "תוקף ההתחברות פג, נא להתחבר מחדש" },
        buttons: [
          {
            text: " התחברות מחדש ",
            variant: "contained",
            onClick: goToLogin,
          },
        ],
      });
    };

    window.addEventListener("sessionEnded", handleSessionEnded);

    return () => {
      window.removeEventListener("sessionEnded", handleSessionEnded);
    };
  }, []);

  return <></>;
};

export default SessionEndedAlert;
