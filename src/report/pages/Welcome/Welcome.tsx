import vehichel1 from "@assets/report/vehichel1.svg";
import vehichel2 from "@assets/report/vehichel2.svg";
import vehichel3 from "@assets/report/vehichel3.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SitePaths } from "../../../router/routes";
import GeneralButton from "../../../shared/components/GeneralButton/GeneralButton";
import { useUserUnit } from "../../hooks/useUserUnit";
import "./Welcome.scss";

const Welcome = () => {
  const navigate = useNavigate();
  const [userUnit, _] = useUserUnit();

  useEffect(() => {
    !!userUnit.routineLevel ||
    !!userUnit.emergencyLevel ||
    (!!userUnit.objid && +userUnit.objid !== 0)
      ? navigate(`../${SitePaths.HOME}`)
      : navigate(`../${SitePaths.WELCOME}`);
    }, []);

  return (
    <div className="welcome">
      <div className="welcome__header">
        <img src={vehichel1} className="welcome__vehichel1" />
        <img src={vehichel2} className="welcome__vehichel2" />
        <img src={vehichel3} className="welcome__vehichel3" />
      </div>
      <div className="welcome__content">
        <div className="welcome__text">
          <p className="welcome__title">ברוכים הבאים!</p>
          <p className="welcome__subTitle">
            ניהול הכלים וכשירותם במקום אחד, ניתן לדווח כשירות כלים לכלים ותקלות.
          </p>
        </div>
      </div>
      <div className="welcome__button">
        <GeneralButton
          text="יאללה! בואו נתחיל"
          onClick={() => navigate(`../${SitePaths.ORG_LEVEL}`)}
        />
      </div>
    </div>
  );
};
export default Welcome;
