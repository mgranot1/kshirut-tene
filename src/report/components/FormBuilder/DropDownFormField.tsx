import { Control, Controller } from "react-hook-form";
import { IDropDownOption } from "../../../shared/types/general.types";
import DropDownInput from "../DropDownInput/DropDownInput";
import { IField } from "./FormBuilder";

type DropDownFormFieldProps = {
  field: IField;
  control: Control<any>;
};

function DropDownFormField(props: DropDownFormFieldProps) {
  const { name, readOnly, rules, label, options } = props.field;
  return (
    <Controller
      key={name}
      name={name}
      control={props.control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <>
          <DropDownInput
            {...field}
            label={label}
            options={
              options && options?.length > 0
                ? (options as IDropDownOption[])
                : []
            }
            onChange={(value) => {
              field.onBlur();
              field.onChange(value);
            }}
            disabled={readOnly}
          />
          {!!error && <p className="form__errorMessage">{rules?.message}</p>}
        </>
      )}
    />
  );
}

export default DropDownFormField;
