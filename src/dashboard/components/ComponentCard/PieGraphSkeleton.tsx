import Skeleton from "@mui/material/Skeleton";
import "./PieGraphSkeleton.scss";

const PieGraphSkeleton = () => {
  return (
    <div className="pieGraphSkeleton">
      <Skeleton variant="circular" height="8rem" width="8rem" />
      <div className="pieGraphSkeleton__data">
        <p className="pieGraphSkeleton__row">
          <Skeleton variant="text" height="2rem" width="3rem" />
          <Skeleton variant="text" height="2rem" width="2rem" />
        </p>
        <p className="pieGraphSkeleton__row">
          <Skeleton variant="text" height="2rem" width="4rem" />
          <Skeleton variant="text" height="2rem" width="2rem" />
        </p>
        <p className="pieGraphSkeleton__row">
          <Skeleton variant="text" height="2rem" width="5rem" />
          <Skeleton variant="text" height="2rem" width="2rem" />
        </p>
      </div>
    </div>
  );
};

export default PieGraphSkeleton;
