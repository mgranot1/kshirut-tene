import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import { useAlertify } from "../../../contexts/AlertContext";
import { dashboardGeneralDataAtom } from "../../stores/DashboardData.store";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import { Feature } from "../../types/updateEquipment.type";
import DashboardService, { dashboardDataResMap } from "./dashboard.service";

const useMassiveDashboardDataChange = () => {
  const { alertify } = useAlertify();
  const setGeneralData = useSetRecoilState(dashboardGeneralDataAtom);

  return useMutation({
    mutationKey: ["useCreateVariant"],
    mutationFn: (variables: {
      equipments: GeneralDashboardTableRow[];
      edit: Feature[];
      operation: string;
    }) =>
      DashboardService.massiveDashboardDataChange(
        variables.equipments,
        variables.edit,
        variables.operation
      ),
    onSuccess: (response) => {
      const message = `${response.equipments.length} / ${
        response.equipments.length - response.errors.length
      } כלים עודכנו בהצלחה`;
      if (response.errors.length > 0) {
        alertify({
          messageType: "Error",
          msgContent: {
            message: message,
            desc: response.errors.map(
              (error) =>
                `${error.equipment.replace(/^0+/, "")} - ${error.message}`
            ),
          },
        });
      }
      const failedEquipments = response.errors.map((e) => e.equipment);
      const data = dashboardDataResMap(
        response.equipments.filter(
          (equi) => !failedEquipments.includes(equi.equipment)
        )
      );

      if (data.length > 0) {
        setGeneralData((prev) => {
          const updatedEquipments = prev.map(
            (equipment) =>
              data.find(
                (changedEquip) => changedEquip.equipment === equipment.equipment
              ) ?? equipment
          );

          return updatedEquipments;
        });
      }
      toast.success(message);
    },

    onError: (error: any) => {
      toast.error(`${error?.response?.data?.message ?? "שגיאה"}`);
    },
  });
};

export default useMassiveDashboardDataChange;
