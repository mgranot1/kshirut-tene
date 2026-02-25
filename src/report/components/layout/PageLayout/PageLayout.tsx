import { HTMLAttributes, PropsWithChildren } from "react";
import Footer from "../Footer/Footer";
import Header, { IHeaderButton } from "../Header/Header";
import "./Home.scss";
import "./PageLayout.scss";
import ShaharLogo from "@assets/shared/shaharLogo.svg";
import BinaLogo from "@assets/shared/binaLogo.png"
import TikshuvLogo from "@assets/shared/tikshuvLogo.png"

interface IProps {
  title: string;
  subTitle?: string;
  backButton?: IHeaderButton;
  leftButton?: JSX.Element;
  navButton?: JSX.Element;
  footerElement?: JSX.Element;
  gridProps?: HTMLAttributes<HTMLDivElement>;
}
const PageLayout: React.FC<PropsWithChildren<IProps>> = (props) => {
  return (
    <>
    <div {...props.gridProps} className="PageLayout">
      <Header
        title={props.title}
        navButton={props.navButton}
        backButton={props.backButton}
        leftButton={props.leftButton}
        subTitle={props.subTitle}
      />
      <div
        id="page"
        className="PageLayout__grid"
        has-footer={props.footerElement ? "true" : "false"}
      >
        <div className="PageLayout__children">{props.children}</div>
      </div>
      {props.footerElement && <Footer content={props.footerElement} />}
    </div>
    <div className="credit">
        פותח ע"י יחידת שחר

        <div className="credit-logos">
          <img src={ShaharLogo} className="logo" />
          <img src={BinaLogo} className="logo" />
          <img src={TikshuvLogo} className="logo" />
        </div>
      </div>
    </>
  );
};

export default PageLayout;
