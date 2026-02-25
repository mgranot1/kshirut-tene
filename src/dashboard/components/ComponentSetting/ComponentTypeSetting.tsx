import { Dispatch, SetStateAction } from "react";
import KshirutPieGraph from "../../../report/components/PieGraph/KshirutPieGraph";
import PieWithExpectedGraph from "../../../report/components/PieWithExpectedGraph/PieWithExpectedGraph";
import FreeTextCard from "../FreeTextCard/FreeTextCard";
import { ComponentType, TComponentSetting } from "../../types/component.types";
import "./ComponentTypeSetting.scss";

interface IComponentTypeSettingProps {
  componentSettingForm: TComponentSetting;
  setComponentSettingForm: Dispatch<SetStateAction<TComponentSetting>>;
}

const ComponentTypeSetting = ({
  componentSettingForm,
  setComponentSettingForm,
}: IComponentTypeSettingProps) => {
  return (
    <div className="component-type">
      <div className="component-type__title">
        יש לבחור את סוג הגרף או המדד אותו נרצה להוסיף למסך
      </div>
      <div className="component-type__options">
        <div
          className={`component-type__pieGraph component-type__option ${componentSettingForm["type"] === ComponentType.Pie && "selected"
            }`}
          onClick={() => {
            setComponentSettingForm((prev) => ({
              ...prev,
              type: ComponentType.Pie,
            }));
          }}
        >
          <p className="component-type__title">כשירות כלים</p>
          <p className="component-type__subTitle">
            הגרף מציג את אחוז ומספר כשירות הכלים
          </p>
          <KshirutPieGraph
            totalEquipmentsCount={100}
            kashirEquipmentsCount={20}
          />
        </div>
        <div
          className={`component-type__developementGraph component-type__option ${componentSettingForm["type"] === ComponentType.PieWithExpected &&
            "selected"
            }`}
          onClick={() =>
            setComponentSettingForm((prev) => ({
              ...prev,
              type: ComponentType.PieWithExpected,
            }))
          }
        >
          <p className="component-type__title">כשירות כלים וצפי כשירות</p>
          <p className="component-type__subTitle">
            הגרף מציג את אחוז ומספר כשירות הכלים
          </p>

          {/* TODO: kshirut type */}
          <PieWithExpectedGraph
            componentId=""
            kshirutData={{
              kashir: 20,
              total: 100,
              kashirOn24: 50,
              kashirOn48: 70,
              kashirOn72: 98,
            }}
          />
        </div>
        <div
          className={`component-type__freeText component-type__option ${componentSettingForm["type"] === ComponentType.FreeText && "selected"
            }`}
          onClick={() =>
            setComponentSettingForm((prev) => ({
              ...prev,
              type: ComponentType.FreeText,
            }))
          }
        >
          <p className="component-type__title">טקסט חופשי</p>
          <p className="component-type__subTitle">
            רכיב טקסט חופשי עם אפשרויות עיצוב - גודל, צבע, יישור ועוד
          </p>
          <div className="component-type__freeText-preview">
            <FreeTextCard
              data={{
                content: "דוגמה לטקסט חופשי",
                fontSize: 18,
                fontWeight: "bold",
                color: "#374768",
                backgroundColor: "#f5f5f5",
                textAlign: "right",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentTypeSetting;
