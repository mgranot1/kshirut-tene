import { MenuItem, Select } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { IOption } from "../../../shared/types/general.types";
import { IField } from "./FormBuilder";

type SelectFormFieldProps = {
  field: IField;
  control: Control<any>;
};

const SelectFormField = (props: SelectFormFieldProps) => {
  const { name, readOnly, options, rules } = props.field;

  return (
    <Controller
      key={name}
      name={name}
      control={props.control}
      disabled={readOnly}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Select
          className={`select ${readOnly ? " pointer-disabled" : ""}`}
          {...field}
          // label={label}
          error={!!error}
          sx={{ width: "15rem", "& fieldset": { border: "none" } }}
          variant="standard"
        >
          {(options as IOption[])?.map((option: IOption) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
};

export default SelectFormField;
