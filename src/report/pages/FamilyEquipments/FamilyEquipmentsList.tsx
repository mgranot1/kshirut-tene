import { ReactComponent as BackIcon } from "@assets/report/back.svg";
import NotificationIcon from "@assets/report/notification.svg";
import { Badge, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SitePaths } from "../../../router/routes";
import Loader from "../../../shared/components/Loader/Loader";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { SELECTED_FILTERS_SESSION_KEY } from "../../../shared/utils/constants";
import FilterSheet, {
  emptyFilters,
  IFilters,
} from "../../components/FilterSheet/FilterSheet";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import NotificationsList from "../../components/NotificationsList/NotificationsList";
import ZadikRowCard from "../../components/ZadikRowCard/ZadikRowCard";
import ZadikSearchBar from "../../components/ZadikSearchBar/ZadikSearchBar";
import { useGetLogs } from "../../services/log/useGetLogs";
import { useGetZadiksData } from "../../services/zadikData/useGetZadiksData";
import { ILog } from "../../types/log.types";
import { getFilteredZadiks } from "../../utils/filterZadiks.util";
import "./FamilyEquipmentsList.scss";

export type PageParams = Record<"familyCode", string>;
const FamilyEquipmentsList = () => {
  const navigate = useNavigate();
  const { familyCode } = useParams<PageParams>() as PageParams;
  const [openFilters, setOpenFilters] = useState<boolean>(false);

  const [openNotif, setOPenNotif] = useState(false);
  const [selectedFilters, setSelectedFilters] = useSessionStorage<IFilters>(
    SELECTED_FILTERS_SESSION_KEY
  );

  const {
    data: logsData,
    refetch: refetchLog,
    isLoading: isLoadingLogs,
    isSuccess: isSuccessLogs,
  } = useGetLogs();

  const {
    data: zadiksData,
    refetch: refetchZadiksData,
    isLoading: isGetZadiksDataLoading,
  } = useGetZadiksData();

  const [logList, setLogList] = useState<ILog[]>([]);

  useEffect(() => {
    if (logsData && isSuccessLogs) {
      setLogList(logsData);
    }
  }, [logsData]);

  //todo: replace with getZadiksDataByFamily after its implamentation

  const filteredZadiks = useMemo(() => {
    if (zadiksData && selectedFilters) {
      return getFilteredZadiks(zadiksData, selectedFilters).filter(
        (z) => z.materialFamily === familyCode
      );
    } else {
      return zadiksData;
    }
  }, [selectedFilters, zadiksData]);

  const familyDesc: string = useMemo(() => {
    const aZadikInTheFamily = (zadiksData ?? []).find(
      (zadik) => zadik.materialFamily === familyCode
    );
    return aZadikInTheFamily?.familyCodeDesc ?? "משפחה";
  }, [zadiksData]);

  useEffect(() => {
    const preparePage = () => {
      if (!zadiksData) {
        refetchZadiksData();
      }

      if (!selectedFilters) {
        setSelectedFilters(emptyFilters);
      }
    };
    preparePage();
  }, []);

  return (
    <>
      {isGetZadiksDataLoading && <Loader />}

      {openNotif && (
        <NotificationsList
          logList={logList}
          setLogList={setLogList}
          setOpenNotif={setOPenNotif}
        />
      )}

      <PageLayout
        title={familyDesc}
        backButton={{
          button: <BackIcon />,
          function: () => {
            setOpenFilters(true);
            navigate(`../${SitePaths.HOME}`);
          },
        }}
        leftButton={
          <div
            className="logs-place generalButton"
            onClick={() => {
              setOPenNotif((prev) => !prev);
              refetchLog();
            }}
          >
            {isLoadingLogs ? (
              <CircularProgress />
            ) : (
              <Badge
                badgeContent={logList.filter((i) => !i.watchedUser).length}
                color="primary"
              >
                <img src={NotificationIcon} />
              </Badge>
            )}
          </div>
        }
      >
        <div className="zadik-page">
          <ZadikSearchBar
            zadikData={zadiksData}
            selectedFilters={selectedFilters}
            onFilterButtonClick={() => setOpenFilters(true)}
          />
          <div className="lists-container">
            {filteredZadiks &&
              filteredZadiks.map((z) => (
                <ZadikRowCard key={z.equipment} zadik={z} />
              ))}
          </div>
        </div>
        <FilterSheet opened={openFilters} setOpened={setOpenFilters} />
      </PageLayout>
    </>
  );
};

export default FamilyEquipmentsList;
