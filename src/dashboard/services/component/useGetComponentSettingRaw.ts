import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { SitePaths } from "../../../router/routes";
import { Drilltype } from "../../pages/CustomScreen/CustomScreen";
import { drillStackAtom } from "../../stores/drillStack.store";
import {
  IComponent,
  PieData,
  PieWithExpectedData,
} from "../../types/component.types";
import { isEndOfLevels } from "../../utils/drilldown.utils";
import ComponentService from "./component.service";
import { useGetMaterials } from "../material/useGetMaterials";

const getComponentSetting = async ({
  componentId,
  drillBy,
}: {
  componentId: IComponent["id"];
  drillBy: Drilltype;
}) => {
  const data = await ComponentService.getComponentSetting(componentId);
  return { data, drillBy };
};

export const useGetComponentSettingRaw = () => {
  const setDrillStack = useSetRecoilState(drillStackAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const {data: materials} = useGetMaterials()

  return useMutation({
    mutationFn: getComponentSetting,
    onSuccess: ({ data, drillBy }) => {
      if (isEndOfLevels(data?.filters, drillBy, materials??[])) {
        toast("יותר נמוך מזה אין לאן לרדת :)", {
          style: {
            border: "1px solid rgb(235, 129, 58)",
            color: "rgb(235, 129, 58)",
          },
        });
        return;
      }

      setDrillStack([
        {
          mainComponent: {
            filters: data.filters,
            data: {
              id: data.id,
              name: data.name,
              type: data.type,
              toSevereThreshold: data.toSevereThreshold,
              toWarningThreshold: data.toWarningThreshold,
              componentData: {} as PieData | PieWithExpectedData,
            },
          },
          components: [],
          drillBy,
        },
      ]);

      navigate(
        `${location.pathname}/${SitePaths.DRILL_DOWN_SCREEN}/${data.id}`
      );
    },
  });
};
