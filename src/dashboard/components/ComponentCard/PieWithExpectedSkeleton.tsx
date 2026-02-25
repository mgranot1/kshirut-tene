import Skeleton from "@mui/material/Skeleton";
import PieGraphSkeleton from "./PieGraphSkeleton";
import "./PieWithExpectedSkeleton.scss";

const PieWithExpectedSkeleton = () => {
  return (
    <div className="pieWithExpectedSkeleton">
      <div className="pieWithExpectedSkeleton__pie">
        <PieGraphSkeleton />
      </div>
      <div className="pieWithExpectedSkeleton__development">
        <Skeleton variant="text" height="2rem" width="7rem" />
        <Skeleton variant="text" height="1.5rem" width="10rem" />

        <div className="pieWithExpectedSkeleton__units">
          {[1, 2, 3].map((key) => (
            <div key={key}>
              <Skeleton variant="text" height="7.5rem" width="4rem" />
              <Skeleton variant="text" height="1.5rem" width="4rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieWithExpectedSkeleton;
