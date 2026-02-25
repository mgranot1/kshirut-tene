import NotificationIcon from "@assets/report/notification.svg";

import { ReactComponent as RamaIrgunitIcon } from "@assets/report/RamaIrgunit.svg";
import TimeLineTwoIcon from "@mui/icons-material/TimelineTwoTone";
import { Badge, CircularProgress, List, Tooltip } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { kshirutTypeState } from "../../../dashboard/stores/kshirutType.store";
import { DASHBOARD_PREFIX } from "../../../router/router.constant";
import { SitePaths } from "../../../router/routes";
import KshirutTypeDropDown from "../../../shared/components/KshirutTypeDropDown/KshirutTypeDropDown";
import Loader from "../../../shared/components/Loader/Loader";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { SELECTED_FILTERS_SESSION_KEY } from "../../../shared/utils/constants";
import { isEquipmentNotKashir } from "../../../shared/utils/kshirut.utils";
import { trackPageView } from "../../../shared/utils/matomo.utils";
import FamilyKshirutCard from "../../components/FamilyKshirutCard/FamilyKshirutCard";
import FilterSheet, {
  emptyFilters,
  IFilters,
} from "../../components/FilterSheet/FilterSheet";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import NotificationsList from "../../components/NotificationsList/NotificationsList";
import ZadikSearchBar from "../../components/ZadikSearchBar/ZadikSearchBar";
import { useUserUnit } from "../../hooks/useUserUnit";
import { useGetLogs } from "../../services/log/useGetLogs";
import { useGetZadiksData } from "../../services/zadikData/useGetZadiksData";
import { ILog } from "../../types/log.types";
import { getFilteredZadiks } from "../../utils/filterZadiks.util";
import "./FamilyList.scss";

interface IFamily {
  code: string;
  desc: string;
}

const FamiliesList = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [openNotificationList, setOpenNotificationList] = useState(false);
  const { data: zadiksData, fetchStatus: fetchZadiksDataStatus } =
    useGetZadiksData();
  const [selectedFilters, setSelectedFilters] = useSessionStorage<IFilters>(
    SELECTED_FILTERS_SESSION_KEY
  );

  const [userUnit, _] = useUserUnit();
  const [logList, setLogList] = useState<ILog[]>([]);
  const kshirutType = useRecoilValue(kshirutTypeState);

  const {
    data: logsData,
    refetch: refetchLog,
    isLoading: isLoadingLogs,
    isSuccess: isSuccessLogs,
  } = useGetLogs();

  useEffect(() => {
    if (logsData && isSuccessLogs) {
      setLogList(logsData);
    }
    trackPageView("/#/king/", "king");
  }, [logsData]);

  const filteredZadiks = useMemo(() => {
    return !selectedFilters || !zadiksData
      ? zadiksData
      : getFilteredZadiks(zadiksData!, selectedFilters);
  }, [selectedFilters, zadiksData]);

  const getFamilies = () => {
    const famCodeSet = new Set<string>();
    const fams: IFamily[] = [];

    zadiksData?.forEach((z) => {
      if (!famCodeSet.has(z.materialFamily)) {
        fams.push({ code: z.materialFamily, desc: z.familyCodeDesc });
        famCodeSet.add(z.materialFamily);
      }
    });

    return fams;
  };

  const families: IFamily[] = useMemo(() => getFamilies(), [zadiksData]);

  const countKshirim = useCallback(
    (zadiksArr: IZadikData[], familyId: string) => {
      const kshirim = Object.values(zadiksArr).filter(
        (z: IZadikData) =>
          z.materialFamily === familyId &&
          !isEquipmentNotKashir(
            {
              isGdudManeuvering: z.isManeuveringGdud,
              kshirut: z.kshirut,
              warKshirut: z.warKshirut,
            },
            kshirutType.value
          )
      );
      return kshirim.length;
    },
    [kshirutType]
  );

  const countFamily = (zadiksArr: IZadikData[], familyId: string): number => {
    const onPlatform = Object.values(zadiksArr).filter(
      (z) => z.materialFamily === familyId
    );
    return onPlatform.length;
  };

  const navToFamily = (familyCode: string) => {
    navigate(`../${SitePaths.FAMILY}/${familyCode}`);
  };

  useEffect(() => {
    const start = async () => {
      if (!selectedFilters) {
        setSelectedFilters(emptyFilters);
      }
    };

    if (
      !(
        !!userUnit.routineLevel ||
        !!userUnit.emergencyLevel ||
        (!!userUnit.objid && +userUnit.objid !== 0)
      )
    )
      navigate(`../${SitePaths.WELCOME}`);
    else start();
  }, []);

  const familyKshirutCards: JSX.Element[] | undefined = useMemo(
    () =>
      filteredZadiks &&
      families
        .sort((fam1, fam2) => (fam1.code > fam2.code ? 1 : -1))
        .map((fam) => {
          const totalAmount = countFamily(filteredZadiks, fam.code);

          return !!totalAmount ? (
            <div key={fam.code} onClick={() => navToFamily(fam.code)}>
              <FamilyKshirutCard
                key={fam.code}
                name={fam.desc}
                totalAmount={totalAmount}
                kshirimAmount={countKshirim(filteredZadiks, fam.code)}
              />
            </div>
          ) : (
            <></>
          );
        }),
    [filteredZadiks, families, countKshirim]
  );

  return (
    <>
      {fetchZadiksDataStatus === "fetching" && <Loader />}
      {openNotificationList && (
        <NotificationsList
          logList={logList}
          setLogList={setLogList}
          setOpenNotif={setOpenNotificationList}
        />
      )}
      <PageLayout
        title="הכלים שלי"
        backButton={{
          button: <RamaIrgunitIcon />,
          function: () => {
            navigate(`../${SitePaths.ORG_LEVEL}`);
          },
        }}
        navButton={
          <Tooltip title="מערכת מרכזת למעקב כשירות" placement="right" disableInteractive>
            <div
              className="generalButton"
              onClick={() => {
                window.open("#/" + DASHBOARD_PREFIX, SitePaths.TOP_VIEW);
              }}
            >
              <div className="familyList__navButton">
                <TimeLineTwoIcon />
              </div>
            </div>
          </Tooltip>
        }
        leftButton={
          <div
            className="generalButton"
            onClick={() => {
              setOpenNotificationList((prev) => !prev);
              refetchLog();
            }}
          >
            {isLoadingLogs ? (
              <CircularProgress />
            ) : (
              <Badge
                badgeContent={logList?.filter((i) => !i.watchedUser).length}
                color="primary"
              >
                <img src={NotificationIcon} />
              </Badge>
            )}
          </div>
        }
      >
        <div className="FamiliesList">
          <KshirutTypeDropDown />
          <ZadikSearchBar
            zadikData={zadiksData}
            selectedFilters={selectedFilters}
            onFilterButtonClick={() => setOpenFilters(true)}
          />
          <List>{familyKshirutCards}</List>
        </div>
        <FilterSheet opened={openFilters} setOpened={setOpenFilters} />
      </PageLayout>
    </>
  );
};

export default FamiliesList;
