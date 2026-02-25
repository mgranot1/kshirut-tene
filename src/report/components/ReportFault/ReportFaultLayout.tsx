import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import backButton from "../../../assets/report/backButton.png";
import chatIcon from "../../../assets/report/chatIcon.png";
import closeButton from "../../../assets/report/closeButton.png";
import GeneralButton from "../../../shared/components/GeneralButton/GeneralButton";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { ZADIK_DATA_SESSION_KEY } from "../../../shared/utils/constants";
import PageLayout from "../layout/PageLayout/PageLayout";

type ReportFaultLayoutProps = {
  isNewFault: boolean;
  faultNum: string;
  faultStatus: string;
  equipment: string;
  goBack: () => void;
  goToChat: (faultNum: string) => void;
  children: ReactNode;
};

export default function ReportFaultLayout(props: ReportFaultLayoutProps) {
  const location = useLocation();
 
  return (
    <PageLayout
      title={props.isNewFault ? "דיווח תקלה" : `תקלה ${props.faultNum}`}
      subTitle={`צ' ${props.equipment}`}
      backButton={
        !props.isNewFault && location.key !== "default"
          ? {
              button: <img className="headerButton" src={backButton} />,
              function: props.goBack,
            }
          : undefined
      }
      leftButton={
        props.isNewFault ? (
          <img
            className="headerButton"
            src={closeButton}
            onClick={props.goBack}
          />
        ) : undefined
      }
      footerElement={
        <div className="reportFault__footerContainer">
          {props.faultNum && (
            <button
              onClick={() => props.goToChat(props.faultNum)}
              className="reportFault__chatButton"
            >
              <img className="reportFault__chatIcon" src={chatIcon}></img>
            </button>
          )}
          <GeneralButton text="סיום דיווח" form="faultForm" />
        </div>
      }
    >
      {props.children}
    </PageLayout>
  );
}
