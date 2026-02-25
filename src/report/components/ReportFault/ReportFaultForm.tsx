import ArrowIcon from "@mui/icons-material/ArrowBackIos";
import ReportGmailErrorIcon from "@mui/icons-material/ReportGmailerrorred";
import { BaseSyntheticEvent } from "react";
import { Control } from "react-hook-form";
import { IFaultDataForm } from "../../pages/ReportFault/ReportFault";
import { IFault } from "../../types/fault.types";
import FormBuilder, { IField } from "../FormBuilder/FormBuilder";

type ReportFaultFormProps = {
  onFormSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  onNavToAdditionals: () => void;
  statusFields: IField[];
  goremMetapelFields: IField[];
  topFields: IField[];
  faultDataFields: IField[];
  formControl: Control<IFaultDataForm, any>;
  isError: boolean;
  selectedFault: IFault;
};

export default function ReportFaultForm(props: ReportFaultFormProps) {
  const additionalsLength: number =
    (props.selectedFault?.hhs?.length || 0) +
    (props.selectedFault?.means?.length || 0);

  return (
    <form
      id="faultForm"
      className="reportFault__form"
      onSubmit={props.onFormSubmit}
      onKeyPress={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <FormBuilder
        subForms={[{ fields: props.topFields }]}
        control={props.formControl}
      />
      <FormBuilder
        subForms={[{ fields: props.statusFields }]}
        control={props.formControl}
      />

      <div
        className="reportFault__extrasButtonContainer"
        onClick={() => {
          props.onNavToAdditionals();
        }}
      >
        <p className="reportFault__extrasTitle">ח"ח ואמצעים נדרשים</p>
        <div className="reportFault__extrasButton">
          <p className={`reportFault__extrasButtonText`}>
            {props.isError && (
              <ReportGmailErrorIcon className="reportFault__error" />
            )}
            {`${
              additionalsLength > 0
                ? `${additionalsLength} פריטים`
                : "לא נבחרו פריטים"
            }`}
          </p>
          <ArrowIcon sx={{ fontSize: "0.8rem", color: "#C5CFD8" }} />
        </div>
      </div>

      <FormBuilder
        subForms={[{ label: "גורם מטפל", fields: props.goremMetapelFields }]}
        control={props.formControl}
      />
      <FormBuilder
        subForms={[{ label: "פרטי תקלה", fields: props.faultDataFields }]}
        control={props.formControl}
      />
    </form>
  );
}
