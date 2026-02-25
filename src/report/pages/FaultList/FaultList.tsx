import BackIcon from "@assets/report/backIcon.svg";
import { List } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Loader from "../../../shared/components/Loader/Loader";
import { Qualification } from "../../../shared/types/kshirutData.types";
import { FaultStatus } from "../../../shared/types/params.types";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import SummaryFault from "../../components/SummaryFault/SummaryFault";
import { useGetSummaryFaultsByEquipment } from "../../services/fault/useGetSummaryFaultsByEquipment";
import { useGetZadikQuery } from "../../services/zadikData/useGetZadikData";
import { ISummaryFault } from "../../types/summaryFault.types";
import "./FaultList.scss";

export type PageParams = Record<"zadikId", string>;

const FaultList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { zadikId } = useParams<PageParams>() as PageParams;

  const fetchOnlyOpenFaults: boolean = !!location.state?.fetchOnlyOpenFaults;

  const {
    data: faults,
    isSuccess,
    isLoading,
  } = useGetSummaryFaultsByEquipment(
    zadikId,
    fetchOnlyOpenFaults
  );

  const {data: zadikData, isLoading: isZadikDataLoading} = useGetZadikQuery({equipment: zadikId});

  return (
    <>
      {( isLoading || isZadikDataLoading ) && <Loader />}
      <PageLayout
        title="תקלות"
        backButton={
          location.key !== "default"
            ? {
                button: <img className="headerButton" src={BackIcon} />,
                function: () => navigate(-1),
              }
            : undefined
        }
      >
         { zadikData && (
          <div className="faultList">
            <div className="faultList__card">
              <div className="faultList__content">
                <p className="faultList__cardTitle">
                  צ' {zadikId}
                </p>

                <p className="faultList__cardSubtitle">
                  {zadikData.equnrDesc}
                </p>
                <p className="faultList__cardSubtitle">
                  {zadikData.mainPlatformDesc} |{" "}
                  {zadikData.secPlatformDesc}
                </p>

                <div className="faultList__cardData">
                  <div className="faultList__qual">
                    <div
                      className={`faultList__dot ${
                        Qualification[zadikData.warKshirut]?.class
                      }`}
                    ></div>
                    <span className="faultList__qual--text">כשירות מלחמה</span>
                  </div>
                  <div className="faultList__qual">
                    <div
                      className={`faultList__dot ${
                        Qualification[zadikData.kshirut]?.class
                      }`}
                    ></div>
                    <span className="faultList__qual--text">כשירות שגרה</span>
                  </div>
                </div>
              </div>
            </div>
            <List className="faultList__faults">
              {isSuccess &&
                faults
                  .sort((fault1: ISummaryFault, fault2: ISummaryFault) => {
                    if (
                      fault1.faultStatus === FaultStatus.Done &&
                      fault2.faultStatus !== FaultStatus.Done
                    )
                      return 1;
                    if (
                      fault1.faultStatus !== FaultStatus.Done &&
                      fault2.faultStatus === FaultStatus.Done
                    )
                      return -1;
                    return (
                      new Date(fault2.changeTimestamp).getTime() -
                      new Date(fault1.changeTimestamp).getTime()
                    );
                  })
                  .map((fault: ISummaryFault, index: number) => (
                    <SummaryFault summaryFault={fault} key={index} />
                  ))}
            </List>
          </div>
        )}
      </PageLayout>
    </>
  );
};
export default FaultList;
