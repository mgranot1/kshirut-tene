import { useMemo } from "react";
import useGetScreens from "../../../services/screen/useGetScreens";
import { ScreenAccessType } from "./const";
import { useUserUnit } from "../../../../report/hooks/useUserUnit";
import { IScreen } from "../../../types/screen.types";

type ScreensByCategory = Record<string, IScreen[]>;

type ScreenByOwnership = {
    [ScreenAccessType.MyScreen]: ScreensByCategory,
    [ScreenAccessType.Shared]: ScreensByCategory,
}

export const useScreensByOwnership = () => {
    const { data: screens, isLoading } = useGetScreens();
    const [userUnit] = useUserUnit();

    const screenByOwnership = useMemo(() => {
        const screensMap: ScreenByOwnership = {
            [ScreenAccessType.MyScreen]: {},
            [ScreenAccessType.Shared]: {},
        };

        screens?.forEach((screen) => {
            if (screen.creator === userUnit.username && screen.isShared) {
                screensMap[ScreenAccessType.MyScreen][screen.categoryId] = Boolean(
                    screensMap[ScreenAccessType.MyScreen][screen.categoryId]
                )
                    ? [...screensMap[ScreenAccessType.MyScreen][screen.categoryId], screen]
                    : [screen];
            } else if (screen.isShared) {
                screensMap[ScreenAccessType.Shared][screen.categoryId] = Boolean(
                    screensMap[ScreenAccessType.Shared][screen.categoryId]
                )
                    ? [...screensMap[ScreenAccessType.Shared][screen.categoryId], screen]
                    : [screen];
            }
        });

        return screensMap;
    }, [screens]);

    return {screenByOwnership, isLoading}
}


