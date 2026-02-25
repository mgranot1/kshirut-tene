import ReportGmailerrorIcon from "@mui/icons-material/ReportGmailerrorred";
import { ReactNode } from "react";

import { convertDateToTimeDisplay } from "../../../shared/utils/dates.utils";
import { convertToTimestamp } from "../../../shared/utils/lastChange.util";
import { GdudLog, ILog, LogTypes, ZadikLogField } from "../../types/log.types";
import "./Notification.scss";

interface Props {
  log: ILog;
}

const Notification = ({ log }: Props) => {
  let title: string | ReactNode = "";
  let description: string = "";

  switch (log.logType) {
    case LogTypes.Zadik: {
      title = `שינוי בנתוני צ' ${Number(log.logTypeKey)}`;
      description = `בוצע שינוי ב${log.field
        .split(" ,")
        .map((f) => ZadikLogField[f] + ", ")
        .join("")
        .slice(0, -2)}`;
      break;
    }
    case LogTypes.Fault: {
      title = `תקלה ${Number(log.logTypeKey)} - צ' ${Number(log.zadikNumber)}`;
      description = " נוספה תקלה חדשה / בוצע שינוי בתקלה";
      break;
    }
    case LogTypes.Gdud: {
      title = `שינוי בנתוני גדוד ${Number(log.logTypeKey)}`;
      description = `הגדרת התמרון של הגדוד שונה ל${GdudLog[log.newValue]}`;
      break;
    }
    case LogTypes.Chat: {
      title = `נוספה הודעה חדשה לתקלה ${Number(log.logTypeKey)} - צ' ${Number(log.zadikNumber)}`;
      description = "";
      break;
    }
    case LogTypes.HhEmz: {
      title = (
        <div className="notification__error">
          <ReportGmailerrorIcon /> {`בעיה בדיווח ח''ח ואמצעים`}
        </div>
      );
      description = ` תקלה ${Number(log.logTypeKey)} - צ' ${Number(log.zadikNumber)}`;
      break;
    }
  }

  return (
    <div
      className={`notification__container ${log.watchedUser ? "notification__watched" : ""}`}
    >
      <div className="notification__right">
        <p className="notification__title">{title}</p>
        <p className="notification__desc">{description}</p>
      </div>
      <div className="notification__left">
        <p>
          {convertToTimestamp(log.changeTimestamp).toLocaleDateString("en-gb")}
        </p>
        <p>
          {` ${convertDateToTimeDisplay(convertToTimestamp(log.changeTimestamp))}`}
        </p>
      </div>
    </div>
  );
};

export default Notification;
