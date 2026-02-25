import pageNotFound from "@assets/report/PageNotFound.gif";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../../report/components/layout/PageLayout/PageLayout";
import { SitePaths } from "../../../router/routes";
import GeneralButton from "../../components/GeneralButton/GeneralButton";
import "./PageNotFound.scss";

const PageNotFound = ({ dashboard }: { dashboard?: boolean }) => {
  const navigate = useNavigate();

  const NotFoundComponent = <div className="pageNotFound">
    <div>
      <img src={pageNotFound} className="pageNotFound__gif" />
    </div>
    <h3 className="pageNotFound__title">הדף שחיפשת לא קיים </h3>
  </div>

  return (
    dashboard ? NotFoundComponent
      : <PageLayout
        title=""
        footerElement={
          <GeneralButton
            text="דף הבית"
            onClick={() => navigate(SitePaths.HOME)}
          />
        }
      >
        {NotFoundComponent}
      </PageLayout>
  );
};

export default PageNotFound;
