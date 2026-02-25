import React, { ReactNode } from "react";
import BackIcon from "../../../assets/report/backIcon.svg";
import GeneralLayout from "../../shared/GeneralLayout/GeneralLayout";
import GeneralButton from "../../shared/GeneralButton";

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
    <GeneralLayout
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
    </GeneralLayout>
  );
}

export default HhEmzLayout;
