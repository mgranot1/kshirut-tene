import { useMemo } from "react";
import deleteIcon from "../../../assets/report/DeleteIcon.svg";
import minusIcon from "../../../assets/report/MinusIcon.svg";
import plusIcon from "../../../assets/report/PlusIcon.svg";
import { MAX_LENGTH_DESCRIPTION } from "../../../routes/report/FaultHhEmz";
import { IDropDownOption } from "../../../shared/types/general.types";
import { IMeanErr, MaterialTypes } from "../../../shared/types/mean.types";
import "../../../styles/components/report/reportFault/MissingPartUnit.scss";
import DropDownInput from "../../shared/DropDownInput";
import { IHHErr } from "../../types/hh.types";

const MAX_LENGTH = 9;

export enum MissingPartErrors {
  duplicate = "מקט כפול",
  nonExistent = 'מק"ט לא קיים',
  withoutMatnr = 'דיווח חוסר ללא מק"ט',
}

interface IMissingPartUnitProps {
  unit: IMeanErr | IHHErr;
  index: number;
  setLocalMaterial:
    | React.Dispatch<React.SetStateAction<IMeanErr[]>>
    | React.Dispatch<React.SetStateAction<IHHErr[]>>;
  disabled: boolean;
  unitType: "hh" | "emz";
  options: IDropDownOption[];
  onMaterialNumberEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setDataChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const MissingPartUnit = ({
  unit,
  setLocalMaterial,
  index,
  disabled,
  unitType,
  options,
  onMaterialNumberEnter,
  setDataChanged,
}: IMissingPartUnitProps) => {
  const digitRegex = /^[0-9]*$/;

  const setMissingPartField = (text: string | number, key: string) => {
    setLocalMaterial((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        [key]: text,
        isEdited: true,
      },
      ...prev.slice(index + 1),
    ]);
  };

  const deleteMissingPart = () => {
    setLocalMaterial((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
    setDataChanged(true);
  };

  const errorText: string = useMemo(() => {
    if (!unit.isEmpty && unit.isDuplicateMkt) {
      return MissingPartErrors.duplicate;
    } else if (
      unitType === "hh" &&
      !unit.isEmpty &&
      !unit.isValid &&
      unit.material !== ""
    ) {
      return MissingPartErrors.nonExistent;
    } else if (
      !unit.isEmpty &&
      !unit.isValid &&
      unit.material === "" &&
      unit.missingParts === MaterialTypes.Missing
    ) {
      return MissingPartErrors.withoutMatnr;
    }

    return "";
  }, [unit]);

  const editMaterialIsDisabled =
    disabled ||
    (unitType === "hh" &&
      !!unit.sequenceNumber && // hh saved
      unit.missingParts == MaterialTypes.Missing &&
      unit.isValid);

  const editStatusIsDisabled =
    disabled || (unit.material === "" && unit.materialDesc === "");

  return (
    <div className="missingPart ">
      <div className={`missingPart__top ${unit.isEmpty && "mustField"}`}>
        <input
          placeholder="הקלידו מקט..."
          className="missingPart__input missingPart__input--material"
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              onMaterialNumberEnter?.(e);
            }
          }}
          onChange={(e) => {
            if (
              e.currentTarget.value.length > MAX_LENGTH ||
              !new RegExp(digitRegex).test(e.currentTarget.value)
            )
              return;
            setMissingPartField(e.target.value, "material");
          }}
          inputMode="numeric"
          value={unit.material}
          disabled={editMaterialIsDisabled}
        />
        <span className="missingPart__input missingPart__input--dbdec">
          {unit.materialDbDesc ? " - " + unit.materialDbDesc : ""}
        </span>
        {<p className="missingPart__error">{errorText}</p>}
        <input
          placeholder="הקלידו תיאור..."
          className="missingPart__input desc"
          onChange={(e) => {
            setMissingPartField(e.target.value, "materialDesc");
          }}
          value={unit.materialDesc}
          disabled={disabled}
          type="text"
          maxLength={MAX_LENGTH_DESCRIPTION}
        />
      </div>
      <div className="missingPart__bottom">
        <div
          className={`${
            unit.missingParts ? "missingPart__status" : "missingPart__noStatus"
          }`}
        >
          <DropDownInput
            label={unit.missingParts ? "" : "בחר סטטוס"}
            onChange={(val) =>
              setMissingPartField(val.toString(), "missingParts")
            }
            value={unit.missingParts}
            options={options.filter(
              (i) =>
                i.value === MaterialTypes.Missing ||
                i.value === MaterialTypes.NoStatus
            )}
            disabled={editStatusIsDisabled}
          />
        </div>
        <div className="missingPart__sum">
          <button
            className="missingPart__btn"
            onClick={() =>
              setMissingPartField(Number(unit.quantity) + 1, "quantity")
            }
            disabled={disabled}
          >
            <img src={plusIcon} className="missingPart__icon" />
          </button>
          <div className="missingPart_number">{unit.quantity}</div>
          <button
            className="missingPart__btn"
            onClick={() => {
              unit.quantity > 1 &&
                setMissingPartField(Number(unit.quantity) - 1, "quantity");
            }}
            disabled={disabled}
          >
            <img src={minusIcon} className="missingPart__icon" />
          </button>
          <button
            className="missingPart__btn"
            onClick={deleteMissingPart}
            disabled={disabled}
          >
            <img src={deleteIcon} className="missingPart__icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default MissingPartUnit;
