import { useEffect, useState } from "react";
import { IScreen } from "../../../types/screen.types";
import { ScreenAccessType } from "./const";
import { useScreensByOwnership } from "./useScreensByOwnership";
import { useCurrentPath } from "../../../../shared/hooks/useCurrentPath";

export const useOpenIndex = () => {
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const { screenByOwnership } = useScreensByOwnership();
    const currentScreenId = useCurrentPath();

    const uniqueId = (
        category: IScreen["categoryId"],
        creator: IScreen["creator"]
    ) => category + creator;

    useEffect(() => {
        const setOpenIndexByCreator = (key: string): boolean => {
            const categoryIncludeScreen = Object.keys(screenByOwnership[key]).find(
                (categoryId) =>
                    screenByOwnership[key][categoryId]
                        .map((screen: IScreen) => screen.id)
                        .includes(currentScreenId)
            );
            if (categoryIncludeScreen) {
                setOpenIndex(uniqueId(categoryIncludeScreen, key));
                return true;
            }
            return false;
        };

        if (!setOpenIndexByCreator(ScreenAccessType.MyScreen)) {
            setOpenIndexByCreator(ScreenAccessType.Shared);
        }
    }, [
        currentScreenId,
        screenByOwnership[ScreenAccessType.MyScreen],
        screenByOwnership[ScreenAccessType.Shared],
    ]);

    return {openIndex, setOpenIndex, uniqueId}
}