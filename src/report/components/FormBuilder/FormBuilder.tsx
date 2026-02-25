import { ChangeEventHandler, Fragment } from "react";
import { Control } from "react-hook-form";
import { IDropDownOption, IOption } from "../../../shared/types/general.types";
import Toggle from "../Toggle/Toggle";
import AutoCompleteFormField from "./AutoCompleteFormField";
import DropDownFormField from "./DropDownFormField";
import "./FormBuilder.scss";
import SelectFormField from "./SelectFormField";
import TextFormField from "./TextFormField";

export enum FormFieldType {
  Autocomplete,
  Select,
  TextField,
  DropDownInput,
  Toggle,
}

export type OptionsField = IOption[] | IDropDownOption[];

export interface IField {
  name: string;
  label: string;
  type: FormFieldType;
  readOnly?: boolean;
  options?: OptionsField;
  rules?: Record<string, any>;
  invisible?: boolean;
  regex?: RegExp;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

interface ISubForm {
  label?: string;
  readonly?: boolean;
  invisible?: boolean;
  fields: IField[];
}

interface IFormBuilderProps {
  subForms: ISubForm[];
  control: Control<any>;
}

const FormBuilder = ({ subForms, control }: IFormBuilderProps) => {
  const clearInvisible = (field: IField) => {
    return "";
  };

  const renderField = (field: IField) => {
    switch (field.type) {
      case FormFieldType.Autocomplete:
        return <AutoCompleteFormField field={field} control={control} />;

      case FormFieldType.Select:
        return <SelectFormField field={field} control={control} />;

      case FormFieldType.TextField:
        return <TextFormField field={field} control={control} />;

      case FormFieldType.DropDownInput:
        return <DropDownFormField field={field} control={control} />;

      case FormFieldType.Toggle:
        return (
          <Toggle
            name={field.name}
            control={control}
            text={field.label}
            readOnly={field.readOnly}
          />
        );

      default:
        return null;
    }
  };

  const renderedField = (field: IField) =>
    [
      FormFieldType.DropDownInput,
      FormFieldType.TextField,
      FormFieldType.Toggle,
    ].includes(field.type) ? (
      renderField(field)
    ) : (
      <>
        <span className="form--field__label">{field.label} </span>
        <span className="form--field__value">{renderField(field)}</span>
      </>
    );

  return (
    <>
      {subForms.map((subForm, subFormIndex) => (
        <Fragment key={subFormIndex}>
          {subForm.label ? (
            <p className="form--label">{subForm.label}</p>
          ) : null}
          <div className="form">
            {subForm.fields.map((field) => {
              return !field.invisible ? (
                <div
                  className={`form--field ${field.readOnly ? "pointer-disabled" : ""}`}
                  key={`${field.label}${field.type}${field.name}`}
                >
                  {renderedField(field)}
                </div>
              ) : (
                clearInvisible(field)
              );
            })}
          </div>
        </Fragment>
      ))}
    </>
  );
};

export default FormBuilder;
