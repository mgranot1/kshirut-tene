import { useRecoilValue } from "recoil";
import DashboardGeneralTable from "../../components/DashboardGeneralTable/DashboardGeneralTable";
import DashboardTitle from "../../components/layout/DashboardTitle/DashboardTitle";
import useGetDashboardEquipments from "../../services/dashboard/useGetDashboardEquipments";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";

const hideColumns = [
  "description",
  "materialFamily",
  "mainPlatform",
  "secPlatform",
  "warKshirut",
  "kshirut",
  "routineTplnr",
  "warTplnr",
  "isGdudManeuvering",
  "warStatus",
  "job",
  "pluga",
  "forces",
  "lastUpdateTimestamp",
  "pikud",
  "ugda",
  "utzva",
  "maamad",
  "purpose",
  "equipmentTask",
  "decidingNonKshirutCause",
  "tags",
];

const DbFaultList = () => {
  const kshirutType = useRecoilValue(kshirutTypeState);
  const orgTree = useRecoilValue(orgTreeAtom);

  // TODO: maybe use this instead of the atom
  // currently this here makes sure the fetch happens
  const { data: dashboardEquipments } = useGetDashboardEquipments(orgTree);

  return (
    <div className="fault-list">
      <DashboardTitle title="רשימת תקלות" subTitle={kshirutType.label} />
      <DashboardGeneralTable
        hideColumns={hideColumns}
        isEquipmentTable={false}
        tableId={"dashboardFaultTable"}
      />
    </div>
  );
};
export default DbFaultList;
