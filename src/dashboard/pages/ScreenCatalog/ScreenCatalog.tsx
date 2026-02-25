import { useUserUnit } from "../../../report/hooks/useUserUnit";
import DashboardTitle from "../../components/layout/DashboardTitle/DashboardTitle";
import ScreenCard from "../../components/ScreenCatalog/ScreenCard/ScreenCard";
import ScreenCardSkeleton from "../../components/ScreenCatalog/ScreenCard/ScreenCardSkeleton";
import { useGetScreensCatalog } from "../../services/screen/useGetScreensBySearch";
import { useToggleShare } from "../../services/screen/useToggleShare";
import { ScreenAction } from "../../types/screen.types";
import "./ScreenCatalog.scss";

const ScreenCatalog = () => {
  const { mutate: mutateToggle } = useToggleShare();
  const { data: screensCatalog, isLoading } = useGetScreensCatalog();
  const [userUnit] = useUserUnit();

  const handleToggleFavoriteCard = (value: boolean, id: string) => {
    mutateToggle({
      action: value ? ScreenAction.Unshare : ScreenAction.Share,
      id: id,
    });
  };

  return (
    <div className="screen-catalog">
      <DashboardTitle title="קטלוג מסכים" />
      <div className="screen-catalog__cards">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <ScreenCardSkeleton key={i} />
            ))}
          </>
        ) : screensCatalog?.length ? (
          screensCatalog
            .sort(
              (a, b) =>
                Number(b.creator === userUnit.username) -
                Number(a.creator === userUnit.username)
            )
            .map((screen) => (
              <ScreenCard
                key={screen.id}
                name={screen.name}
                id={screen.id}
                category={screen.categoryName}
                creator={
                  screen.creator !== "NO_OWNER" // todo: temporary solution
                    ? `${screen.creator} - ${screen.creatorName}`
                    : "ללא"
                }
                color={screen.color}
                isShared={screen.isShared}
                onToggleSharedStatus={(value) =>
                  handleToggleFavoriteCard(value, screen.id)
                }
              />
            ))
        ) : (
          <>לא נמצאו מסכים</>
        )}
      </div>
    </div>
  );
};

export default ScreenCatalog;
