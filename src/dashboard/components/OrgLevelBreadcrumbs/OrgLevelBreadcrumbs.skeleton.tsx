import { Skeleton } from "@mui/material";
import React from "react";
import "./OrgLevelBreadcrumbs.scss";

export const OrgLevelBreadcrumbsSkeleton: React.FC = () => {
  const skeletonElement = (
    <Skeleton variant="text" height="2rem" width="7rem" />
  );

  const skeletonInMiddle = (key: number) => (
    <React.Fragment key={key}> / {skeletonElement} </React.Fragment>
  );

  return (
    <div className="orgLevelBreadcrumbs__skeleton">
      {skeletonElement}
      {[1, 2, 3, 4].map((k) => skeletonInMiddle(k))}
    </div>
  );
};

export default OrgLevelBreadcrumbsSkeleton;
