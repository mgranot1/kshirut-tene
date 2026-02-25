import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useGetValuesRange } from "../../services/param/useGetValuesRange";
import { paramsAtom } from "../../stores/params.store";
export const ParmeterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setParams = useSetRecoilState(paramsAtom);
  const { data: params } = useGetValuesRange();

  useEffect(() => {
    if (params) {
      setParams(params);
    }
  }, [params, setParams]);

  return <>{children}</>;
};
