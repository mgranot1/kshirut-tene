import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import { SitePaths } from "../../../router/routes";

import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { Qualification } from "../../../shared/types/kshirutData.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { ZADIK_DATA_SESSION_KEY } from "../../../shared/utils/constants";
import { getLastChangeMessage } from "../../../shared/utils/lastChange.util";
import "./ZadikRowCard.scss";

interface IZadikRowCardProps {
  zadik: IZadikData;
}

const ZadikRowCard = (props: IZadikRowCardProps) => {
  const [_, setSelectedZadik] = useSessionStorage<IZadikData>(
    ZADIK_DATA_SESSION_KEY
  );
  const navigate = useNavigate();
  const openFaultsExists = props.zadik.openFaults !== 0;

  const qualChip = (className: string, text: string) => {
    return (
      <div className="ZadikRowCard__qual">
        <div className={`ZadikRowCard__qual-dot ${className}`}></div>
        <span className="ZadikRowCard__qual-text">{text}</span>
      </div>
    );
  };

  const chips = (
    <>
      {qualChip(Qualification[props.zadik.warKshirut]?.class, "כשירות מלחמה")}
      {qualChip(Qualification[props.zadik.kshirut]?.class, "כשירות שגרה")}
    </>
  );

  return (
    <div className="ZadikRowCard__card">
      <div
        className="ZadikRowCard__text"
        onClick={() => {
          navigate(`../${SitePaths.KSHIRUT_REPORT}/${props.zadik.equipment}`)
        }}
      >
        {!!props.zadik.lastUpdateTimestamp && (
          <span className="ZadikRowCard__last-update">
            {getLastChangeMessage(props.zadik.lastUpdateTimestamp)}
          </span>
        )}
        <span className="ZadikRowCard__zadik">צ' {props.zadik.equipment}</span>
        <span className="ZadikRowCard__desc">{props.zadik.equnrDesc}</span>

        <span className="ZadikRowCard__desc">
          {props.zadik.mainPlatformDesc} | {props.zadik.secPlatformDesc}
        </span>
        <span className="ZadikRowCard__desc">
          {`${[props.zadik.maamadDesc, props.zadik.purposeDesc].join(
            props.zadik.maamadDesc && props.zadik.purposeDesc ? " | " : ""
          )}`}
        </span>
        <div className="ZadikRowCard__qualifition">{chips}</div>
      </div>
      {openFaultsExists && (
        <span
          className="ZadikRowCard__faults"
          onClick={() => {
            navigate(`../${SitePaths.FAULT_LIST}/${props.zadik.equipment}`, {
              state: {
                fetchOnlyOpenFaults: true,
              },
            });
          }}
        >
          <KeyboardArrowLeft className="ZadikRowCard__arrow" />
          {`${props.zadik.openFaults} תקלות פתוחות`}
        </span>
      )}
    </div>
  );
};

export default ZadikRowCard;
