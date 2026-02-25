import { useMutation } from "@tanstack/react-query";
import { useAlertify } from "../../../contexts/AlertContext";
import { useUserUnit } from "../../hooks/useUserUnit";
import UserUnitService from "./UserUnit.service";

export const useCreateUserUnit = ({ onSuccess }) => {
  const { alertify } = useAlertify();
  const [userUnit] = useUserUnit();

  return useMutation({
    mutationKey: ["createUserUnit"],
    mutationFn: () => UserUnitService.createUserUnit(userUnit),
    onError: (error: any) => {
      alertify({
        messageType: "Error",
        msgContent: { message: error?.response?.data?.message },
      });
    },
    onSuccess: onSuccess,
  });
};
