import { NavigateFunction, useNavigate } from "react-router-dom";
import { ButtonAction, useAlertify } from "../../contexts/AlertContext";
import { SitePaths } from "../../router/routes";

export type Texts = {
  message?: string;
  cancel?: string;
  continue?: string;
  Ok?: string;
};

interface UseFormNavProps {
  canSave: boolean;
  canOk?: boolean;
  fieldsChanged: boolean;
  disableCloseButton?: boolean;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  alternativeTexts?: Texts;
  backOptions?: { path?: string } ;
}

const useFormNav = ({
  canSave,
  canOk,
  fieldsChanged,
  onSave,
  alternativeTexts,
  disableCloseButton,
  backOptions,
}: UseFormNavProps) => {
  const navigate: NavigateFunction = useNavigate();
  const { alertify } = useAlertify();

  const alertBeforeNav = (navigateFunc: () => void) => {
    const buttons: ButtonAction[] = [];

    buttons.push({
      text: alternativeTexts?.cancel || "צא ללא שמירה",
      onClick: () => {
        navigateFunc();
      },
      variant: "outlined",
    });

    canSave &&
      buttons.push({
        text: alternativeTexts?.continue || "שמור",
        onClick: () => {
          onSave().then(() => {
            navigateFunc();
          });
        },
        variant: "contained",
      });

    canOk &&
      buttons.push({
        text: alternativeTexts?.Ok || "אישור",
        onClick: () => {
          //close popup
        },
        variant: "contained",
      });

    alertify({
      messageType: "Unknown",
      msgContent: {
        message:
          alternativeTexts?.message ||
          "שונו נתונים במסך, האם ברצונך לצאת ללא שמירה?",
      },
      buttons,
      closeButton: {
        disableCloseButton: disableCloseButton || false,
        clickOutsideClose: false,
      },
    });
  };

  const nav = (to: any, state?: any) => {
    if (!canSave || fieldsChanged) {
      alertBeforeNav(() => navigate(to));
      return;
    }

    navigate(to, { state });
  };

  const goTo = (path: SitePaths | string, state?: any) => nav(`../${path}`, state);

  const goBack = () => {
    if (!backOptions?.path) nav(-1);
    else nav(backOptions?.path);
  };

  return { goTo, goBack, nav };
};

export default useFormNav;
