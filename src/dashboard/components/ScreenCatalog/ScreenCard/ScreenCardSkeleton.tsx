import { Skeleton } from "@mui/material";
import "./ScreenCard.scss";

const ScreenCardSkeleton = () => {
    return (
        <div className="screen-card">
            <div className="screen-card__header">
                <div className="screen-card__header-right">
                    <Skeleton variant="text" height="2rem" width="1rem" />
                    <Skeleton variant="text" height="2rem" width="6rem" />
                </div>
                <div className="screen-card__header-left">
                    <Skeleton variant="circular" height="1.5rem" width="1.5rem" />
                    <Skeleton variant="text" height="1rem" width="5rem" />
                </div>
            </div>
            <div className="screen-card__body">
                <div className="screen-card__body--row">
                    <Skeleton variant="text" height="2rem" width="5rem" />
                    <Skeleton variant="text" height="2rem" width="5rem" />
                </div>
                <div className="screen-card__body--row">
                    <Skeleton variant="text" height="2rem" width="4rem" />
                    <Skeleton variant="text" height="2rem" width="8rem" />
                </div>
            </div>
        </div>
    );
};

export default ScreenCardSkeleton;
