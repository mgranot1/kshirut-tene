import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ReportGmailerrorIcon from "@mui/icons-material/ReportGmailerrorred";
import { ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { SitePaths } from "../../../router/routes";
import { paramsAtom } from "../../../shared/stores/params.store";
import { FaultStatus } from "../../../shared/types/params.types";
import { ISummaryFault } from "../../types/summaryFault.types";
import "./SummaryFault.scss";

const LIMIT_LAST_COMMENT = 20;

export interface ISummaryFaultProps {
  summaryFault: ISummaryFault;
}
const SummaryFault = ({ summaryFault }: ISummaryFaultProps) => {
  const navigate = useNavigate();
  const params = useRecoilValue(paramsAtom);

  return (
    <ListItem
      className="SummaryFault"
      onClick={() => {
        navigate(`../${SitePaths.FAULT_REPORT}?faultId=${summaryFault.faultNum}`);
      }}
    >
      <div className="SummaryFault__card">
        <div className="SummaryFault__right">
          <div className="SummaryFault__error">
            {!summaryFault.isValid && <ReportGmailerrorIcon />}
          </div>
          <p className="SummaryFault__words">
            {" "}
            {summaryFault.faultNum}
            {" - "}
            {summaryFault.essence.length > LIMIT_LAST_COMMENT
              ? summaryFault.essence.substring(0, LIMIT_LAST_COMMENT) + "..."
              : summaryFault.essence}{" "}
          </p>
        </div>
        <div className="SummaryFault__left">
          <p
            className="SummaryFault__status SummaryFault__words"
            is-grayed-field={
              summaryFault.faultStatus === FaultStatus.Done ||
                summaryFault.faultStatus === FaultStatus.Cancelled
                ? "grayed"
                : ""
            }
          >
            {
              params.faultStatus?.find(
                (i) => i.value === summaryFault.faultStatus
              )?.label
            }
          </p>
          <KeyboardArrowLeftIcon className="SummaryFault__leftArrow" />
        </div>
      </div>
    </ListItem>
  );
};
export default SummaryFault;
