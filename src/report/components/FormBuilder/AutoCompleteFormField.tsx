import { Autocomplete, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { IOption } from "../../../shared/types/general.types";
import { IField } from "./FormBuilder";

type AutoCompleteFormFieldProps = {
  field: IField;
  control: Control<any>;
};

const AutoCompleteFormField = (props: AutoCompleteFormFieldProps) => {
  const { name, readOnly, options, rules, label } = props.field;

  return (
    <Controller
      key={name}
      name={name}
      control={props.control}
      rules={rules}
      disabled={readOnly}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          options={(options as IOption[]) ?? []}
          getOptionLabel={(option: IOption) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              className={`textField__input${readOnly ? " disabled pointer-disabled" : ""}`}
              variant="standard"
              label={label}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      )}
    />
  );
};

export default AutoCompleteFormField;
