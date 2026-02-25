import { ComponentType } from "../../types/component.types";
import PieGraphSkeleton from "../ComponentCard/PieGraphSkeleton";
import PieWithExpectedSkeleton from "../ComponentCard/PieWithExpectedSkeleton";

interface ISkeletonGraphGeneratorProps {
  type: ComponentType;
}

const SkeletonGraphGenerator = ({ type }: ISkeletonGraphGeneratorProps) => {
  switch (type) {
    case ComponentType.Pie:
      return <PieGraphSkeleton />;
    case ComponentType.PieWithExpected:
      return <PieWithExpectedSkeleton />;
    default:
      return <p>Unsupported graph type</p>;
  }
};

export default SkeletonGraphGenerator;
