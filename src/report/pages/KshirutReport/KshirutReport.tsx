import BackIcon from "@assets/report/backIcon.svg";
import ListIcon from "@assets/report/listIcon.svg";
import WarningIcon from "@assets/report/warningIcon.svg";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  NavigateOptions,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useAlertify } from "../../../contexts/AlertContext";
import { SitePaths } from "../../../router/routes";
import GeneralButton from "../../../shared/components/GeneralButton/GeneralButton";
import Loader from "../../../shared/components/Loader/Loader";
import { Params } from "../../../shared/services/param/useGetValuesRange";
import { useGetEmergencyGduds } from "../../../shared/services/tsavIrgunService/useGetEmergencyGduds";
import { useGetIsManeuveringGdud } from "../../../shared/services/tsavIrgunService/useGetIsManeuveringGdud";
import { useGetIsManeuveringRoutineGdud } from "../../../shared/services/tsavIrgunService/useGetIsManeuveringRoutineGdud";
import { useUpdateIsManeuveringGdud } from "../../../shared/services/tsavIrgunService/useUpdateIsManeuveringGdud";
import { paramsAtom } from "../../../shared/stores/params.store";
import { IDropDownOption, IOption } from "../../../shared/types/general.types";
import { IKshirutData } from "../../../shared/types/kshirutData.types";
import { Kshirut } from "../../../shared/types/params.types";
import {
  MatomoCategory,
  matomoEvent,
} from "../../../shared/utils/matomo.utils";
import FormBuilder, {
  FormFieldType,
  IField,
} from "../../components/FormBuilder/FormBuilder";
import KshirutReportHeadCard from "../../components/KshirutReportHeadCard/HeadCard";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import { useGetKshirutData } from "../../services/kshirutData/useGetKshirutData";
import { useUpdateKshirutData } from "../../services/kshirutData/useUpdateKshirutData";
import { useUpdateViewOnLoad } from "../../services/view/useUpdateView";
import { useGetZadikQuery } from "../../services/zadikData/useGetZadikData";
import { LogTypes } from "../../types/log.types";
import buttonStyles from "./Button.styles";
import "./KshirutReport.scss";

export type PageParams = Record<"zadikId", string>;
export type LocationState = {
  backButtonState: { path?: string; options?: NavigateOptions };
};
const kshirutFormFields = (params: Params, values?: IKshirutData): IField[] => {
  return [
    {
      name: "warKshirut",
      label: "כשירות מלחמה",
      options: params.kshirut
        .filter((o) => o.value !== "03")
        .map((option: IDropDownOption) => ({
          ...option,
          label: (
            <p className="relevant--container">
              <div
                className={
                  option.value === "01"
                    ? "relevant__circle__green"
                    : "relevant__circle__red"
                }
              ></div>
              {option.label}
            </p>
          ),
        })),
      type: FormFieldType.DropDownInput,
    },
    {
      name: "kshirut",
      label: "כשירות שגרה",
      options: params.kshirut
        .filter((o) => o.value !== Kshirut.Not_relevant)
        .map((option: IDropDownOption) => ({
          ...option,
          label: (
            <p className="relevant--container">
              <div
                className={
                  option.value === Kshirut.Kashir
                    ? "relevant__circle__green"
                    : "relevant__circle__red"
                }
              ></div>
              {option.label}
            </p>
          ),
        })),
      type: FormFieldType.DropDownInput,
    },
    {
      name: "decidingNonKshirutCause",
      label: "סיבת אי כשירות קובעת",
      options: params.decidingNonKshirutCause,
      type: FormFieldType.DropDownInput,
      invisible:
        values &&
        [Kshirut.Empty, Kshirut.Kashir].includes(values?.kshirut) &&
        [Kshirut.Empty, Kshirut.Kashir].includes(values?.warKshirut),
      rules: {
        required:
          values?.kshirut === Kshirut.Not_Kashir ||
          values?.warKshirut === Kshirut.Not_Kashir,
        message: "שדה חובה",
      },
    },
  ];
};

const isMahpilFormFields = (
  params: Params,
  options?: { disabled?: Partial<Record<keyof IKshirutData, boolean>> }
): IField[] => [
  {
    label: "האם הכלי מכפיל כח אג''מי",
    name: "isAgamForce",
    type: FormFieldType.Toggle,
    readOnly: options?.disabled?.isAgamForce ?? false,
  },
  {
    label: "האם הכלי מכפיל כח לוגיסטי",
    name: "isLogisticForce",
    type: FormFieldType.Toggle,
    readOnly: options?.disabled?.isLogisticForce ?? false,
  },
  {
    name: "equipmentTask",
    label: "משימת הכלי",
    options: params.equipmentTask,
    type: FormFieldType.DropDownInput,
  },
];

