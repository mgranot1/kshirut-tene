import OrgLevelImg from "@assets/report/orgLevel.svg";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlertify } from "../../../contexts/AlertContext";
import { OrgLevelCode } from "../../../dashboard/types/dashboardOrgLevel.types";
import { SitePaths } from "../../../router/routes";
import GeneralButton from "../../../shared/components/GeneralButton/GeneralButton";
import Loader from "../../../shared/components/Loader/Loader";
import { useGetOperations } from "../../../shared/services/tsavIrgunService/useGetOperations";
import { useGetTsavIrgun } from "../../../shared/services/tsavIrgunService/useGetTsavIrgun";
import { IDropDownOption, IOption } from "../../../shared/types/general.types";
import { ITsavIrgunLevel } from "../../../shared/types/tsavIrgun.types";
import { checkTreeCompletes } from "../../../shared/utils/orgLevel.utils";
import DropDownInput from "../../components/DropDownInput/DropDownInput";
import EntryHeader from "../../components/EntryHeader/EntryHeader";
import { useUserUnit } from "../../hooks/useUserUnit";
import "./OrgLevelSelect.scss";

type SelectableLevels = Exclude<OrgLevelCode, OrgLevelCode.TREE_TYPE>;

type LevelCodeDesc = { [key in SelectableLevels]: string };

export const levelCodeDesc: LevelCodeDesc = {
  [OrgLevelCode.PIKUD]: "פיקוד",
  [OrgLevelCode.UTZVA]: "חטיבה",
  [OrgLevelCode.UGDA]: "אוגדה",
  [OrgLevelCode.GDUD]: "גדוד",
};

type ILevels = { [key in SelectableLevels]: ITsavIrgunLevel | undefined };

interface ILevelInput {
  type: SelectableLevels;
  options: ITsavIrgunLevel[];
}

type SeparatedTsavsByHier = { [key in SelectableLevels]: ITsavIrgunLevel[] };

const emptyOrgLevelInput: ILevels = {
  1: undefined,
  2: undefined,
  3: undefined,
  4: undefined,
};
const emptyLevelsInputs: ILevelInput[] = [
  { type: OrgLevelCode.PIKUD, options: [] },
  { type: OrgLevelCode.UGDA, options: [] },
  { type: OrgLevelCode.UTZVA, options: [] },
  { type: OrgLevelCode.GDUD, options: [] },
];

