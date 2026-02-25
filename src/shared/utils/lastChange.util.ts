import { format, utcToZonedTime } from "date-fns-tz";
import moment from "moment";
import "moment/dist/locale/he";
import { abs } from "stylis";

export const adjustLocalTimezoneToDB = () => {
  return new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  );
};
export const getLastChangeMessage = (currDate: Date) => {
  moment.locale("he");
  const currentdateToUse = moment(convertToTimestamp(currDate));
  const today = new Date();
  const dur = moment.duration({ from: today, to: currentdateToUse });

  if (currentdateToUse.year() !== today.getFullYear()) {
    return currentdateToUse.toDate().toLocaleString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  if (abs(dur.asDays()) >= 7) {
    return currentdateToUse.toDate().toLocaleString("he-IL", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (abs(dur.asDays()) < 1) {
    return currentdateToUse.fromNow(true);
  } else {
    return Math.floor(abs(dur.asDays())) + " ימים";
  }
};

export const convertToTimestamp = (date: Date) => {
  return new Date(
    date
      .toString()
      .replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, "$4:$5:$6 $2/$3/$1")
  );
};
export const convertDateToTimeZonedISOString = (date: Date) => {
  const seconds = date.getSeconds() - 1;
  date.setSeconds(seconds);

  return format(
    utcToZonedTime(date, "Asia/Jerusalem"),
    "yyy-MM-dd'T'HH:mm:ssXXX",
    {
      timeZone: "Asia/Jerusalem",
    }
  );
};
