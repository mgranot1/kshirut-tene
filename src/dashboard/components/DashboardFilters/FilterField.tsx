import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo } from "react";
import { IFilterField } from "../../types/filters.types";
import "./FilterField.scss";
import FilterOptions from "./FilterOptions";

interface IFilterFieldProps<T> {
  field: IFilterField<T>;
  changeField: (
    fieldName: string,
    fieldOption: string,
    value: string | boolean | Date | number
  ) => void;
  changeExpanded: (fieldName: string) => void;
  disabled?: boolean;
}

function FilterField<T>({ disabled = false, ...props }: IFilterFieldProps<T>) {
  const numberSelected = useMemo<number>(() => {
    return props.field.options.reduce(
      (acc, curr) => acc + (curr.isSelected ? 1 : 0),
      0
    );
  }, [props.field]);

  return (
    <div className="FilterField">
      <div
        className={`FilterField__header ${disabled && "disabled"}`}
        onClick={() =>
          !disabled && props.changeExpanded(props.field.fieldTitle)
        }
      >
        <div className={`FilterField__title `}>{props.field.fieldTitle}</div>
        <div className="FilterField__expandIcon">
          {numberSelected !== 0 && (
            <div className="FilterField__selectedNumTag">{numberSelected}</div>
          )}
          {props.field.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
      </div>
      {props.field.isExpanded && (
        <div className="FilterField__options">
          <FilterOptions field={props.field} changeField={props.changeField} />
        </div>
      )}
    </div>
  );
}

export default FilterField;
