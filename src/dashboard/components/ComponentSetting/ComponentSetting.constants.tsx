import { ComponentSettingMode } from "../../stores/componentSettingMode.store";
import type {
  RangePercent,
  TComponentSetting,
} from "../../types/component.types";
import { ComponentType } from "../../types/component.types";
import { emptyOrganizationalLevel } from "../../types/dashboardOrgLevel.types";
import KshirutPieGraph from "../../../report/components/PieGraph/KshirutPieGraph";
import PieWithExpectedGraph from "../../../report/components/PieWithExpectedGraph/PieWithExpectedGraph";
import FreeTextCard from "../FreeTextCard/FreeTextCard";

type ComponentOption = {
  type: ComponentType;
  className: string;
  title: string;
  subtitle: string;
  preview: React.ReactNode;
};

export const DEFAULT_COMPONENT_SETTING_FORM: TComponentSetting = {
  id: "",
  name: "",
  type: ComponentType.Pie,
  compColumn: 0,
  compRow: 0,
  orgLevel: { ...emptyOrganizationalLevel },
  filters: [],
  rangePercent: {
    toSevereThreshold: 60,
    toWarningThreshold: 80,
  } as RangePercent,
};

export const FILTER_STEP_TITLES = {
  [ComponentSettingMode.View]: "הגדרות רכיב",
  [ComponentSettingMode.Edit]: "הגדרת רכיב",
  [ComponentSettingMode.New]: "הגדרת רכיב חדש",
} as const;

export const COMPONENT_OPTIONS: ComponentOption[] = [
  {
    type: ComponentType.Pie,
    className: "component-type__pieGraph",
    title: "כשירות כלים",
    subtitle: "הגרף מציג את אחוז ומספר כשירות הכלים",
    preview: (
      <KshirutPieGraph
        totalEquipmentsCount={100}
        kashirEquipmentsCount={20}
      />
    ),
  },
  {
    type: ComponentType.PieWithExpected,
    className: "component-type__developementGraph",
    title: "כשירות כלים וצפי כשירות",
    subtitle: "הגרף מציג את אחוז ומספר כשירות הכלים",
    preview: (
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
    ),
  },
  {
    type: ComponentType.FreeText,
    className: "component-type__freeText",
    title: "טקסט חופשי",
    subtitle: "רכיב טקסט חופשי עם אפשרויות עיצוב - גודל, צבע, יישור ועוד",
    preview: (
      <div className="component-type__freeText-preview">
        <FreeTextCard
          data={{
            htmlContent: '<span style="color: #374768; font-weight: bold;">דוגמה לטקסט חופשי</span>',
            defaultFontSize: 18,
            defaultAlign: "right",
          }}
        />
      </div>
    ),
  },
];
