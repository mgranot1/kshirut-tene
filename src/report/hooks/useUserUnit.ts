import { useRecoilState } from "recoil";
import { userUnitState } from "../stores/userUnit.store";

export const useUserUnit = () => {
  const [userUnit, setUserUnit] = useRecoilState(userUnitState);
  return [userUnit, setUserUnit] as const;
};
