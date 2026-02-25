import ArrowIcon from "@mui/icons-material/ArrowBackIos";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SitePaths } from "../../../router/routes";
import GeneralButton from "../../../shared/components/GeneralButton/GeneralButton";
import Loader from "../../../shared/components/Loader/Loader";
import { useUpdateIsManeuveringGdud } from "../../../shared/services/tsavIrgunService/useUpdateIsManeuveringGdud";
import { ITsavIrgunLevel } from "../../../shared/types/tsavIrgun.types";
import { useUserUnit } from "../../hooks/useUserUnit";
import { useCreateUserUnit } from "../../services/userUnit/useCreateUserUnit";
import { maneuveringGdudState } from "../../stores/maneuveringGdud.store";
import "./OrgLevel.scss";

export interface IOrgLevel {
  routineLevel: ITsavIrgunLevel | null;
  objid: ITsavIrgunLevel | null;
}

export interface ILevelInput {
  key: keyof IOrgLevel;
  label: string;
  desc: string;
}

const OrgLevel = () => {
  const [userUnit] = useUserUnit();
  const [maneuveringGdud, setManeuveringGdud] =
    useRecoilState(maneuveringGdudState);
  const navigate = useNavigate();
  const onUpdateIsManeuveringGdudSuccess = () => {
    setManeuveringGdud(undefined);
  };

  const onCreateUserUnitSuccess = () => {
    maneuveringGdud &&
      maneuveringGdud.isChanged &&
      mutateUpdateIsManeuveringGdud({
        gdud: maneuveringGdud.gdud,
        isManeuvering: maneuveringGdud.isManeuvering,
      });
    navigate(`../${SitePaths.HOME}`);
  };

  const { mutate: mutateUpdateIsManeuveringGdud } = useUpdateIsManeuveringGdud({
    onSuccess: onUpdateIsManeuveringGdudSuccess,
  });

  const {
    mutate: mutateCreateUserUnit,
    isPending: isMutateCreateUserUnitPending,
  } = useCreateUserUnit({
    onSuccess: onCreateUserUnitSuccess,
  });

  const levelsInputs: ILevelInput[] = [
    { key: "routineLevel", desc: "routineLevelDesc", label: "שגרה" },
    { key: "objid", desc: "emergencyLevelDesc", label: "ציוות קרבי" },
  ];

  const onContinue = () => {
    mutateCreateUserUnit();
  };

  const navigateToSelect = (orgLevel: keyof IOrgLevel) => {
    navigate(`../${SitePaths.ORG_LEVEL_SELECT}`, {
      state: { isEmergency: orgLevel === "objid" },
    });
  };

  const getInputDescription = (input: ILevelInput) => {
    if (!userUnit[input.key] || userUnit[input.key] === "00000000") {
      return "בחירה";
    }
    return userUnit[input.desc];
  };

  return (
    <div className="orgLevel__container">
      {isMutateCreateUserUnitPending && <Loader />}
      <div className="orgLevel__header">
        <p className="orgLevel__title">נבחר את היחידה שאנחנו אחראיים עליה</p>
        <p className="orgLevel__subTitle">
          תמיד ניתן לחזור לשנות את הבחירה שלך.
        </p>
      </div>
      <div className="orgLevel__select">
        <span className="orgLevel__text">בחירת רמה ארגונית</span>
        <div className="orgLevel__content">
          {levelsInputs.map((input) => (
            <div
              className="orgLevel__input"
              key={input.key}
              onClick={() => navigateToSelect(input.key)}
            >
              <span className="orgLevel__label">{input.label}</span>
              <div className="orgLevel__val">
                <span className="orgLevel__val--txt">
                  {getInputDescription(input)}
                </span>
                <ArrowIcon sx={{ fontSize: "0.8rem", color: "black" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Box className="orgLevel__spacer"></Box>
      <div className="orgLevel__button">
        <GeneralButton
          text="סיימתי!"
          onClick={onContinue}
          disabled={!userUnit.objid && !userUnit.routineLevel}
        />
      </div>
    </div>
  );
};
export default OrgLevel;
