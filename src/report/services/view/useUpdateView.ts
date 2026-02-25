import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { QueryKeys } from "../../../shared/types/query.types";
import { IView } from "../../../shared/types/view.types";
import ViewService from "./View.service";

export const useUpdateView = (logType: IView["logType"]) => {
  return useMutation({
    mutationKey: [QueryKeys.UpdateView, logType],
    mutationFn: (variables: { logTypeKey: IView["logTypeKey"] }) =>
      ViewService.updateView(logType, variables.logTypeKey),
  });
};

export const useUpdateViewOnLoad = (
  logType: IView["logType"],
  logTypeKey: IView["logTypeKey"] | undefined
) => {
  const { mutate: mutateUpdateView } = useUpdateView(logType);

  useEffect(() => {
    if (logTypeKey) {
      mutateUpdateView({ logTypeKey });
    }
  }, [logTypeKey]);
};
