import BackIcon from "@assets/report/backIcon.svg";
import { ReactNode } from "react";
import GeneralButton from "../../../shared/components/GeneralButton/GeneralButton";
import PageLayout from "../layout/PageLayout/PageLayout";

type HhEmzLayoutProps = {
  pageIsReadOnly: boolean;
  children: ReactNode;
  faultNum: string;
  navToFault: () => void;
  saveData: () => Promise<void>;
  dataChanged: boolean;
};

function HhEmzLayout(props: HhEmzLayoutProps) {
  return (
    <PageLayout
      title="אמצעים וחלקי חילוף"
      subTitle={`תקלה ${props.faultNum}`}
      backButton={{
        button: <img className="headerButton" src={BackIcon} />,
        function: props.navToFault,
      }}
      footerElement={
        <GeneralButton
          disabled={!props.pageIsReadOnly && !props.dataChanged}
          text={props.pageIsReadOnly ? "חזור" : "שמור"}
          onClick={props.pageIsReadOnly ? props.navToFault : props.saveData}
        />
      }
    >
      {props.children}
    </PageLayout>
  );
}

export default HhEmzLayout;
