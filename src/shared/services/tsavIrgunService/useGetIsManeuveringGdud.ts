import { useMutation } from "@tanstack/react-query";
import { IKshirutData } from "../../types/kshirutData.types";
import { QueryKeys } from "../../types/query.types";
import TsavIrgunService from "./tsavIrgun.service";

export const useGetIsManeuveringGdud = ({ onSuccess }) => {
  return useMutation({
    mutationKey: [QueryKeys.GetIsManeuveringGdud],
    mutationFn: (variables: { tplnr: IKshirutData["tplnrRoutine"] }) =>
      TsavIrgunService.getIsManeuveringGdud(variables.tplnr),
    onSuccess: onSuccess,
  });
};
