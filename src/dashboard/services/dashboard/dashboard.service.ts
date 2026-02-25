import { AxiosRequestConfig } from "axios";
import AxiosInstance from "../../../shared/utils/axios.instance";
import { convertToTimestamp } from "../../../shared/utils/lastChange.util";
import { HHTableRow } from "../../components/HHTablePopup/createHHTableColumns";
import {
  OrganizationalLevel,
  OrgLevelCode,
} from "../../types/dashboardOrgLevel.types";
import { DashboardEquipment } from "../../types/EquipmentTable.types";
import { DashboardFault } from "../../types/FaultTable.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import {
  FetchTopViewData,
  FetchTopViewPayload,
  TopViewDynamicFilters,
} from "../../types/topview.types";
import { Feature } from "../../types/updateEquipment.type";

export type MassiveResponse = {
  equipments: DashboardEquipment[];
  errors: { equipment: string; message: string }[];
};

export const dashboardDataResMap = (resData: any[]): any[] =>
  resData
    .map(
      (
        equi: DashboardEquipment & {
          phisicalLocation?: string;
          phisicalLocationDesc?: string;
        }
      ) => {
        const { faults, ...equiFields } = equi;
        const equipment = equiFields;

        return equi.faults.length
          ? equi.faults.map(
              (fault: DashboardFault) =>
                ({
                  ...fault,
                  ...equipment,
                  equipment: equi.equipment.replace(/^0+/, ""),
                  isGdudManeuvering: Boolean(equi.isGdudManeuvering),
                  isLogisticForce: Boolean(equi.isLogisticForce),
                  isAgamForce: Boolean(equi.isAgamForce),
                  excFromWar: Boolean(equi.excFromWar),
                  warTplnrDesc: equi.warTplnrDesc?.replace(equi.warTplnr, ""),
                  lastUpdateTimestamp: equi.lastUpdateTimestamp
                    ? convertToTimestamp(equi.lastUpdateTimestamp)
                    : undefined,
                  faultNum: fault.faultNum.replace(/^0+/, ""),
                  createTimestamp: fault.createTimestamp
                    ? convertToTimestamp(fault.createTimestamp)
                    : undefined,
                  changeTimestamp: fault.changeTimestamp
                    ? convertToTimestamp(fault.changeTimestamp)
                    : undefined,
                  // TODO: Physical/PhisicalLocation(Desc/Details) is a total mess. FIX IT ! For now, this should put in the right place.
                  physicalLocation:
                    equi.phisicalLocation ?? equi.physicalLocation,
                  physicalLocationDetails:
                    equi.phisicalLocationDesc ?? equi.physicalLocationDetails,
                }) as GeneralDashboardTableRow
            )
          : {
              ...equipment,
              equipment: equi.equipment.replace(/^0+/, ""),
              isGdudManeuvering: Boolean(equi.isGdudManeuvering),
              isLogisticForce: Boolean(equi.isLogisticForce),
              isAgamForce: Boolean(equi.isAgamForce),
              excFromWar: Boolean(equi.excFromWar),
              warTplnrDesc: equi.warTplnrDesc?.replace(equi.warTplnr, ""),
              lastUpdateTimestamp: equi.lastUpdateTimestamp
                ? convertToTimestamp(equi.lastUpdateTimestamp)
                : undefined,
              // TODO: Physical/PhisicalLocation(Desc/Details) is a total mess. FIX IT ! For now, this should put in the right place.
              physicalLocation: equi.phisicalLocation ?? equi.physicalLocation,
              physicalLocationDetails:
                equi.phisicalLocationDesc ?? equi.physicalLocationDetails,
            };
      }
    )
    .flat(2);

export default class DashboardService {
  public static async getDashboardData(
    tsavTree: OrganizationalLevel,
    config?: AxiosRequestConfig<unknown>
  ): Promise<GeneralDashboardTableRow[]> {
    const operation: string = tsavTree[OrgLevelCode.TREE_TYPE][0]?.value ?? "";

    const tplnr = Object.values(tsavTree)
      .splice(1)
      .flat()
      .map((i) => i.value)
      .join();

    if (import.meta.env.VITE_APP_NETWORK === "army") {
      const res = await AxiosInstance.get(`equipment/dashboard`, {
        params: { tplnr, operation },
        ...(config || {}),
      });

      return res.data ? dashboardDataResMap(res.data) : [];
    }

    // this is a pagination kind of plaster for the TS
    let isAllDataFetched = false;
    let allData: GeneralDashboardTableRow[] = [];
    let offset = 0;
    const limit = 10000;

    while (!isAllDataFetched) {
      const res = await AxiosInstance.get(`equipment/dashboard`, {
        params: { tplnr, operation, offset, limit },
        ...config,
      });

      const chunk = res.data;

      if (!chunk || chunk.length === 0) {
        isAllDataFetched = true;
      }

      allData.push(...chunk);
      offset += chunk.length;

      await new Promise((r) => setTimeout(r, 100));
    }

    return allData ? dashboardDataResMap(allData) : [];
  }

  public static async massiveDashboardDataChange(
    equipments: GeneralDashboardTableRow[],
    edit: Feature[],
    operation: string
  ): Promise<MassiveResponse> {
    const reqBody: { equipments: string[]; features: Feature[] } = {
      equipments: equipments.map((equipment) => equipment.equipment),
      features: edit,
    };

    const res = await AxiosInstance.put(`equipment/dashboard`, reqBody, {
      params: { operation },
    });

    return res.data;
  }

  public static async fetchTopViewData(
    payload: FetchTopViewPayload
  ): Promise<FetchTopViewData> {
    // its actually a get but we want to pass a body since too many filters means URL too long error
    const res = await AxiosInstance.post("equipment/top-view", payload);

    return res.data;
  }

  public static async getTopViewDynamicFilters(
    cacheKey: string
  ): Promise<TopViewDynamicFilters> {
    const res = await AxiosInstance.get<TopViewDynamicFilters>(
      "equipment/top-view/filters",
      {
        params: {
          cacheKey,
        },
      }
    );

    return res.data;
  }

  public static async fetchMissingHH(
    payload: FetchTopViewPayload
  ): Promise<HHTableRow[]> {
    // its actually a get but we want to pass a body since too many filters means URL too long error
    const res = await AxiosInstance.post("equipment/missing-hh", payload);

    return res.data;
  }
}
