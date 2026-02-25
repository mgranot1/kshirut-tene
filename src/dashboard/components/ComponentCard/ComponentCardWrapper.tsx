import { useRecoilValue } from "recoil";
import { Drilltype } from "../../pages/CustomScreen/CustomScreen";
import { useGetComponentData } from "../../services/component/useGetComponentData";
import { useGetComponentSettingRaw } from "../../services/component/useGetComponentSettingRaw";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { ComponentType, IComponent } from "../../types/component.types";
import SkeletonGraphGenerator from "../GraphGenerator/SkeletonGraphGenerator";
import ComponentCard from "./ComponentCard";
import ComponentCardSkeleton from "./ComponentCardSkeleton";

interface IComponentCardWrapperProps<T extends ComponentType> {
  id: IComponent["id"];
  type: T;
  onView: (id: IComponent["id"]) => void;
  onDelete?: (id: IComponent["id"]) => void;
  onEdit?: (id: IComponent["id"]) => void;
  onDrilldown?: (id: IComponent["id"], by: Drilltype) => void;
}

const ComponentCardWrapper = <T extends ComponentType>({
  id,
  type,
  onView,
  onDelete,
  onEdit,
}: IComponentCardWrapperProps<T>) => {
  const kshirutType = useRecoilValue(kshirutTypeState);
  const { data: componentData, isFetching } = useGetComponentData(
    id,
    kshirutType.value
  );
  const { mutate } = useGetComponentSettingRaw();

  const handleDrilldown = (
    componentId: IComponent["id"],
    drillBy: Drilltype
  ) => {
    mutate({ componentId, drillBy });
  };

  if (!componentData || isFetching) {
    return (
      <ComponentCardSkeleton>
        <SkeletonGraphGenerator type={type} />
      </ComponentCardSkeleton>
    );
  } else {
    return (
      <ComponentCard
        id={id}
        name={componentData.name}
        type={componentData.type}
        toWarningThreshold={componentData.toWarningThreshold}
        toSevereThreshold={componentData.toSevereThreshold}
        data={componentData.componentData}
        onView={onView}
        onDelete={onDelete}
        onEdit={onEdit}
        onDrilldown={handleDrilldown}
      />
    );
  }
};

export default ComponentCardWrapper;
