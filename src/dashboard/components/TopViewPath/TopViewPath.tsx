import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { SitePaths } from "../../../router/routes";
import {
  defaultFamiliesPath,
  familiesPathState,
  familyLevelDesc,
  FamilyPath,
} from "../../stores/familiesPath.store";
import {
  defaultOrgLevelPath,
  OrgLevelPath,
  orgLevelPathState,
} from "../../stores/orgLevelPath.store";
import { OrgLevelCode } from "../../types/dashboardOrgLevel.types";
import { HierLevel } from "../../types/family.types";
import "./TopViewPath.scss";

export type TopViewPathValue = {
  hierLevel: HierLevel | OrgLevelCode;
  code?: string | number;
  optionalDesc?: string;
};

interface ITopViewPathProps {
  path: FamilyPath | OrgLevelPath;
  onTopViewPathChange: (level: HierLevel) => void;
  onTopViewTagClick?: () => void;
}

const TopViewPath = ({
  path,
  onTopViewPathChange,
  onTopViewTagClick,
}: ITopViewPathProps) => {
  const setFamiliesPath = useSetRecoilState(familiesPathState);
  const setOrgLevelPath = useSetRecoilState(orgLevelPathState);
  const navigate = useNavigate();
  const handleTopViewClick = () => {
    setFamiliesPath(defaultFamiliesPath);
    setOrgLevelPath(defaultOrgLevelPath);
    navigate(`../${SitePaths.TOP_VIEW}`);
  };

  const isClickableCrumb = (level: string) => {
    return (
      path[Number(level) + 1] || path[level].code ||
      (level === HierLevel.SubPlatform && path[HierLevel.Platform]?.code) ||
      (Number(level) === OrgLevelCode.GDUD && path[OrgLevelCode.GDUD]?.code)
    );
  };

  return (
    <div className="top-view-path">
      <Breadcrumbs>
        <span
          className="clickable"
          onClick={() => {
            onTopViewTagClick && onTopViewTagClick();
            handleTopViewClick();
          }}
        >
          מבט על
        </span>
        {Object.keys(path).map((level) => {
          return (
            path[level] && (
              <div key={level}>
                <span
                  className={`${isClickableCrumb(level) ? "clickable" : ""}`}
                  onClick={() =>
                    isClickableCrumb(level) &&
                    onTopViewPathChange(level as HierLevel)
                  }
                >
                  {familyLevelDesc[level]}
                </span>
                {path[level].code && (
                  <span>{` (${path[level].optionalDesc})`}</span>
                )}
              </div>
            )
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default TopViewPath;
