import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { SitePaths } from "../../../router/routes";
import { ROUTINE_TREE_TYPE } from "../../../shared/utils/constants";
import DashboardGeneralTable from "../../components/DashboardGeneralTable/DashboardGeneralTable";
import DashboardTitle from "../../components/layout/DashboardTitle/DashboardTitle";
import TopViewPath from "../../components/TopViewPath/TopViewPath";
import useDbdGeneralFilters from "../../hooks/useDbdFilters";
import useGetDashboardEquipments from "../../services/dashboard/useGetDashboardEquipments";
import { familiesPathState } from "../../stores/familiesPath.store";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { orgLevelPathState } from "../../stores/orgLevelPath.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";
import {
  OrganizationalLevel,
  OrgLevelCode,
} from "../../types/dashboardOrgLevel.types";
import { HierLevel } from "../../types/family.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import "./DbEquipmentList.scss";

const hideColumns: (keyof GeneralDashboardTableRow)[] = [
  "faultNum",
  "faultStatus",
  "essence",
  "expectedTime",
  "contact",
  "phoneNumber",
  "dereg",
  "squad",
  "mobileAbility",
  "reqSquad",
  "note",
  "grindType",
  "availabilityInhibitor",
  "faultHh",
  "faultEmz",
  "transportationType",
  "faultHhProblem",
  "faultEmzProblem",
  "createTimestamp",
  "changeTimestamp",
];

const DbEquipmentList = () => {
  const [familiesPath, setFamiliesPath] = useRecoilState(familiesPathState);
  const [orgLevelPath, setOrgLevelPath] = useRecoilState(orgLevelPathState);
  const orgTree = useRecoilValue(orgTreeAtom);
  const { removeValueFromFilter } = useDbdGeneralFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const kshirutType = useRecoilValue(kshirutTypeState);

  const orgLevelFromDynamicScreen = location.state
    ?.OrgLevel as OrganizationalLevel;
  // TODO: maybe use this instead of the atom
  // currently this here makes sure the fetch happens
  const { data: dashboardEquipments } = useGetDashboardEquipments(
    orgLevelFromDynamicScreen ?? orgTree
  );

  const isRoutineTree =
    orgTree && orgTree[OrgLevelCode.TREE_TYPE][0]?.value === ROUTINE_TREE_TYPE;

  const cleanFilters = () => {
    removeValueFromFilter("secPlatform", [location.state?.code].flat());
  };

  const handlePathClick = (hierLevel: HierLevel) => {
    cleanFilters();

    setFamiliesPath((prevPath) => {
      const path = { ...prevPath };

      Object.keys(path).forEach((key) => {
        if (Number(key) > Number(hierLevel)) {
          path[key] = null;
        } else if (Number(key) === Number(hierLevel)) {
          path[key] = {
            ...path[key],
            optionalDesc: null,
            code: null,
          };
        }
      });

      return path;
    });
    navigate(`../${SitePaths.TOP_VIEW_FAMILIES}`, {
      state: {
        fromEquipListTo: hierLevel,
      },
    });
  };

  return (
    <div className="equipment-list">
      {location.state?.code && (
        <TopViewPath
          path={familiesPath}
          onTopViewPathChange={handlePathClick}
          onTopViewTagClick={() => cleanFilters()}
        />
      )}

      <DashboardTitle title="רשימת כלים" subTitle={kshirutType.label} />
      <DashboardGeneralTable
        isEquipmentTable
        hideColumns={hideColumns.filter((columnName) =>
          !location.state
            ? true
            : !location?.state.visibleColumns?.includes(columnName)
        )}
      />
    </div>
  );
};
export default DbEquipmentList;
