import { useMutation } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { IHHErr } from "../../types/hh.types";
import KshirutFaultService from "./Fault.service";

export const useGetHHDescriptionByMaterial = ({ onsuccss }) => {
  return useMutation({
    mutationKey: [QueryKeys.GetHHDescriptionByMaterial],
    mutationFn: (variables: {
      missingPart: IHHErr;
      //necessary for onSuccess
      index: number;
    }) =>
      KshirutFaultService.getHHDescriptionByMaterial(
        variables.missingPart.material
      ),
    onSuccess: onsuccss,
  });
};