const OrgLevelSelect = () => {
  const { state } = useLocation();
  const [userUnit, setUserUnit] = useUserUnit();
  const [orgLevelInput, setOrgLevelInput] =
    useState<ILevels>(emptyOrgLevelInput);

  const [currOperation, setCurrOperation] = useState<string>("");
  const { alertify } = useAlertify();

  const { data: operations } = useGetOperations();

  const {
    data: tsavIrgunData,
    isPending: tsavFetchIsPending,
    isSuccess: tsavFetchIsSuccess,
  } = useGetTsavIrgun(currOperation);

  const separateTsavsByHier = (
    tsavs: ITsavIrgunLevel[]
  ): SeparatedTsavsByHier => {
    const separatedTsavs: SeparatedTsavsByHier = {} as SeparatedTsavsByHier;

    tsavs.forEach((tsav) => {
      if (!Array.isArray(separatedTsavs[tsav.hierLevel]))
        separatedTsavs[tsav.hierLevel] = [];
      separatedTsavs[tsav.hierLevel].push(tsav);
    });

    return separatedTsavs;
  };

  const removeOperationNameFromPikudInWar = (
    unsortedTsavs: ITsavIrgunLevel[],
    operation?: string,
    operationOptions?: IOption[]
  ): ILevelInput[] => {
    const separatedTsavsByHier = separateTsavsByHier(unsortedTsavs);

    return emptyLevelsInputs.map((l) => {
      let options = separatedTsavsByHier[l.type];

      // Remove operation name from Pikud
      if (operation && l.type === OrgLevelCode.PIKUD) {
        const operLabel = operationOptions?.find((o) => o.value === operation);

        if (operLabel) {
          options = options.map((o) => ({
            ...o,
            funcLocDesc: o.funcLocDesc
              .replace(operLabel.label, "")
              .replace("-", ""),
          }));
        }
      }

      return { ...l, options: [...options] };
    });
  };

  // By "trimming" the tree, we mean to remove any path in the tree that doesn't end with a simul.
  // For example: the path Pikud1 -> Ugda1 will be removed (if we assume that Ugda1 has no Utzva/Simul children)
  const trimTsavTree = useMemo(() => {
    if (!tsavIrgunData) return emptyLevelsInputs;

    const completableLevels = tsavIrgunData.filter((l) =>
      checkTreeCompletes(tsavIrgunData, l)
    );

    return completableLevels.length
      ? removeOperationNameFromPikudInWar(
        completableLevels,
        currOperation,
        operations
      )
      : emptyLevelsInputs;
  }, [tsavIrgunData, currOperation]);

  useEffect(() => {
    completeHierarchyUp();
  }, [trimTsavTree]);

  const navigate = useNavigate();

  const onContinue = () => {
    const lowestKey = Object.keys(orgLevelInput)
      .reverse()
      .find((k) => orgLevelInput[k] !== undefined);

    if (!!currOperation && !lowestKey) {
      alertify({
        messageType: "Error",
        msgContent: { message: "בחר לכל הפחות פיקוד" },
      });

      return;
    }

    setUserUnit((prev) => ({
      ...prev,
      [state.isEmergency ? "emergencyLevel" : "routineLevel"]: lowestKey
        ? orgLevelInput[+lowestKey].funcLoc
        : undefined,
      operationCode: state.isEmergency ? currOperation : prev.operationCode,
      objid: state.isEmergency
        ? lowestKey
          ? orgLevelInput[+lowestKey].objid
          : undefined
        : prev.objid,
      [state.isEmergency ? "emergencyLevelDesc" : "routineLevelDesc"]: lowestKey
        ? orgLevelInput[+lowestKey].funcLocDesc
        : "",
    }));

    setOrgLevelInput(emptyOrgLevelInput);

    if (state.isEmergency && lowestKey && +lowestKey === OrgLevelCode.GDUD) {
      // Case of gdud in emergency
      navigate(`../${SitePaths.GDUD_METAMREN}`);
    } else {
      navigate(`../${SitePaths.ORG_LEVEL}`);
    }
  };

  const completeHierarchyUp = () => {
    const levels: ILevels = { ...emptyOrgLevelInput };

    const currentLevel = trimTsavTree
      .map((l) =>
        l.options.find((o) =>
          state.isEmergency
            ? o.objid === userUnit.objid
            : o.funcLoc === userUnit.routineLevel
        )
      )
      .find((v) => !!v);

    let prevLevel: ITsavIrgunLevel = currentLevel ?? ({} as ITsavIrgunLevel);
    const reversedKeys = Object.keys(levels).reverse();

    // Get data of all prev levels (of curr).
    reversedKeys.forEach((key) => {
      if (currentLevel && +key < +currentLevel?.hierLevel) {
        levels[+key] = trimTsavTree[+key - 1].options.find(
          (l) => l.index === prevLevel.fatherIndex
        );

        prevLevel = levels[key];
      } else if (currentLevel && +key === currentLevel.hierLevel) {
        levels[+key] = currentLevel;
      }
    });

    currentLevel && setOrgLevelInput(() => ({ ...levels }));
  };

  const onOperationChange = (selectedOperation: IDropDownOption["value"]) => {
    setCurrOperation(selectedOperation + "");
    setOrgLevelInput(emptyOrgLevelInput);
  };

  const onOrgLevelChange = (
    type: SelectableLevels,
    newVal: ITsavIrgunLevel | undefined
  ) => {
    setOrgLevelInput((prev) => {
      const levels = { ...prev };
      let currLevel: ITsavIrgunLevel | undefined = undefined;
      let prevKey: string = "";

      for (const key in prev) {
        if (+key === type) {
          currLevel = prev[key];
          levels[key] = newVal;
        } else if (currLevel && prevKey && prev[key] && prev[prevKey]) {
          // Reset values below the selected level
          if (
            !levels[prevKey] ||
            levels[key].fatherIndex !== levels[prevKey].index
          ) {
            levels[key] = undefined;
          }
        }
        prevKey = key;
      }

      return levels;
    });
  };

  const getTsavIrgunOptions = (levelInput: ILevelInput) => {
    return levelInput.options.length > 0
      ? (+levelInput.type - 1 > 0 && orgLevelInput[+levelInput.type - 1]
        ? levelInput.options.filter(
          (o) => o.fatherIndex === orgLevelInput[+levelInput.type - 1].index
        )
        : levelInput.options
      ).map((op) => ({
        label: <div>{op.funcLocDesc}</div>,
        value: state.isEmergency ? op.objid : op.funcLoc,
      }))
      : [];
  };

  useEffect(() => {
    if (state.isEmergency && userUnit.operationCode) {
      setCurrOperation(userUnit.operationCode);
    }
  }, [state, userUnit]);

  return (
    <div className="orgLevelSelect__container">
      {tsavFetchIsPending && <Loader />}
      <EntryHeader
        centerElement={
          <img src={OrgLevelImg} className="orgLevelSelect__img" />
        }
        navigateTo={{ to: SitePaths.ORG_LEVEL }}
      />
      <div className="orgLevelSelect__header">
        <p className="orgLevelSelect__title">בחירת רמה ארגונית</p>
        <p className="orgLevelSelect__subTitle">
          {state.isEmergency ? "ציוות קרבי" : "שגרה"}
        </p>
      </div>
      <div className="orgLevelSelect__content">
        {state.isEmergency && (
          <div className="orgLevelSelect__ddinput">
            <DropDownInput
              label="מבצע"
              value={!!currOperation ? currOperation : "בחירה"}
              onChange={onOperationChange}
              options={
                operations ? [{ label: "", value: "" }, ...operations] : []
              }
            />
          </div>
        )}
        {trimTsavTree.map((input: ILevelInput, i) => (
          <div key={i} className="orgLevelSelect__ddinput">
            <DropDownInput
              label={levelCodeDesc[input.type]}
              value={
                (state.isEmergency
                  ? orgLevelInput[input.type]?.objid
                  : orgLevelInput[input.type]?.funcLoc) ?? "בחירה"
              }
              onChange={(newVal) => {
                const currLevel = input.options.find((o) =>
                  state.isEmergency ? o.objid === newVal : o.funcLoc === newVal
                );
                onOrgLevelChange(input.type, currLevel as ITsavIrgunLevel);
              }}
              disabled={
                (+input.type - 1 > 0 && !orgLevelInput[+input.type - 1]) ||
                (state.isEmergency && !currOperation)
              }
              options={[
                { label: "", value: "" },
                ...getTsavIrgunOptions(input),
              ]}
            />
          </div>
        ))}
      </div>
      <Box sx={{ flexGrow: 1 }}></Box>
      <div className="orgLevelSelect__button">
        <GeneralButton text="המשך" onClick={onContinue} />
      </div>
    </div>
  );
};
export default OrgLevelSelect;
