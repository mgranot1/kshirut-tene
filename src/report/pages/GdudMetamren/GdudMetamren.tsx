import TimrunPic from "@assets/report/timrun3.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SitePaths } from "../../../router/routes";
import { useGetIsManeuveringGdud } from "../../../shared/services/tsavIrgunService/useGetIsManeuveringGdud";
import EntryHeader from "../../components/EntryHeader/EntryHeader";
import { useUserUnit } from "../../hooks/useUserUnit";
import { useUpdateViewOnLoad } from "../../services/view/useUpdateView";
import { maneuveringGdudState } from "../../stores/maneuveringGdud.store";
import { LogTypes } from "../../types/log.types";
import "./GdudMetamren.scss";

const GdudMetamren = () => {
  const [userUnit] = useUserUnit();
  const [maneuveringGdud, setManeuveringGdud] =
    useRecoilState(maneuveringGdudState);
  const navigate = useNavigate();

  const onSuccessGetIsManeuveringWarGdud = (isManeuveringGdud: boolean) => {
    setManeuveringGdud({
      gdud: userUnit.emergencyLevel,
      isManeuvering: isManeuveringGdud,
      isChanged: false,
    });
  };

  const { mutate: mutateIsManeuveringWarGdud } = useGetIsManeuveringGdud({
    onSuccess: onSuccessGetIsManeuveringWarGdud,
  });

  useUpdateViewOnLoad(LogTypes.Gdud, userUnit.emergencyLevel);

  const onSelect = (isManeuvering: boolean) => {
    setManeuveringGdud({
      gdud: userUnit?.emergencyLevel,
      isManeuvering: isManeuvering,
      isChanged: true,
    });
    navigate(`../${SitePaths.ORG_LEVEL}`);
  };

  useEffect(() => {
    mutateIsManeuveringWarGdud({ tplnr: userUnit.emergencyLevel });
  }, []);

  return (
    <div className="metamren__container">
      <EntryHeader
        centerElement={
          <div className="metamren__header">
            <p className="metamren__title">הגדרת הגדוד</p>
            <p className="metamren__subTitle">{`${userUnit.emergencyLevel} - ${userUnit.emergencyLevelDesc}`}</p>
          </div>
        }
        navigateTo={{
          to: SitePaths.ORG_LEVEL_SELECT,
          options: { state: { isEmergency: 1 === 1 } },
        }}
      />
      <p className="metamren__text">האם הגדוד בלחימה?</p>
      <div className="metamren__options">
        <button
          className={`metamren_button ${maneuveringGdud?.isManeuvering ? "clicked" : ""}`}
          onClick={(_) => onSelect(true)}
        >
          כן
        </button>
        <button
          className={`metamren_button ${
            maneuveringGdud?.isManeuvering ||
            maneuveringGdud?.isManeuvering === undefined
              ? ""
              : "clicked"
          }`}
          onClick={(_) => onSelect(false)}
        >
          לא
        </button>
      </div>
      <div className="metamren__img">
        <img src={TimrunPic} />
      </div>
    </div>
  );
};

export default GdudMetamren;
