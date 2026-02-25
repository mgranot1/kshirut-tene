import ArrowIcon from "@mui/icons-material/ArrowBackIos";
import { ReactNode, useCallback, useState } from "react";
import DropDown from "../../../shared/components/DropDown/DropDown";
import { IDropDownOption } from "../../../shared/types/general.types";
import "./DropDownInput.scss";

interface IDropDownInputProps {
  label: string;
  value: IDropDownOption["value"];
  onChange: (val: IDropDownOption["value"]) => void;
  options: IDropDownOption[];
  renderLabel?: (option: IDropDownOption) => string | ReactNode;
  disabled?: boolean;
}

const DropDownInput = ({ disabled = false, ...props }: IDropDownInputProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const findLabel = useCallback(
    (val: IDropDownOption["value"]) => {
      return props.options?.find((o) => o.value === val)?.label ?? "";
    },
    [props.options, props.value]
  );

  return (
    <>
      <div
        className="ddInput"
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className="ddInput--label">{props.label}</span>
        <div className="ddInput--val">
          <span className="ddInput--val__txt">{findLabel(props.value)}</span>
          <ArrowIcon
            sx={{
              fontSize: "0.8rem",
              color: `${disabled ? "#C5CFD8" : "black"}`,
            }}
          />
        </div>
      </div>

      {open && (
        <DropDown
          open={open}
          title={props.label}
          optionList={props.options}
          setOpen={setOpen}
          onSelect={(option: IDropDownOption) => {
            props.onChange(option.value);
          }}
        />
      )}
    </>
  );
};

export default DropDownInput;
