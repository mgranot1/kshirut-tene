import { Skeleton } from "@mui/material";
import "./ComponentCardSkeleton.scss";

interface IComponentCardSkeletonProps {
  children: React.ReactNode;
}

const ComponentCardSkeleton = ({ children }: IComponentCardSkeletonProps) => {
  return (
    <div className="componentCardSkeleton">
      <div className="componentCardSkeleton__header">
        <Skeleton variant="text" height="2rem" width="10rem" />
        <Skeleton variant="circular" height="2rem" width="2rem" />
      </div>
      {children}
    </div>
  );
};

export default ComponentCardSkeleton;
