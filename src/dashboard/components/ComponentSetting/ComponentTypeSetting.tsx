import type { Dispatch, SetStateAction } from "react";
import { ComponentType, type TComponentSetting } from "../../types/component.types";
import "./ComponentTypeSetting.scss";
import { COMPONENT_OPTIONS } from "./ComponentSetting.constants";

interface IComponentTypeSettingProps {
  componentSettingForm: TComponentSetting;
  setComponentSettingForm: Dispatch<SetStateAction<TComponentSetting>>;
}



const ComponentTypeSetting = ({
  componentSettingForm,
  setComponentSettingForm,
}: IComponentTypeSettingProps) => {
  const handleSelectType = (type: ComponentType) => {
    setComponentSettingForm((prev) => ({
      ...prev,
      type,
    }));
  };

  return (
    <div className="component-type">
      <div className="component-type__title">
        יש לבחור את סוג הגרף או המדד אותו נרצה להוסיף למסך
      </div>
      <div className="component-type__options">
        {COMPONENT_OPTIONS.map((option) => (
          <div
            key={option.type}
            className={`${option.className} component-type__option ${componentSettingForm.type === option.type ? "selected" : ""
              }`}
            onClick={() => handleSelectType(option.type)}
          >
            <p className="component-type__title">{option.title}</p>
            <p className="component-type__subTitle">{option.subtitle}</p>
            {option.preview}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentTypeSetting;