const detailsFormFields = (
  options: { params: Params; emergencyGduds: IOption[] },
  values?: IKshirutData
): IField[] => [
  {
    name: "tplnrRoutine",
    label: "שיוך בשגרה",
    readOnly: true,
    type: FormFieldType.TextField,
  },
  {
    name: "tplnrWar",
    label: "ציוות קרבי",
    options: [
      {
        label: "",
        value: "",
      },
      ...options.emergencyGduds,
    ],
    type: FormFieldType.DropDownInput,
  },
  {
    name: "isManeuveringGdud",
    label: "מצב מלחמה גדוד",
    options: [
      {
        label: (
          <p className="relevant--container">
            <div className="relevant__circle__green"></div>בלחימה
          </p>
        ),
        value: true,
      },
      {
        label: (
          <p className="relevant--container">
            <div className="relevant__circle__red"></div>לא בלחימה
          </p>
        ),
        value: false,
      },
    ],
    type: FormFieldType.DropDownInput,
    readOnly: !values?.tplnrWar,
  },
  {
    name: "job",
    label: "תפקיד/סימון הכלי",
    type: FormFieldType.TextField,
    regex: /^[א-תa-zA-Z0-9_\" .'*(),-]{0,40}$/,
  },
  {
    name: "pluga",
    label: "פלוגה",
    type: FormFieldType.TextField,
    regex: /^[א-תa-zA-Z0-9_\" .'*(),-]{0,40}$/,
  },
  {
    name: "phisicalLocation",
    label: "מיקום פיזי",
    options: options.params.physicalLocation,
    type: FormFieldType.DropDownInput,
  },
  {
    name: "phisicalLocationDesc",
    label: "תיאור מיקום פיזי",
    type: FormFieldType.TextField,
    regex:
      /^[א-תa-zA-Z0-9_\" .'*(),!#/+?:\\=\\\\\\¢\\½\\¾\\¼\\$\\%\\`\\@\\;\\>\\<\\«\\-]{0,40}$/,
  },
];

const KshirutReport = () => {
  const params = useRecoilValue(paramsAtom);
  const { zadikId } = useParams<PageParams>() as PageParams;
  const { alertify } = useAlertify();
  const location = useLocation();
  const locationState: LocationState | undefined = useLocation().state;

  const FaultListPath = `${SitePaths.FAULT_LIST}/${zadikId}`;
  const faultPath = `${SitePaths.FAULT_REPORT}?equnr=${zadikId}`;
  const { data: report, isLoading: isGetKshirutDataLoading } =
    useGetKshirutData(zadikId);
  const { data: gduds = [] } = useGetEmergencyGduds();
  const { data: getZadikData, isLoading: isZadikDataLoading, refetch: refetchZadik } =
    useGetZadikQuery({ equipment: zadikId });

  const { data: isManeuveringRoutineGdud } = useGetIsManeuveringRoutineGdud(
    report?.tplnrRoutine,
    !report?.tplnrWar &&
      gduds.some((eGdud) => eGdud.value === report?.tplnrRoutine)
  );

  const onSuccessGetIsManeuveringWarGdud = (isManeuveringGdud: boolean) => {
    setValue("isManeuveringGdud", isManeuveringGdud);
  };

  const onSuccessUpdateKshirutData = (updateKshirutData: IKshirutData) => {
    toast.success("דיווח כשירות נשמר בהצלחה");
  };

  const { mutate: mutateIsManeuveringWarGdud } = useGetIsManeuveringGdud({
    onSuccess: onSuccessGetIsManeuveringWarGdud,
  });

  useUpdateViewOnLoad(LogTypes.Zadik, zadikId);

  const { mutate: mutateUpdateIsManeuveringGdud } =
    useUpdateIsManeuveringGdud();

  const { isPending: isMutateKshirutDataPending, mutate: mutateKshirutData, mutateAsync: mutateKshirutAsync } =
    useUpdateKshirutData({
      onSuccess: onSuccessUpdateKshirutData,
    });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { dirtyFields, defaultValues },
  } = useForm<IKshirutData>({ defaultValues: getZadikData });

  useEffect(() => {
    if (!report) {
      return;
    }

    reset({
      ...report,
      tplnrRoutine: `${report.tplnrRoutine} - ${report.locationDescRoutine}`,
      isManeuveringGdud: report.tplnrWar
        ? report.isManeuveringGdud
        : isManeuveringRoutineGdud,
    } as IKshirutData);
  }, [report, reset, isManeuveringRoutineGdud]);
  const oldData = defaultValues as IKshirutData;
  let form = watch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IKshirutData> = (data: IKshirutData) => {
    if (!report) {
      return;
    }

    if (
      (data.kshirut === Kshirut.Not_Kashir ||
        data.warKshirut === Kshirut.Not_Kashir) &&
      report?.openFaults === 0
    ) {
      handleNotKashir(data);
      return;
    }

    if (Object.keys(dirtyFields).length !== 0) {
      if (dirtyFields.isManeuveringGdud) {
        mutateUpdateIsManeuveringGdud({
          gdud: data.tplnrWar,
          isManeuvering: data.isManeuveringGdud!,
        });
      }

      if (
        Object.keys(dirtyFields).find(
          (k) => k !== "isManeuveringGdud" && dirtyFields[k]
        )
      ) {
        const dataToSend: IKshirutData = { ...data };
        if (dataToSend.kshirut != report?.kshirut) {
          matomoEvent(
            "change kshirut",
            MatomoCategory.ClICK,
            dataToSend.kshirut,
            0
          );
        }
        if (dataToSend.warKshirut != report?.warKshirut) {
          matomoEvent(
            "change kshirut war",
            MatomoCategory.ClICK,
            dataToSend.warKshirut,
            0
          );
        }

        mutateKshirutData(dataToSend);
      }

      reset((prev) => ({
        ...data,
        equipment: prev.equipment,
        tplnrRoutine: prev.tplnrRoutine,
        tplnrWar: prev.tplnrWar,
        isManeuveringGdud: prev.isManeuveringGdud,
      }));
    }
  };

  const handleNotKashir = (data: IKshirutData) => {
    const dataToSend: IKshirutData = {
      ...data,
      kshirut: oldData.kshirut,
      warKshirut: oldData.warKshirut,
      decidingNonKshirutCause: oldData.decidingNonKshirutCause,
    };

    mutateKshirutAsync(dataToSend).then(updatedKshirut => {
      reset((prev) => prev);
  
      navigate(`../${faultPath}`, {
        state: {
          fromNotKashir: true,
          kshirutData: {...updatedKshirut,...data},
        },
      });
    })
  };

  const alertBeforeNav = (path?: string, state?: NavigateOptions) => {
    alertify({
      messageType: "Unknown",
      msgContent: { message: "שונו נתונים במסך, האם ברצונך לצאת ללא שמירה?" },
      buttons: [
        {
          text: "צא ללא שמירה",
          onClick: () => {
            path ? navigate(`../${path}`, state) : navigate(-1);
          },
          variant: "outlined",
        },
      ],
    });
  };

  const onBackButtonNavigate = () => {
    if (!locationState?.backButtonState) {
      if (getZadikData?.materialFamily) {
        onNavigate(`${SitePaths.FAMILY}/${getZadikData.materialFamily}`);
        return;
      } else {
        onNavigate();
        return;
      }
    }
    onNavigate(
      locationState.backButtonState.path,
      locationState.backButtonState.options
    );
  };

  const onNavigate = (path?: string | number, state?: NavigateOptions) => {
    if (typeof path === "number") {
      navigate(path);
      return;
    }

    Object.keys(dirtyFields)?.find((k) => dirtyFields[k])
      ? alertBeforeNav(path, state)
      : path
        ? typeof path === "number"
          ? navigate(path, state)
          : navigate(`../${path}`, state)
        : navigate(-1);
  };

  useEffect(() => {
    if (!form.tplnrWar) {
      setValue("isManeuveringGdud", isManeuveringRoutineGdud);
    } else {
      mutateIsManeuveringWarGdud({ tplnr: form.tplnrWar });
    }
  }, [form.tplnrWar]);

  useEffect(() => {
    if (
      (dirtyFields.kshirut || dirtyFields.kshirut) &&
      form.kshirut === Kshirut.Kashir &&
      form.warKshirut === Kshirut.Kashir
    ) {
      setValue("decidingNonKshirutCause", "");
    }
  }, [form.kshirut, form.warKshirut]);

  return (
    <>
      {(isGetKshirutDataLoading ||
        isMutateKshirutDataPending ||
        isZadikDataLoading) && <Loader />}
      <PageLayout
        title={"דיווח כשירות"}
        backButton={
          location.key !== "default"
            ? {
                button: <img className="headerButton" src={BackIcon} />,
                function: () => onBackButtonNavigate(),
              }
            : undefined
        }
        footerElement={<GeneralButton text="שמור" form="kshirutForm" />}
      >
        <div className="kshirut--container">
          {getZadikData && <KshirutReportHeadCard zadik={getZadikData} />}
          <div className="kshirut--buttonGroup">
            <Button
              onClick={() => onNavigate(FaultListPath)}
              sx={buttonStyles.navigateButton}
            >
              <img src={ListIcon} className="kshirut--buttonGroup__icon" />
              <p>רשימת תקלות</p>
            </Button>
            <Button
              onClick={() => {
                onNavigate(faultPath);
              }}
              sx={buttonStyles.navigateButton}
            >
              <img src={WarningIcon} className="kshirut--buttonGroup__icon" />
              <p>דיווח תקלה</p>
            </Button>
          </div>
          <div className="toast-container">
            <Toaster />
          </div>
          <form
            id="kshirutForm"
            className="kshirut--container__form"
            onSubmit={handleSubmit(onSubmit)}
            onKeyPress={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            <FormBuilder
              subForms={[
                {
                  fields: kshirutFormFields(params, {
                    ...form,
                  }),
                },
                {
                  fields: isMahpilFormFields(params, {
                    disabled: { isAgamForce: form.isAgamForceFromMaterial },
                  }),
                },
                {
                  fields: detailsFormFields(
                    { params: params, emergencyGduds: gduds },
                    { ...form }
                  ),
                },
              ]}
              control={control}
            />
          </form>
        </div>
      </PageLayout>
    </>
  );
};
export default KshirutReport;
