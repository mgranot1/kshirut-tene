import { useRecoilValue } from "recoil";
import { paramsAtom } from "../../../shared/stores/params.store";
import {
  FaultStatus,
  PhysicalLocation,
} from "../../../shared/types/params.types";
import {
  FormFieldType,
  IField,
} from "../../components/FormBuilder/FormBuilder";

const TEL_NUM_LENGTH = 10;

interface UseReportFaultFieldsProps {
  formFaultStatus: FaultStatus;
  fieldsAreReadOnly: boolean;
  formPhisicalLocation: string;
}

const useReportFaultFields = ({
  formFaultStatus,
  fieldsAreReadOnly: readOnly,
  formPhisicalLocation,
}: UseReportFaultFieldsProps) => {
  const params = useRecoilValue(paramsAtom);

  const topFields: IField[] = [
    {
      name: "essence",
      label: "מהות התקלה",
      type: FormFieldType.TextField,
      regex:
        /^[א-תa-zA-Z0-9_\" .'*(),!#/+?:\\=\\\\\\¢\\½\\¾\\¼\\$\\%\\`\\@\\;\\>\\<\\«\\-]{0,250}$/,
      rules: {
        required: true,
        message: "שדה חובה",
      },
      readOnly,
    },
  ];

  const statusFields: IField[] = [
    {
      name: "faultStatus",
      label: "סטטוס",
      type: FormFieldType.DropDownInput,
      options: params.faultStatus,
      readOnly: false,
    },
  ];

  const faultDataFields: IField[] = [
    {
      name: "expectedTime",
      label: "צפי תיקון",
      options: params.expectedTime,
      type: FormFieldType.DropDownInput,
      readOnly,
    },

    {
      name: "grindType",
      label: "סוג שחיקה",
      options: params.grindType,
      type: FormFieldType.DropDownInput,
      readOnly,
      rules: {
        required: formFaultStatus !== FaultStatus.Cancelled,
        message: "שדה חובה",
      },
    },
    {
      name: "availabilityInhibitor",
      label: "מעכבי זמינות",
      options: params.availabilityInhibitor,
      type: FormFieldType.DropDownInput,
      readOnly,
    },

    {
      name: "contact",
      label: "איש קשר",
      type: FormFieldType.TextField,
      regex:
        /^[א-תa-zA-Z0-9_\" .'*(),!#/+?:\\=\\\\\\¢\\½\\¾\\¼\\$\\%\\`\\@\\;\\>\\<\\«\\-]{0,40}$/,
      readOnly,
    },
    {
      name: "phoneNumber",
      label: "טלפון איש קשר",
      type: FormFieldType.TextField,
      readOnly,
      regex: /^[0-9]{0,10}$/,
      rules: {
        maxLength: TEL_NUM_LENGTH,
        pattern: /^\d*$/,
        message: "טלפון לא תקין",
      },
    },
    {
      name: "phisicalLocation",
      label: "מיקום פיזי",
      type: FormFieldType.DropDownInput,
      options: params.physicalLocation,
      readOnly,
      rules: {
        required: formFaultStatus !== FaultStatus.Cancelled,
        message: "שדה חובה",
      },
    },
    {
      name: "phisicalLocationDesc",
      label: "תיאור מיקום פיזי",
      type: FormFieldType.TextField,
      regex:
        /^[א-תa-zA-Z0-9_\" .'*(),!#/+?:\\=\\\\\\¢\\½\\¾\\¼\\$\\%\\`\\@\\;\\>\\<\\«\\-]{0,40}$/,
      readOnly,
    },
    {
      name: "mobileAbility",
      label: "יכולת תנועה",
      options: params.mobileAbility,
      type: FormFieldType.DropDownInput,

      readOnly,
      rules: {
        required:
          formPhisicalLocation === PhysicalLocation.CombatSpace &&
          formFaultStatus !== FaultStatus.Cancelled,
        message: "שדה חובה",
      },
    },
    {
      name: "isWinchRequired",
      label: "נדרש מוביל כננת",
      type: FormFieldType.Toggle,
      invisible: formFaultStatus !== FaultStatus.WaitingForTransportation,
    },
    {
      name: "note",
      label: "הערה",
      type: FormFieldType.TextField,
      regex:
        /^[א-תa-zA-Z0-9_\" .'*(),!#/+?:\\=\\\\\\¢\\½\\¾\\¼\\$\\%\\`\\@\\;\\>\\<\\«\\-]{0,40}$/,
      readOnly,
    },
  ];

  const goremMetapelFields: IField[] = [
    {
      name: "dereg",
      label: "דרג טיפול",
      options: params.dereg,
      type: FormFieldType.DropDownInput,
      readOnly,
    },
    {
      name: "reqSquad",
      label: "חוליה נדרשת",
      options: params.reqSquad,
      type: FormFieldType.DropDownInput,
      readOnly,
      invisible: formFaultStatus !== FaultStatus.WaitingForSquad,
      rules: {
        required: formFaultStatus === FaultStatus.WaitingForSquad,
        message: "שדה חובה",
      },
    },
    {
      name: "squad",
      label: "חוליה מוקצית",
      type: FormFieldType.TextField,
      readOnly,
      invisible: formFaultStatus !== FaultStatus.WaitingForSquad,
    },
  ];

  return { topFields, statusFields, faultDataFields, goremMetapelFields };
};

export default useReportFaultFields;
