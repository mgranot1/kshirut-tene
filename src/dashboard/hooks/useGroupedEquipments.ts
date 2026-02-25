import { isEquipmentNotKashir } from "../../shared/utils/kshirut.utils";
import { OrgLevelFieldName } from "../components/KshirutFamilyCard/KshirutFamilyCard";
import { KshirutType } from "../stores/kshirutType.store";
import { OrgLevelOptions } from "../stores/nextOrgLevel.store";
import { OrgLevelCode } from "../types/dashboardOrgLevel.types";
import { IOptionVal } from "../types/filters.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";
import { useOptionsFromColumn } from "./useOptionsFromColumn";

export type GroupedEquipments = {
  [key: string]: {
    equipments: GeneralDashboardTableRow[];
    notKashirAmount: number;
  };
};

export const useGroupedEquipments = () => {
  const { getOptionsFromColumn } = useOptionsFromColumn();

  const groupedEquipmentsByFamilies = (
    equipments: GeneralDashboardTableRow[],
    kshirutType: KshirutType
  ): GroupedEquipments => {
    const groupedEquipments = {} as GroupedEquipments;

    const families = [
      ...(getOptionsFromColumn(["materialFamily"], false) as IOptionVal[]),
      ...(getOptionsFromColumn(["mainPlatform"], false) as IOptionVal[]),
      ...(getOptionsFromColumn(["secPlatform"], false) as IOptionVal[]),
      ...(getOptionsFromColumn(["material"], false) as IOptionVal[]),
    ];

    families?.forEach((family) => {
      groupedEquipments[family.value as string] = {
        equipments: [],
        notKashirAmount: 0,
      };
    });

    equipments.forEach((equipment) => {
      const notKashir = isEquipmentNotKashir(equipment, kshirutType);

      // Family
      groupedEquipments[equipment.materialFamily] = groupedEquipments[
        equipment.materialFamily
      ] || {
        equipments: [],
        notKashirAmount: 0,
      };
      groupedEquipments[equipment.materialFamily].equipments.push(equipment);
      notKashir &&
        groupedEquipments[equipment.materialFamily].notKashirAmount++;

      // Main platform
      groupedEquipments[equipment.mainPlatform] = groupedEquipments[
        equipment.mainPlatform
      ] || {
        equipments: [],
        notKashirAmount: 0,
      };
      groupedEquipments[equipment.mainPlatform].equipments.push(equipment);
      notKashir && groupedEquipments[equipment.mainPlatform].notKashirAmount++;

      // Secondary platform
      groupedEquipments[equipment.secPlatform] = groupedEquipments[
        equipment.secPlatform
      ] || {
        equipments: [],
        notKashirAmount: 0,
      };
      groupedEquipments[equipment.secPlatform].equipments.push(equipment);
      notKashir && groupedEquipments[equipment.secPlatform].notKashirAmount++;
      // Material
      groupedEquipments[equipment.material] = groupedEquipments[
        equipment.material
      ] || {
        equipments: [],
        notKashirAmount: 0,
      };
      groupedEquipments[equipment.material].equipments.push(equipment);
      notKashir && groupedEquipments[equipment.material].notKashirAmount++;
    });
    

    return groupedEquipments;
  };

  const groupedEquipmentsByOrgLevel = (
    equipmentsOfFamily: GeneralDashboardTableRow[],
    isRoutineTree: boolean,
    kshirutType: KshirutType,
    nextOrgLevel: OrgLevelOptions,
    hierLevel?: OrgLevelCode
  ): GroupedEquipments => {
    const groupedEquipments = {} as GroupedEquipments;

    const orgsFromData =
      (hierLevel ?? nextOrgLevel.levelCode) === OrgLevelCode.GDUD
        ? [
            ...(getOptionsFromColumn(["routineTplnr"], false) as IOptionVal[]),
            ...(getOptionsFromColumn(["warTplnr"], false) as IOptionVal[]),
          ]
        : [
            ...(getOptionsFromColumn(
              [OrgLevelFieldName[hierLevel ?? nextOrgLevel.levelCode]],
              false
            ) as IOptionVal[]),
          ];

    const existOrgs = orgsFromData.map((o) =>
      isRoutineTree ? o.value : Number(o.value).toString()
    );

    nextOrgLevel.options
      ?.filter((o) =>
        existOrgs.includes(
          isRoutineTree ||
            (!isRoutineTree &&
              (hierLevel ?? nextOrgLevel.levelCode) === OrgLevelCode.GDUD)
            ? o.funcLoc
            : o.objid.toString()
        )
      )
      ?.forEach((orgLevel) => {
        const orgLevelCode =
          !isRoutineTree && nextOrgLevel.levelCode !== OrgLevelCode.GDUD
            ? orgLevel.objid
            : orgLevel.funcLoc;

        groupedEquipments[orgLevelCode] = {
          equipments: [],
          notKashirAmount: 0,
        };
      });

    equipmentsOfFamily.forEach((equipment) => {
      let orgLevelCode: string;

      if (
        (hierLevel ?? nextOrgLevel.levelCode) === OrgLevelCode.GDUD &&
        !isRoutineTree
      ) {
        orgLevelCode = equipment.warTplnr
          ? equipment.warTplnr
          : equipment.routineTplnr;
      } else {
        orgLevelCode = isRoutineTree
          ? equipment[OrgLevelFieldName[hierLevel ?? nextOrgLevel.levelCode]]
          : Number(
              equipment[OrgLevelFieldName[hierLevel ?? nextOrgLevel.levelCode]]
            );
      }

      // adds zadiks of all releant simuls to one column (relevant by simul toari pair)
      if ((hierLevel ?? nextOrgLevel.levelCode) === OrgLevelCode.GDUD) {
        const curr = nextOrgLevel.options?.find((o) =>
          o.relevantSimuls?.includes(orgLevelCode)
        );
        orgLevelCode = curr ? curr.funcLoc : orgLevelCode;
      }

      groupedEquipments[orgLevelCode] = groupedEquipments[orgLevelCode] || {
        equipments: [],
        notKashirAmount: 0,
      };

      groupedEquipments[orgLevelCode].equipments.push(equipment);
      isEquipmentNotKashir(equipment, kshirutType) &&
        groupedEquipments[orgLevelCode].notKashirAmount++;
    });
    return groupedEquipments;
  };

  return { groupedEquipmentsByFamilies, groupedEquipmentsByOrgLevel };
};
