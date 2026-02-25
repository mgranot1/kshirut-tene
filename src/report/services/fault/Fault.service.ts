import AxiosInstance from "../../../shared/utils/axios.instance";
import { convertBooleanToSAP } from "../../../shared/utils/general.utils";
import { convertToTimestamp } from "../../../shared/utils/lastChange.util";
import { IComment } from "../../types/comment.types";
import {
  IFault,
  IFaultCreate,
  IFaultUpdate,
  IMaterialDesc,
} from "../../types/fault.types";
import { ISummaryFault } from "../../types/summaryFault.types";

export interface ITimeGW {
  ms: number;
}
export const msToString = (ms: string | ITimeGW) => {
  if (typeof ms === "string") {
    return ms;
  } else {
    return ms.ms;
  }
};

export const convertCommentDate = (comments: IComment[] | undefined) =>
  comments
    ?.map((comment) => ({
      ...comment,
      creationTimestamp: convertToTimestamp(comment.creationTimestamp),
    }))
    .sort(
      (a, b) => a.creationTimestamp.getTime() - b.creationTimestamp.getTime()
    ) || [];

export default class KshirutFaultService {
  public static async getSummaryFaultsByEquipment(
    equipment: string,
    fetchOnlyOpenFaults?: boolean
  ): Promise<ISummaryFault[]> {
    const res = await AxiosInstance.get<ISummaryFault[]>(`fault/equipment`, {
      params: { equipment, open: convertBooleanToSAP(!!fetchOnlyOpenFaults) },
    });
    return res.data;
  }

  public static async getFaultData(faultNum: string): Promise<IFault> {
    const res = await AxiosInstance.get(`fault`, { params: { faultNum } });
    return {
      ...res.data,
      comments: convertCommentDate(res.data.comments),
      hhs: res.data.hhs,
    };
  }

  public static async createFault(faultData: IFault): Promise<IFault> {
    const faultCreateData: IFaultCreate = {
      ...faultData,
      changeTimestamp: undefined,
    };
    const res = await AxiosInstance.post<IFault>(`fault`, faultCreateData);

    return { ...res.data, comments: convertCommentDate(res.data.comments) };
  }

  public static async updateFault(faultData: IFault): Promise<IFault> {
    const faultUpdateData: IFaultUpdate = {
      ...faultData,
      changeTimestamp: undefined,
      hhs: faultData.hhs.map((hh) => ({ ...hh, changeTimestamp: undefined })),
      means: faultData.means.map((mean) => ({
        ...mean,
        changeTimestamp: undefined,
      })),
    };
    // @ts-ignore
    delete faultUpdateData.comments;

    const res = await AxiosInstance.put<IFault>(`fault`, faultUpdateData);

    return {
      ...res.data,
      hhs: res.data.hhs,
    };
  }

  public static async ifMatnrHhExists(material: string): Promise<boolean> {
    const res = await AxiosInstance.get(`/material-hh`, {
      params: { material },
    });

    return res.data;
  }

  public static async ifMatnrEmzExists(material: string): Promise<boolean> {
    const res = await AxiosInstance.get(`/material-emz`, {
      params: { material },
    });

    return res.data;
  }

  public static async getHHDescriptions(
    faultNum: string
  ): Promise<IMaterialDesc[]> {
    const res = await AxiosInstance.get(`/material-hh/descriptions`, {
      params: { faultNum },
    });

    return res.data;
  }
  public static async getHHDescriptionByMaterial(
    materialNumber: string
  ): Promise<IMaterialDesc[]> {
    const res = await AxiosInstance.get(`/material-hh/description-by-mateial`, {
      params: { mateialNumber: materialNumber },
    });

    return res.data;
  }
}
