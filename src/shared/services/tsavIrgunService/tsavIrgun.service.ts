import { OrgLevelCode } from "../../../dashboard/types/dashboardOrgLevel.types";
import { IOption } from "../../types/general.types";
import { ITsavIrgunLevel } from "../../types/tsavIrgun.types";
import AxiosInstance from "../../utils/axios.instance";
import { uniteGdudsBySimulToari } from "../../utils/orgLevel.utils";
export default class TsavIrgunService {
  public static async getTsavIrgun(): Promise<Array<ITsavIrgunLevel>> {
    const res = await AxiosInstance.get(`tsav-irgun/routine`);

    return uniteGdudsBySimulToari(
      res.data.map((o: ITsavIrgunLevel) => ({
        ...o,
        funcLocDesc: `${
          o.hierLevel === OrgLevelCode.GDUD
            ? o.funcLoc + " - " + o.funcLocDesc
            : o.funcLocDesc
        }`,
      }))
    );
  }
  //todo: react query

  public static async getTsavIrgunEmergency(
    operation: string
  ): Promise<Array<ITsavIrgunLevel>> {
    const res = await AxiosInstance.get(`tsav-irgun/emergency`, {
      params: { operation },
    });

    return uniteGdudsBySimulToari(res.data);
  }

  public static async getOperations(): Promise<Array<IOption>> {
    const res = await AxiosInstance.get(`tsav-irgun/emergency-operation`);

    return res.data.map((o) => ({ value: o.code, label: o.description }));
  }
  //todo: add in dashboard
  public static async getEmergencyGduds(): Promise<Array<IOption>> {
    const res = await AxiosInstance.get(`tsav-irgun/emergency/gdud`);

    return res.data.map((o) => ({ label: o.funcLocDesc, value: o.funcLoc }));
  }
  //done
  public static async getIsManeuveringGdud(gdud: string): Promise<boolean> {
    const res = await AxiosInstance.get(`tsav-irgun/maneuvering`, {
      params: { gdud },
    });
    return res.data;
  }
  //done
  public static async updateIsManeuveringGdud(
    gdud: string,
    isManeuvering: boolean
  ): Promise<boolean> {
    const res = await AxiosInstance.put(`tsav-irgun/maneuvering`, {
      funcLoc: gdud,
      isManeuvering,
    });

    return res.data;
  }

  /*
~function getTsav:
  Gets the full information on a tsav, by it's identifier ( objid for a tsav in war tree, else funcLoc for a tsav in routine  ).
  Takes an operation number and a list of tsav identifiers for an input.
*/
  public static async getTsav(
    operation: string,
    tsavIdentifiers: string[]
  ): Promise<Array<ITsavIrgunLevel>> {
    const res = await AxiosInstance.get("tsav-irgun", {
      params: { operation, tsavs: tsavIdentifiers.join(",") },
    });
    return res.data;
  }
}
