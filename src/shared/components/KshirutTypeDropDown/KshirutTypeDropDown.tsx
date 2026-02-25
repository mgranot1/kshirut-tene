import { useState } from "react";
import { useRecoilState } from "recoil";
import {
  kshirutOption,
  KshirutType,
  kshirutTypeState,
} from "../../../dashboard/stores/kshirutType.store";
import DashboardDropdown from "../DashboardDropdown/DashboardDropdown";

const kshirutOptions: kshirutOption[] = [
  { value: KshirutType.War, label: "כשירות מלחמה" },
  { value: KshirutType.Routine, label: "כשירות שגרה" },
];

const KshirutTypeDropDown = () => {
  const [kshirutType, setKshirutType] = useRecoilState(kshirutTypeState);
  const [open, setOpen] = useState<boolean>(false);

  const handleSelect = (newValue) => {
    setKshirutType(newValue);
  };

  return (
    <div>
      <DashboardDropdown
        style={"expandMore"}
        placeholder={"סוג כשירות"}
        values={[kshirutType]}
        options={kshirutOptions}
        onSelect={handleSelect}
        autocomplete={false}
        resettable={false}
        title={kshirutType.label}
        open={open}
        onLabelClick={setOpen}
        onOuterClick={() => setOpen(false)}
      />
    </div>
  );
};

export default KshirutTypeDropDown;
