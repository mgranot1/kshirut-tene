import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ComponentCardSkeleton from "../../components/ComponentCard/ComponentCardSkeleton";
import SkeletonGraphGenerator from "../../components/GraphGenerator/SkeletonGraphGenerator";
import { ComponentType } from "../../types/component.types";
import { CardWidthRem } from "./DrillDownScreen";
import "./DrillDownScreen.scss";

interface IDrillDownScreenSkeletonProps {
  type: ComponentType;
}

const DrillDownScreenSkeleton = ({ type }: IDrillDownScreenSkeletonProps) => {
  return (
    /** @ts-ignore css variable */
    <Box
      className="DrillDownScreen"
      style={{
        ["--card-width"]: CardWidthRem[type],
      }}
    >
      <Skeleton variant="text" height="3.5rem" width="9rem" />
      <Box className="DrillDownScreen__component">
        <ComponentCardSkeleton>
          <SkeletonGraphGenerator type={type} />
        </ComponentCardSkeleton>
      </Box>
      <div className="DrillDownScreen__separationLine"></div>
      <div className="DrillDownScreen__components">
        {[1, 2]?.map((_, index) => (
          <div key={index} className="DrillDownScreen__component">
            <ComponentCardSkeleton>
              <SkeletonGraphGenerator type={type} />
            </ComponentCardSkeleton>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default DrillDownScreenSkeleton;
