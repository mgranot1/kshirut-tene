import { useQuery } from "@tanstack/react-query";
import ComponentService from "./component.service";
import { IScreen } from "../../types/screen.types";
import { QueryKeys } from "../../../shared/types/query.types";

const useGetScreenComponents = (screenId: IScreen["id"],
) => {
    return useQuery({
        queryKey: [QueryKeys.GetScreenComponents, screenId],
        queryFn: () => ComponentService.getScreenComponents(screenId),
    });
};

export default useGetScreenComponents;
