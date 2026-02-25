import { Control, Controller } from "react-hook-form";
import { IField } from "./FormBuilder";

type TextFormFieldProps = {
  field: IField;
  control: Control<any>;
};

function TextFormField(props: TextFormFieldProps) {
  const { name, readOnly, rules, label, regex } = props.field;

  return (
    <Controller
      key={name}
      name={name}
      control={props.control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <>
          <label className="textField">
            {label}
            <input
              {...field}
              onChange={(e) => {
                if (regex && !regex.test(e.currentTarget.value)) {
                  e.stopPropagation();
                  e.preventDefault();
                  // field.onChange(field.value)
                  return;
                } else {
                  field.onChange(e);
                }
              }}
              readOnly={readOnly}
              type="text"
              inputMode="text"
              autoComplete="off"
              className={`textField__input${readOnly ? " disabled pointer-disabled" : ""}`}
            />
          </label>
          {!!error && <p className="form__errorMessage">{rules?.message}</p>}
        </>
      )}
    />
  );
}

export default TextFormField;
