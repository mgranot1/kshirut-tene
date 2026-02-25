import { IOption } from "../../shared/types/general.types";
import { IScreenCreator } from "../types/screen.types";

export const getScreenCreators = (
  screenCreators: IScreenCreator[]
): IOption[] => {
  return screenCreators.map((screenCreator) => ({
    label: `${screenCreator.creatorId} - ${screenCreator.creatorName}`,
    value: screenCreator.creatorId,
  }));
};
