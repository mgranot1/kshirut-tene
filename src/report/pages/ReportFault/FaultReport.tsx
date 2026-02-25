import React from "react";
import { useLocation } from "react-router-dom";
import Loader from "../../../shared/components/Loader/Loader";
import { useGetFaultData } from "../../services/fault/useGetFaultData";
import { useGetZadikQuery } from "../../services/zadikData/useGetZadikData";
import { emptyIFault } from "../../types/fault.types";
import FaultForm from "./ReportFault";

type PageParams = { faultId: string | null; equnr: string | null };

export type LocationState = {
  equipment?: { path: string };
};

export const FaultReport: React.FC = () => {
  const location = useLocation();
  const pageParams = new URLSearchParams(location.search);
  const { faultId, equnr }: PageParams = {
    faultId: pageParams.get("faultId"),
    equnr: pageParams.get("equnr"),
  };

  const { data: faultData } = useGetFaultData(faultId ?? undefined);

  const { data: zadikData } = useGetZadikQuery({
    equipment: faultData?.equipment ?? equnr ?? undefined,
  });

  return zadikData ? (
    <FaultForm
      fault={faultData ?? { ...emptyIFault, faultNum: undefined, equipment: equnr ?? '' }}
      zadikData={zadikData}
    />
  ) : (
    <Loader />
  );
};

export default FaultReport;
