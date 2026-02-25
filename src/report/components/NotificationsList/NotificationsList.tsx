import { useNavigate } from "react-router-dom";
import { SitePaths } from "../../../router/routes";
import DropDown from "../../../shared/components/DropDown/DropDown";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { IDropDownOption } from "../../../shared/types/general.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { FAULT_DATA_SESSION_KEY } from "../../../shared/utils/constants";
import { FaultStorage } from "../../pages/ReportFault/ReportFault";
import { useUpdateView } from "../../services/view/useUpdateView";
import { useGetZadikData } from "../../services/zadikData/useGetZadikData";
import { ILog, LogTypes } from "../../types/log.types";
import Notification from "./Notification";

interface INotificationsListProps {
  setLogList: React.Dispatch<React.SetStateAction<ILog[]>>;
  logList: ILog[];
  setOpenNotif: (openNotif: any) => any;
}

const NotificationsList = ({
  setLogList,
  logList,
  setOpenNotif,
}: INotificationsListProps) => {
  const navigate = useNavigate();
  const [faultStorage, setFaultStorage] = useSessionStorage<FaultStorage>(
    FAULT_DATA_SESSION_KEY
  );

  const onSuccessGetZadikData = (zadikData: IZadikData) => {
    navigate(`../${SitePaths.KSHIRUT_REPORT}/${zadikData.equipment}`);
  };
  const { mutate: mutateGetZadikData } = useGetZadikData({
    onSuccess: onSuccessGetZadikData,
  });

  const { mutate: mutateUpdateGdudView } = useUpdateView(LogTypes.Gdud);

  const hadleNotifClick = (log: ILog) => {
    if (log.logType === LogTypes.Zadik) {
      mutateGetZadikData({ equipment: log.logTypeKey });
    } else if (log.logType === LogTypes.Gdud) {
      mutateUpdateGdudView({ logTypeKey: log.logTypeKey });

      setLogList((prev) =>
        prev.map((l: ILog) =>
          l.logType === log.logType && l.logTypeKey === log.logTypeKey
            ? ({ ...l, watchedUser: "watched" } as ILog)
            : l
        )
      );
      setOpenNotif((prev) => !prev);
    } else if (
      log.logType === LogTypes.Fault ||
      log.logType === LogTypes.Chat ||
      log.logType === LogTypes.HhEmz
    ) {
      if (log.logTypeKey) {
        setFaultStorage(
          faultStorage
            ? { ...faultStorage, faultNum: log.logTypeKey }
            : undefined
        );
        navigate(
          `../${SitePaths.FAULT_REPORT}?faultId=${log.logTypeKey.replace(/^0+/, "")}`
        );
      }
    }
  };

  return (
    <>
      <DropDown
        open
        title="התראות"
        optionList={logList.map((log) => {
          return {
            label: <Notification log={log} />,
            value: log,
          } as IDropDownOption;
        })}
        setOpen={setOpenNotif}
        onSelect={(i) => hadleNotifClick(i.value as ILog)}
        presentSearch={false}
      />
    </>
  );
};

export default NotificationsList;
